-- Fix overly permissive INSERT policies
-- Drop the permissive policies
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert logs" ON public.notification_logs;

-- Create proper policies that allow authenticated users to receive notifications
-- Notifications are inserted by edge functions using service role, so we need authenticated insert
CREATE POLICY "Authenticated users can receive notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Notification logs are inserted by edge functions using service role
CREATE POLICY "Authenticated can insert logs"
ON public.notification_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);