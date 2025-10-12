import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  try {
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSignature = req.headers.get("x-razorpay-signature");
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!webhookSignature) {
      console.error("Missing webhook signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Generate expected signature
    const crypto = await import("https://deno.land/std@0.190.0/node/crypto.ts");
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");
    
    // Verify signature
    if (webhookSignature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    
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
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
});