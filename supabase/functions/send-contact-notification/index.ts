import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message, adminEmail }: ContactNotificationRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message || !adminEmail) {
      throw new Error("Missing required fields");
    }

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const currentDate = new Date().toLocaleString('bn-BD', { 
      timeZone: 'Asia/Dhaka',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d9488, #14b8a6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
          .value { margin-top: 4px; color: #111827; }
          .message-box { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 10px; }
          .footer { text-align: center; padding: 15px; color: #9ca3af; font-size: 12px; }
          .btn { display: inline-block; background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 20px;">📬 নতুন যোগাযোগ বার্তা</h1>
            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">${currentDate}</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">প্রেরকের নাম</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">ইমেইল</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            ${phone ? `
            <div class="field">
              <div class="label">ফোন নম্বর</div>
              <div class="value"><a href="tel:${phone}">${phone}</a></div>
            </div>
            ` : ''}
            <div class="field">
              <div class="label">বিষয়</div>
              <div class="value" style="font-weight: 600;">${subject}</div>
            </div>
            <div class="field">
              <div class="label">বার্তা</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="btn">
              ✉️ উত্তর দিন
            </a>
          </div>
          <div class="footer">
            এই ইমেইলটি Trust Care Diagnostic ওয়েবসাইট থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend API directly
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Trust Care Diagnostic <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `নতুন যোগাযোগ বার্তা: ${subject}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Contact notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-contact-notification function:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
