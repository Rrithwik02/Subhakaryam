-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their payment schedules" ON payment_schedules;
DROP POLICY IF EXISTS "Users can view their payment schedules" ON payment_schedules;
DROP POLICY IF EXISTS "Admins can manage all payment schedules" ON payment_schedules;

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

-- Enable RLS for new tables
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceremony_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_theme_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;