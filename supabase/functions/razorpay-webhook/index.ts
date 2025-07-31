import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    const body = await req.text();
    const event = JSON.parse(body);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Update payment status
      const { error: paymentUpdateError } = await supabaseClient
        .from("payments")
        .update({
          status: "completed",
          razorpay_payment_id: paymentId,
        })
        .eq("razorpay_order_id", orderId);

      if (paymentUpdateError) {
        console.error("Error updating payment:", paymentUpdateError);
        throw paymentUpdateError;
      }

      // Get payment details to update booking
      const { data: paymentData, error: paymentError } = await supabaseClient
        .from("payments")
        .select("booking_id, payment_type")
        .eq("razorpay_order_id", orderId)
        .single();

      if (paymentError || !paymentData) {
        console.error("Payment not found:", paymentError);
        throw new Error("Payment not found");
      }

      // Update booking payment status
      const updateData = paymentData.payment_type === "advance"
        ? { advance_payment_status: "completed" }
        : { final_payment_status: "completed" };

      const { error: bookingUpdateError } = await supabaseClient
        .from("bookings")
        .update(updateData)
        .eq("id", paymentData.booking_id);

      if (bookingUpdateError) {
        console.error("Error updating booking:", bookingUpdateError);
        throw bookingUpdateError;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
});