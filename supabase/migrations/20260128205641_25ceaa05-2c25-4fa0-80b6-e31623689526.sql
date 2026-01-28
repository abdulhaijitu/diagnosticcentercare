-- Create SMS logs table for tracking sent messages
CREATE TABLE public.sms_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'reve',
    status TEXT NOT NULL DEFAULT 'pending',
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view SMS logs
CREATE POLICY "Admins can view SMS logs"
    ON public.sms_logs
    FOR SELECT
    USING (public.is_admin_or_manager(auth.uid()));

-- Service role can insert (from edge function)
CREATE POLICY "Service role can insert SMS logs"
    ON public.sms_logs
    FOR INSERT
    WITH CHECK (true);

-- Add phone column to profiles if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
END $$;