-- Add RLS Policies for the new tables only

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