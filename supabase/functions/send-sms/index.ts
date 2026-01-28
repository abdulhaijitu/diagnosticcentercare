import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type SmsProvider = "reve" | "khudebarta";

interface SmsPayload {
  phone: string;
  message: string;
  provider?: SmsProvider;
}

interface ProviderConfig {
  apiKey: string;
  senderId: string;
  apiUrl: string;
}

// Reve SMS API integration
async function sendViaReve(phone: string, message: string, config: ProviderConfig): Promise<{ success: boolean; response?: unknown; error?: string }> {
  try {
    // Reve SMS API format
    // Documentation: https://www.revecloud.com/
    const url = new URL(config.apiUrl || "https://api.revecloud.com/sms/send");
    
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        to: phone,
        message: message,
        sender_id: config.senderId,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, response: data };
    } else {
      return { success: false, error: data.message || "Failed to send SMS via Reve" };
    }
  } catch (error) {
    console.error("Reve SMS error:", error);
    return { success: false, error: String(error) };
  }
}

// Khudebarta SMS API integration
async function sendViaKhudebarta(phone: string, message: string, config: ProviderConfig): Promise<{ success: boolean; response?: unknown; error?: string }> {
  try {
    // Khudebarta SMS API format
    // Documentation: https://khudebarta.com/
    const url = new URL(config.apiUrl || "https://api.khudebarta.com/v1/sms/send");
    
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": config.apiKey,
      },
      body: JSON.stringify({
        recipient: phone,
        text: message,
        sender: config.senderId,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, response: data };
    } else {
      return { success: false, error: data.error || "Failed to send SMS via Khudebarta" };
    }
  } catch (error) {
    console.error("Khudebarta SMS error:", error);
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
    
    // Get SMS configuration from environment
    const smsApiKey = Deno.env.get("SMS_API_KEY");
    const smsSenderId = Deno.env.get("SMS_SENDER_ID");
    const smsApiUrl = Deno.env.get("SMS_API_URL"); // Optional custom URL
    const defaultProvider = (Deno.env.get("SMS_PROVIDER") || "reve") as SmsProvider;

    // Check if SMS is configured
    if (!smsApiKey || !smsSenderId) {
      console.log("SMS not configured - missing SMS_API_KEY or SMS_SENDER_ID");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "SMS gateway not configured. Please add SMS_API_KEY and SMS_SENDER_ID secrets." 
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: SmsPayload = await req.json();
    const { phone, message, provider = defaultProvider } = payload;

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize phone number (ensure it has country code)
    let normalizedPhone = phone.replace(/\s+/g, "").replace(/-/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "880" + normalizedPhone.substring(1); // Bangladesh country code
    } else if (!normalizedPhone.startsWith("+") && !normalizedPhone.startsWith("880")) {
      normalizedPhone = "880" + normalizedPhone;
    }

    const config: ProviderConfig = {
      apiKey: smsApiKey,
      senderId: smsSenderId,
      apiUrl: smsApiUrl || "",
    };

    console.log(`Sending SMS via ${provider} to ${normalizedPhone}`);

    let result: { success: boolean; response?: unknown; error?: string };

    switch (provider) {
      case "khudebarta":
        result = await sendViaKhudebarta(normalizedPhone, message, config);
        break;
      case "reve":
      default:
        result = await sendViaReve(normalizedPhone, message, config);
        break;
    }

    // Log SMS attempt to database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabaseAdmin.from("sms_logs").insert({
      phone: normalizedPhone,
      message: message,
      provider: provider,
      status: result.success ? "sent" : "failed",
      response: result.response || result.error,
    }).catch((err) => {
      console.error("Failed to log SMS:", err);
    });

    if (result.success) {
      return new Response(
        JSON.stringify({ success: true, provider, response: result.response }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
