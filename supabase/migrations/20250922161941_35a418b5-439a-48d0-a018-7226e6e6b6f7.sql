-- Add RLS Policies for the new tables

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