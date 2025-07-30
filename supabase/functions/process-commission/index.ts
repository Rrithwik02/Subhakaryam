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
      // Enhanced verification for large payments
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from("payments")
        .select(`
          *,
          bookings!inner(
            id,
            provider_id,
            service_providers!inner(
              id,
              profile_id,
              is_premium
            )
          )
        `)
        .eq("id", paymentId)
        .single();

      if (paymentError) throw paymentError;

      // Calculate fraud score based on various factors
      let fraudScore = 0;
      
      // Check payment amount (higher amounts get higher score)
      if (payment.amount > 50000) fraudScore += 30;
      else if (payment.amount > 20000) fraudScore += 20;
      else if (payment.amount > 10000) fraudScore += 10;

      // Check payment frequency for this user
      const { data: recentPayments } = await supabaseAdmin
        .from("payments")
        .select("id")
        .eq("booking_id", payment.booking_id)
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (recentPayments && recentPayments.length > 3) {
        fraudScore += 25; // Multiple payments in 24h
      }

      // Determine verification status
      let verificationStatus = "verified";
      if (fraudScore >= 50) verificationStatus = "flagged";
      else if (fraudScore >= 30) verificationStatus = "requires_review";

      // Update payment with verification info
      await supabaseAdmin
        .from("payments")
        .update({
          fraud_score: fraudScore,
          verification_status: verificationStatus,
        })
        .eq("id", paymentId);

      // Log verification
      await supabaseAdmin
        .from("payment_verification_logs")
        .insert({
          payment_id: paymentId,
          verification_type: "automated",
          status: verificationStatus === "verified" ? "approved" : "flagged",
          fraud_score: fraudScore,
          verification_data: {
            amount_check: payment.amount,
            frequency_check: recentPayments?.length || 0,
            timestamp: new Date().toISOString(),
          },
        });

      return new Response(
        JSON.stringify({
          success: true,
          verification_status: verificationStatus,
          fraud_score: fraudScore,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "process_payout") {
      const { providerId, amount } = await req.json();

      // Get provider commission info
      const { data: commission, error: commissionError } = await supabaseAdmin
        .from("service_provider_commissions")
        .select("*")
        .eq("provider_id", providerId)
        .single();

      if (commissionError) throw commissionError;

      // Calculate commission and net amount
      const commissionAmount = amount * (commission.commission_rate / 100);
      const netAmount = amount - commissionAmount;

      // Create payout record
      const { data: payout, error: payoutError } = await supabaseAdmin
        .from("payouts")
        .insert({
          provider_id: providerId,
          amount: amount,
          commission_amount: commissionAmount,
          net_amount: netAmount,
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
          net_amount: netAmount,
          commission_amount: commissionAmount,
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
    console.error("Commission processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});