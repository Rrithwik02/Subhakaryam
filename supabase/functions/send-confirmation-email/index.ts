import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  confirmationUrl: string;
  type: 'confirmation' | 'password_reset' | 'email_change';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, type }: EmailRequest = await req.json();

    const getEmailContent = (type: string) => {
      switch (type) {
        case 'confirmation':
          return {
            subject: "Confirm your Subhakaryam account",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #8B4513; font-size: 28px; margin: 0;">Subhakaryam</h1>
                  <p style="color: #666; margin: 10px 0;">Traditional Services Platform</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #333; margin-top: 0;">Welcome to Subhakaryam!</h2>
                  <p style="color: #666; line-height: 1.6;">
                    Thank you for joining our platform. Please confirm your email address to activate your account.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="background: #B8860B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                      Confirm Email Address
                    </a>
                  </div>
                  
                  <p style="color: #999; font-size: 14px; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${confirmationUrl}" style="color: #B8860B; word-break: break-all;">${confirmationUrl}</a>
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    If you didn't create an account with Subhakaryam, you can safely ignore this email.
                  </p>
                  <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                    This email was sent from a trusted source. For support, contact us at support@subhakaryam.org
                  </p>
                </div>
              </div>
            `
          };
        case 'password_reset':
          return {
            subject: "Reset your Subhakaryam password",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #8B4513; font-size: 28px; margin: 0;">Subhakaryam</h1>
                  <p style="color: #666; margin: 10px 0;">Password Reset Request</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                  <p style="color: #666; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to create a new password.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="background: #B8860B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                      Reset Password
                    </a>
                  </div>
                  
                  <p style="color: #999; font-size: 14px; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${confirmationUrl}" style="color: #B8860B; word-break: break-all;">${confirmationUrl}</a>
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    If you didn't request a password reset, you can safely ignore this email.
                  </p>
                </div>
              </div>
            `
          };
        default:
          return {
            subject: "Subhakaryam - Action Required",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #8B4513; font-size: 28px; margin: 0;">Subhakaryam</h1>
                </div>
                
                <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #333; margin-top: 0;">Action Required</h2>
                  <p style="color: #666; line-height: 1.6;">
                    Please click the link below to complete your action.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" 
                       style="background: #B8860B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                      Continue
                    </a>
                  </div>
                </div>
              </div>
            `
          };
      }
    };

    const emailContent = getEmailContent(type);

    const emailResponse = await resend.emails.send({
      from: "Subhakaryam <noreply@subhakaryam.org>",
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);