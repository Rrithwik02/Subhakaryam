import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const SimpleNotificationSettings = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email_enabled: true,
    push_enabled: true,
    payment_reminders: true,
  });
  const [loading, setLoading] = useState(false);

  const saveSettings = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: session.user.id,
          ...settings,
          sms_enabled: false, // Keep SMS disabled by default
          booking_updates: true,
          promotional: false,
          frequency: "immediate"
        }, { onConflict: "user_id" });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4" />
            <Label htmlFor="email">Email Updates</Label>
          </div>
          <Switch
            id="email"
            checked={settings.email_enabled}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, email_enabled: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4" />
            <Label htmlFor="push">App Notifications</Label>
          </div>
          <Switch
            id="push"
            checked={settings.push_enabled}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, push_enabled: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4" />
            <Label htmlFor="reminders">Payment Reminders</Label>
          </div>
          <Switch
            id="reminders"
            checked={settings.payment_reminders}
            onCheckedChange={(checked) => 
              setSettings(prev => ({ ...prev, payment_reminders: checked }))
            }
          />
        </div>

        <Button 
          onClick={saveSettings} 
          disabled={loading}
          className="w-full"
          size="sm"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleNotificationSettings;