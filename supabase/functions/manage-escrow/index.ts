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

    const { action, paymentId, bookingId, amount, reason } = await req.json();

    if (action === "create_escrow") {
      // Create escrow payment
      const autoReleaseDate = new Date();
      autoReleaseDate.setDate(autoReleaseDate.getDate() + 7); // Auto-release after 7 days

      const { data: escrow, error: escrowError } = await supabaseAdmin
        .from("escrow_payments")
        .insert({
          payment_id: paymentId,
          booking_id: bookingId,
          amount: amount,
          status: "held",
          auto_release_date: autoReleaseDate.toISOString(),
          release_condition: "completion_confirmation",
        })
        .select()
        .single();

      if (escrowError) throw escrowError;

      // Update payment escrow status
      await supabaseAdmin
        .from("payments")
        .update({ escrow_status: "held" })
        .eq("id", paymentId);

      return new Response(
        JSON.stringify({
          success: true,
          escrow_id: escrow.id,
          auto_release_date: autoReleaseDate.toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "release_escrow") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("No authorization header");

      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      const userId = userData.user?.id;

      // Update escrow status to released
      const { error: escrowError } = await supabaseAdmin
        .from("escrow_payments")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
          released_by: userId,
        })
        .eq("payment_id", paymentId);

      if (escrowError) throw escrowError;

      // Update payment escrow status
      await supabaseAdmin
        .from("payments")
        .update({ escrow_status: "released" })
        .eq("id", paymentId);

      // Update booking completion status
      await supabaseAdmin
        .from("bookings")
        .update({ completion_status: "completed" })
        .eq("id", bookingId);

      return new Response(
        JSON.stringify({ success: true, message: "Escrow payment released" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "dispute_escrow") {
      // Create dispute
      await supabaseAdmin
        .from("escrow_payments")
        .update({
          status: "disputed",
          dispute_reason: reason,
        })
        .eq("payment_id", paymentId);

      // Update payment escrow status
      await supabaseAdmin
        .from("payments")
        .update({ escrow_status: "disputed" })
        .eq("id", paymentId);

      return new Response(
        JSON.stringify({ success: true, message: "Dispute created" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "auto_release_check") {
      // Check for auto-release eligible escrow payments
      const { data: escrowPayments, error: escrowError } = await supabaseAdmin
        .from("escrow_payments")
        .select("*")
        .eq("status", "held")
        .lte("auto_release_date", new Date().toISOString());

      if (escrowError) throw escrowError;

      const released = [];
      for (const escrow of escrowPayments || []) {
        // Auto-release the payment
        await supabaseAdmin
          .from("escrow_payments")
          .update({
            status: "released",
            released_at: new Date().toISOString(),
          })
          .eq("id", escrow.id);

        await supabaseAdmin
          .from("payments")
          .update({ escrow_status: "released" })
          .eq("id", escrow.payment_id);

        released.push(escrow.id);
      }

      return new Response(
        JSON.stringify({
          success: true,
          released_count: released.length,
          released_ids: released,
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
    console.error("Escrow management error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});