import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationPayload {
  userId: string;
  type: "booking_confirmed" | "sample_assigned" | "sample_collected" | "processing_started" | "report_ready";
  data: {
    requestId?: string;
    testNames?: string[];
    date?: string;
    time?: string;
    staffName?: string;
    [key: string]: unknown;
  };
}

// Template variable replacement
function replaceTemplateVariables(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === "test_names" && Array.isArray(data.testNames)) {
      return data.testNames.join(", ");
    }
    return String(data[key] ?? "");
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create admin client for inserting notifications
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const payload: NotificationPayload = await req.json();
    const { userId, type, data } = payload;

    if (!userId || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get notification settings for this type
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from("notification_settings")
      .select("*")
      .eq("notification_type", type)
      .single();

    if (settingsError) {
      console.error("Failed to fetch notification settings:", settingsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch notification settings" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if any channel is enabled
    if (!settings.in_app_enabled && !settings.sms_enabled && !settings.whatsapp_enabled && !settings.email_enabled) {
      return new Response(
        JSON.stringify({ message: "All notification channels are disabled for this type" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build channels array
    const channels: string[] = [];
    if (settings.in_app_enabled) channels.push("in_app");
    if (settings.sms_enabled) channels.push("sms");
    if (settings.whatsapp_enabled) channels.push("whatsapp");
    if (settings.email_enabled) channels.push("email");

    // Replace template variables
    const title = replaceTemplateVariables(settings.template_title || type, data);
    const message = replaceTemplateVariables(settings.template_message || "", data);

    // Insert notification
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: userId,
        type: type,
        title: title,
        message: message,
        data: data,
        channels: channels,
      })
      .select()
      .single();

    if (notificationError) {
      console.error("Failed to insert notification:", notificationError);
      return new Response(
        JSON.stringify({ error: "Failed to create notification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create logs for each channel
    const logs = channels.map((channel) => ({
      notification_id: notification.id,
      user_id: userId,
      channel: channel,
      status: channel === "in_app" ? "delivered" : "pending",
      delivered_at: channel === "in_app" ? new Date().toISOString() : null,
      metadata: {
        type,
        ...data,
      },
    }));

    const { error: logsError } = await supabaseAdmin
      .from("notification_logs")
      .insert(logs);

    if (logsError) {
      console.error("Failed to insert notification logs:", logsError);
      // Don't fail the request, logs are for auditing
    }

    // Send via SMS gateway if enabled
    if (settings.sms_enabled) {
      try {
        // Get user's phone number from profiles
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("phone")
          .eq("id", userId)
          .single();

        if (profile?.phone) {
          const smsResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              phone: profile.phone,
              message: message,
            }),
          });

          const smsResult = await smsResponse.json();
          console.log(`[SMS] Sent to ${profile.phone}:`, smsResult);

          // Update log status
          await supabaseAdmin
            .from("notification_logs")
            .update({
              status: smsResult.success ? "delivered" : "failed",
              delivered_at: smsResult.success ? new Date().toISOString() : null,
              metadata: { ...data, sms_response: smsResult },
            })
            .eq("notification_id", notification.id)
            .eq("channel", "sms");
        } else {
          console.log(`[SMS] No phone number for user ${userId}`);
        }
      } catch (smsError) {
        console.error("[SMS] Failed:", smsError);
      }
    }

    // Send via WhatsApp gateway if enabled
    if (settings.whatsapp_enabled) {
      try {
        // Get user's phone number from profiles
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("phone")
          .eq("id", userId)
          .single();

        if (profile?.phone) {
          const whatsappResponse = await fetch(`${supabaseUrl}/functions/v1/send-whatsapp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              phone: profile.phone,
              message: message,
              // Use template for first contact (customize template name as needed)
              templateName: "notification_update",
              templateParams: [title, message],
            }),
          });

          const whatsappResult = await whatsappResponse.json();
          console.log(`[WhatsApp] Sent to ${profile.phone}:`, whatsappResult);

          // Update log status
          await supabaseAdmin
            .from("notification_logs")
            .update({
              status: whatsappResult.success ? "delivered" : "failed",
              delivered_at: whatsappResult.success ? new Date().toISOString() : null,
              metadata: { ...data, whatsapp_response: whatsappResult },
            })
            .eq("notification_id", notification.id)
            .eq("channel", "whatsapp");
        } else {
          console.log(`[WhatsApp] No phone number for user ${userId}`);
        }
      } catch (whatsappError) {
        console.error("[WhatsApp] Failed:", whatsappError);
      }
    }

    if (settings.email_enabled) {
      console.log(`[Email] Would send to user ${userId}: ${message}`);
      // TODO: Integrate with email provider (e.g., Resend, SendGrid)
    }

    return new Response(
      JSON.stringify({
        success: true,
        notification: notification,
        channels: channels,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
