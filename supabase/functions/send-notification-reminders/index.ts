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

    const { action, userId, message, channels } = await req.json();

    if (action === "send_payment_reminder") {
      const { bookingId, amount, dueDate } = await req.json();

      // Get user preferences
      const { data: preferences } = await supabaseAdmin
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      const notifications = [];

      // Send email notification
      if (preferences?.email_enabled && channels?.includes("email")) {
        // Create email notification (integration with email service would go here)
        notifications.push({
          type: "email",
          recipient: userId,
          subject: "Payment Reminder",
          message: `Your payment of ₹${amount} is due on ${dueDate}`,
          status: "sent"
        });
      }

      // Send SMS notification
      if (preferences?.sms_enabled && channels?.includes("sms")) {
        // Create SMS notification (integration with SMS service would go here)
        notifications.push({
          type: "sms",
          recipient: userId,
          message: `Payment reminder: ₹${amount} due on ${dueDate}`,
          status: "sent"
        });
      }

      // Send push notification
      if (preferences?.push_enabled && channels?.includes("push")) {
        // Create push notification
        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: userId,
            title: "Payment Reminder",
            message: `Your payment of ₹${amount} is due on ${dueDate}`,
            type: "payment_reminder"
          });
      }

      // Log reminder
      await supabaseAdmin
        .from("payment_reminders")
        .insert({
          booking_id: bookingId,
          milestone_number: 1,
          reminder_type: "payment_due",
          sent_at: new Date().toISOString(),
          status: "sent",
          next_reminder_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Next day
        });

      return new Response(
        JSON.stringify({
          success: true,
          notifications_sent: notifications.length,
          message: "Reminder sent successfully"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "send_booking_update") {
      const { bookingId, status, message } = await req.json();

      // Get user preferences
      const { data: preferences } = await supabaseAdmin
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (preferences?.booking_updates) {
        // Send notification based on preferences
        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: userId,
            title: "Booking Update",
            message: message,
            type: "booking_update"
          });

        // Additional channels based on preferences
        if (preferences.email_enabled) {
          // Send email (would integrate with email service)
          console.log(`Sending email to user ${userId}: ${message}`);
        }

        if (preferences.sms_enabled) {
          // Send SMS (would integrate with SMS service)
          console.log(`Sending SMS to user ${userId}: ${message}`);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Booking update notification sent"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === "check_reminder_schedule") {
      // Check for pending reminders
      const { data: pendingReminders } = await supabaseAdmin
        .from("payment_reminders")
        .select("*, bookings(user_id, total_amount)")
        .eq("status", "pending")
        .lte("next_reminder_at", new Date().toISOString());

      const processed = [];
      for (const reminder of pendingReminders || []) {
        // Process each reminder
        await supabaseAdmin.functions.invoke("send-notification-reminders", {
          body: {
            action: "send_payment_reminder",
            userId: reminder.bookings.user_id,
            bookingId: reminder.booking_id,
            amount: reminder.bookings.total_amount,
            dueDate: new Date().toISOString(),
            channels: ["email", "sms", "push"]
          }
        });

        processed.push(reminder.id);
      }

      return new Response(
        JSON.stringify({
          success: true,
          processed_reminders: processed.length,
          reminder_ids: processed
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
    console.error("Notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});