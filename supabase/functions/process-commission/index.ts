import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { paymentId, action } = await req.json();

    if (action === "verify_payment") {
      // Simple payment verification (no commission calculation)
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (paymentError) throw paymentError;

      // Update payment as verified
      await supabaseAdmin
        .from("payments")
        .update({
          admin_verified: true,
        })
        .eq("id", paymentId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment verified successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "process_payout") {
      const { providerId, amount } = await req.json();

      // Create payout record (no commission deduction)
      const { data: payout, error: payoutError } = await supabaseAdmin
        .from("payouts")
        .insert({
          provider_id: providerId,
          amount: amount,
          net_amount: amount, // No commission, so net amount equals amount
          status: "pending",
          payout_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (payoutError) throw payoutError;

      return new Response(
        JSON.stringify({
          success: true,
          payout_id: payout.id,
          net_amount: amount,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});