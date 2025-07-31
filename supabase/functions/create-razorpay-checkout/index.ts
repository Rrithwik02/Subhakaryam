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
    console.log("Starting Razorpay checkout creation...");
    const requestBody = await req.json();
    const { bookingId, paymentType, amount } = requestBody;
    
    console.log("Request data:", { bookingId, paymentType, amount });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      throw new Error("No authorization header found");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    console.log("Auth result:", { user: !!user, authError });

    if (authError) {
      console.error("Auth error:", authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!user) {
      throw new Error("User not found");
    }

    console.log("User authenticated:", user.id);

    // Verify booking belongs to user with detailed logging
    console.log("Looking for booking:", { bookingId, userId: user.id });
    
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    console.log("Booking query result:", { booking: !!booking, bookingError });

    if (bookingError) {
      console.error("Booking error:", bookingError);
      throw new Error(`Booking lookup failed: ${bookingError.message}`);
    }

    if (!booking) {
      console.error("No booking found for:", { bookingId, userId: user.id });
      throw new Error("Booking not found for this user");
    }

    console.log("Booking found:", booking.id);

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const razorpayOrder = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `booking_${bookingId}_${paymentType}`,
        notes: {
          booking_id: bookingId,
          payment_type: paymentType,
          user_id: user.id,
        },
      }),
    });

    if (!razorpayOrder.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const orderData = await razorpayOrder.json();

    // Store payment record in database
    const { error: paymentError } = await supabaseClient
      .from("payments")
      .insert({
        booking_id: bookingId,
        amount: amount,
        payment_type: paymentType,
        status: "pending",
        razorpay_order_id: orderData.id,
      });

    if (paymentError) {
      console.error("Payment record error:", paymentError);
      throw new Error(`Failed to create payment record: ${paymentError.message}`);
    }

    console.log("Payment record created successfully");

    return new Response(
      JSON.stringify({
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Razorpay checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});