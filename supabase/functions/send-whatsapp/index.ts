import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppPayload {
  phone: string;
  message: string;
  templateName?: string;
  templateParams?: string[];
}

// WhatsApp Business Cloud API integration
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  config: {
    accessToken: string;
    phoneNumberId: string;
    templateName?: string;
    templateParams?: string[];
  }
): Promise<{ success: boolean; response?: unknown; error?: string }> {
  try {
    // Meta WhatsApp Business Cloud API
    const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;

    // Normalize phone number (ensure it has country code, no + prefix for API)
    let normalizedPhone = phone.replace(/\s+/g, "").replace(/-/g, "").replace("+", "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "880" + normalizedPhone.substring(1); // Bangladesh country code
    } else if (!normalizedPhone.startsWith("880")) {
      normalizedPhone = "880" + normalizedPhone;
    }

    let body: Record<string, unknown>;

    if (config.templateName) {
      // Use template message (required for first contact within 24h)
      body = {
        messaging_product: "whatsapp",
        to: normalizedPhone,
        type: "template",
        template: {
          name: config.templateName,
          language: { code: "en" },
          components: config.templateParams?.length
            ? [
                {
                  type: "body",
                  parameters: config.templateParams.map((text) => ({
                    type: "text",
                    text,
                  })),
                },
              ]
            : undefined,
        },
      };
    } else {
      // Regular text message (only works within 24h window)
      body = {
        messaging_product: "whatsapp",
        to: normalizedPhone,
        type: "text",
        text: { body: message },
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, response: data };
    } else {
      return {
        success: false,
        error: data.error?.message || "Failed to send WhatsApp message",
      };
    }
  } catch (error) {
    console.error("WhatsApp API error:", error);
    return { success: false, error: String(error) };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get WhatsApp configuration from environment
    const whatsappAccessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    const whatsappPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

    // Check if WhatsApp is configured
    if (!whatsappAccessToken || !whatsappPhoneNumberId) {
      console.log("WhatsApp not configured - missing credentials");
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "WhatsApp gateway not configured. Please add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID secrets.",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload: WhatsAppPayload = await req.json();
    const { phone, message, templateName, templateParams } = payload;

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Sending WhatsApp message to ${phone}`);

    const result = await sendWhatsAppMessage(phone, message, {
      accessToken: whatsappAccessToken,
      phoneNumberId: whatsappPhoneNumberId,
      templateName,
      templateParams,
    });

    // Log WhatsApp attempt to database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    try {
      await supabaseAdmin.from("whatsapp_logs").insert({
        phone: phone,
        message: message,
        template_name: templateName || null,
        status: result.success ? "sent" : "failed",
        response: result.response || result.error,
      });
    } catch (logErr) {
      console.error("Failed to log WhatsApp message:", logErr);
    }

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, response: result.response }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
