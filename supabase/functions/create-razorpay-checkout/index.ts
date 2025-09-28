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

    // Get user from auth header first
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      throw new Error("No authorization header found");
    }

    // Create Supabase client with proper auth context
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

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

    // Verify booking exists and user has access (either as customer or provider)
    console.log("Looking for booking:", { bookingId, userId: user.id });
    
    // First try to find booking where user is the customer
    let { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    console.log("Customer booking query result:", { booking: !!booking, bookingError });

    // If not found as customer, try as service provider
    if (bookingError || !booking) {
      console.log("Not found as customer, checking as service provider...");
      
      const { data: providerBooking, error: providerError } = await supabaseClient
        .from("bookings")
        .select(`
          *,
          service_providers!inner(profile_id)
        `)
        .eq("id", bookingId)
        .eq("service_providers.profile_id", user.id)
        .single();

      console.log("Provider booking query result:", { booking: !!providerBooking, providerError });

      if (!providerError && providerBooking) {
        booking = providerBooking;
        bookingError = null;
      } else {
        bookingError = providerError;
      }
    }

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

    // Generate a short receipt ID that stays under 40 characters
    const shortBookingId = bookingId.slice(0, 8);
    const shortPaymentType = paymentType === 'advance' ? 'adv' : 'fin';
    const timestamp = Date.now().toString().slice(-4);
    const receipt = `bk_${shortBookingId}_${shortPaymentType}_${timestamp}`;
    
    console.log("Creating Razorpay order with:", {
      amount: amount * 100,
      currency: "INR",
      receipt,
      receiptLength: receipt.length,
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      bookingId,
      paymentType
    });

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
        receipt: receipt,
        notes: {
          booking_id: bookingId,
          payment_type: paymentType,
          user_id: user.id,
        },
      }),
    });

    if (!razorpayOrder.ok) {
      const errorText = await razorpayOrder.text();
      console.error("Razorpay API Error:", {
        status: razorpayOrder.status,
        statusText: razorpayOrder.statusText,
        response: errorText
      });
      throw new Error(`Failed to create Razorpay order: ${razorpayOrder.status} - ${errorText}`);
    }

    const orderData = await razorpayOrder.json();

    // Check if payment record already exists (for provider-requested payments)
    const { data: existingPayment } = await supabaseClient
      .from("payments")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("amount", amount)
      .eq("payment_type", paymentType)
      .eq("status", "pending")
      .single();

    if (existingPayment) {
      // Update existing payment record with Razorpay order ID
      const { error: updateError } = await supabaseClient
        .from("payments")
        .update({ razorpay_order_id: orderData.id })
        .eq("id", existingPayment.id);

      if (updateError) {
        console.error("Payment update error:", updateError);
        throw new Error(`Failed to update payment record: ${updateError.message}`);
      }
    } else {
      // Create new payment record
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
    }

    console.log("Payment record created successfully");

    return new Response(
      JSON.stringify({
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: razorpayKeyId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Razorpay checkout:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});