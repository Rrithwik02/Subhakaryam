import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface NotificationPreference {
  id?: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  payment_reminders: boolean;
  booking_updates: boolean;
  promotional: boolean;
  frequency: string;
}

const NotificationPreferences = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference>({
    user_id: session?.user?.id || "",
    email_enabled: true,
    sms_enabled: true,
    push_enabled: true,
    payment_reminders: true,
    booking_updates: true,
    promotional: false,
    frequency: "immediate"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPreferences();
    }
  }, [session]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", session?.user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  const savePreferences = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert(preferences, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notification preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreference, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication Channels */}
        <div className="space-y-4">
          <h3 className="font-semibold">Communication Channels</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference("email_enabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4" />
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.sms_enabled}
              onCheckedChange={(checked) => updatePreference("sms_enabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4" />
              <Label htmlFor="push-notifications">Push Notifications</Label>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_enabled}
              onCheckedChange={(checked) => updatePreference("push_enabled", checked)}
            />
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Types</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment-reminders">Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming payments</p>
            </div>
            <Switch
              id="payment-reminders"
              checked={preferences.payment_reminders}
              onCheckedChange={(checked) => updatePreference("payment_reminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="booking-updates">Booking Updates</Label>
              <p className="text-sm text-muted-foreground">Status changes and confirmations</p>
            </div>
            <Switch
              id="booking-updates"
              checked={preferences.booking_updates}
              onCheckedChange={(checked) => updatePreference("booking_updates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotional">Promotional Offers</Label>
              <p className="text-sm text-muted-foreground">Special deals and new services</p>
            </div>
            <Switch
              id="promotional"
              checked={preferences.promotional}
              onCheckedChange={(checked) => updatePreference("promotional", checked)}
            />
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Frequency</h3>
          <div className="space-y-2">
            <Label htmlFor="frequency">How often would you like to receive notifications?</Label>
            <Select 
              value={preferences.frequency} 
              onValueChange={(value) => updatePreference("frequency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={savePreferences} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;