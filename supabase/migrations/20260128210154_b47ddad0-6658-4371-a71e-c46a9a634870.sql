-- Add appointment notification settings
INSERT INTO public.notification_settings (notification_type, template_title, template_message, in_app_enabled, sms_enabled, whatsapp_enabled, email_enabled)
VALUES 
('appointment_confirmed', 'Appointment Confirmed', 'Your appointment with Dr. {{doctor_name}} on {{date}} at {{time}} has been confirmed.', true, false, false, false),
('appointment_cancelled', 'Appointment Cancelled', 'Your appointment on {{date}} at {{time}} has been cancelled.', true, false, false, false)
ON CONFLICT DO NOTHING;