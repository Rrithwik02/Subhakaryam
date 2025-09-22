-- Enhanced Payment System: Payment Schedules and Milestones
CREATE TABLE IF NOT EXISTS payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  payment_plan TEXT NOT NULL DEFAULT 'standard',
  total_milestones INTEGER DEFAULT 2,
  milestones JSONB NOT NULL DEFAULT '[
    {"percentage": 50, "description": "Advance payment", "due_date": null},
    {"percentage": 50, "description": "Final payment", "due_date": null}
  ]'::jsonb,
  current_milestone INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enhanced Notifications: SMS/Email preferences and reminders
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  payment_reminders BOOLEAN DEFAULT true,
  booking_updates BOOLEAN DEFAULT true,
  promotional BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'immediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Theme Customization: Ceremony-specific themes
CREATE TABLE IF NOT EXISTS ceremony_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_name TEXT NOT NULL,
  ceremony_type TEXT NOT NULL,
  color_scheme JSONB NOT NULL,
  font_settings JSONB NOT NULL,
  decorative_elements JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User theme preferences
CREATE TABLE IF NOT EXISTS user_theme_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ceremony_type TEXT NOT NULL,
  theme_id UUID,
  custom_settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment reminders tracking
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  milestone_number INTEGER NOT NULL,
  reminder_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  next_reminder_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add missing escrow_status column to payments table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'escrow_status') THEN
    ALTER TABLE payments ADD COLUMN escrow_status TEXT DEFAULT 'none';
  END IF;
END $$;

-- Enable RLS for new tables
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremony_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_theme_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_schedules
CREATE POLICY "Users can manage their payment schedules"
ON payment_schedules FOR ALL
USING (booking_id IN (
  SELECT id FROM bookings WHERE user_id = auth.uid()
));

CREATE POLICY "Users can view their payment schedules"
ON payment_schedules FOR SELECT
USING (booking_id IN (
  SELECT id FROM bookings 
  WHERE user_id = auth.uid() 
     OR provider_id IN (
       SELECT id FROM service_providers 
       WHERE profile_id = auth.uid()
     )
));

CREATE POLICY "Admins can manage all payment schedules"
ON payment_schedules FOR ALL
USING (is_admin());

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage their notification preferences"
ON notification_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view notification preferences"
ON notification_preferences FOR SELECT
USING (is_admin());

-- RLS Policies for ceremony_themes
CREATE POLICY "Anyone can view active themes"
ON ceremony_themes FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all themes"
ON ceremony_themes FOR ALL
USING (is_admin());

-- RLS Policies for user_theme_preferences
CREATE POLICY "Users can manage their theme preferences"
ON user_theme_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- RLS Policies for payment_reminders
CREATE POLICY "Users can view their payment reminders"
ON payment_reminders FOR SELECT
USING (booking_id IN (
  SELECT id FROM bookings 
  WHERE user_id = auth.uid() 
     OR provider_id IN (
       SELECT id FROM service_providers 
       WHERE profile_id = auth.uid()
     )
));

CREATE POLICY "Admins can manage payment reminders"
ON payment_reminders FOR ALL
USING (is_admin());

-- Insert default ceremony themes
INSERT INTO ceremony_themes (theme_name, ceremony_type, color_scheme, font_settings, decorative_elements) VALUES 
('Traditional Hindu', 'wedding', 
 '{"primary": "hsl(0, 70%, 50%)", "secondary": "hsl(45, 100%, 50%)", "accent": "hsl(30, 100%, 40%)", "background": "hsl(0, 0%, 98%)"}',
 '{"primary": "Playfair Display", "body": "Inter", "size": "medium"}',
 '{"patterns": ["mandala", "lotus"], "borders": "traditional", "icons": "vedic"}'),

('Modern Elegant', 'wedding',
 '{"primary": "hsl(270, 50%, 40%)", "secondary": "hsl(320, 30%, 60%)", "accent": "hsl(50, 100%, 70%)", "background": "hsl(0, 0%, 99%)"}',
 '{"primary": "Inter", "body": "Inter", "size": "medium"}',
 '{"patterns": ["geometric"], "borders": "modern", "icons": "minimal"}'),

('Festive Celebration', 'festival',
 '{"primary": "hsl(30, 90%, 50%)", "secondary": "hsl(0, 80%, 60%)", "accent": "hsl(60, 100%, 50%)", "background": "hsl(45, 100%, 98%)"}',
 '{"primary": "Playfair Display", "body": "Inter", "size": "large"}',
 '{"patterns": ["rangoli", "diyas"], "borders": "decorative", "icons": "festive"}'),

('Spiritual Pooja', 'pooja',
 '{"primary": "hsl(30, 80%, 45%)", "secondary": "hsl(0, 0%, 20%)", "accent": "hsl(45, 100%, 60%)", "background": "hsl(0, 0%, 99%)"}',
 '{"primary": "Playfair Display", "body": "Inter", "size": "medium"}',
 '{"patterns": ["om", "trishul"], "borders": "spiritual", "icons": "religious"}');

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_payment_schedules_updated_at
  BEFORE UPDATE ON payment_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ceremony_themes_updated_at
  BEFORE UPDATE ON ceremony_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_theme_preferences_updated_at
  BEFORE UPDATE ON user_theme_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();