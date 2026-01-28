-- Create notification types enum
CREATE TYPE public.notification_type AS ENUM (
  'booking_confirmed',
  'sample_assigned',
  'sample_collected',
  'processing_started',
  'report_ready'
);

-- Create notification channel enum
CREATE TYPE public.notification_channel AS ENUM (
  'in_app',
  'sms',
  'whatsapp',
  'email'
);

-- Create notifications table for storing all notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  channels notification_channel[] DEFAULT ARRAY['in_app']::notification_channel[],
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_settings table for admin preferences
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type notification_type NOT NULL UNIQUE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  template_title TEXT,
  template_message TEXT,
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_logs table for auditing
CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID REFERENCES public.notifications(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  channel notification_channel NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all notifications"
ON public.notifications FOR SELECT
USING (is_admin_or_manager(auth.uid()));

-- RLS Policies for notification_settings
CREATE POLICY "Anyone can view notification settings"
ON public.notification_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage notification settings"
ON public.notification_settings FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- RLS Policies for notification_logs
CREATE POLICY "Admins can view notification logs"
ON public.notification_logs FOR SELECT
USING (is_admin_or_manager(auth.uid()));

CREATE POLICY "System can insert logs"
ON public.notification_logs FOR INSERT
WITH CHECK (true);

-- Insert default notification settings
INSERT INTO public.notification_settings (notification_type, in_app_enabled, template_title, template_message) VALUES
('booking_confirmed', true, 'Booking Confirmed', 'Your booking for {{test_names}} has been confirmed for {{date}} at {{time}}.'),
('sample_assigned', true, 'Staff Assigned', 'A collection agent has been assigned to your booking. They will arrive on {{date}} at {{time}}.'),
('sample_collected', true, 'Sample Collected', 'Your sample has been collected successfully. We are now processing your tests.'),
('processing_started', true, 'Processing Started', 'Your samples are being processed at our lab. Results will be ready soon.'),
('report_ready', true, 'Report Ready', 'Your test report is ready! You can now view and download your results.');

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notification_logs_notification_id ON public.notification_logs(notification_id);