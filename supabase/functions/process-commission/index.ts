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

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Authentication required' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !userData.user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Verify admin status using secure RPC
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc(
      'is_user_admin',
      { user_id: userData.user.id }
    );

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!isAdmin) {
      console.error('Non-admin user attempted access:', userData.user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const { paymentId, action } = await req.json();

    if (action === "verify_payment") {
      // Validate payment ID
      if (!paymentId || typeof paymentId !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid payment ID' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

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

      // Audit log
      console.log(`Admin ${userData.user.id} verified payment ${paymentId}`);

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

      // Validate inputs
      if (!providerId || typeof providerId !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid provider ID' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }

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

      // Audit log
      console.log(`Admin ${userData.user.id} created payout ${payout.id} for provider ${providerId}, amount: ${amount}`);

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