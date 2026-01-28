-- Create WhatsApp logs table for tracking sent messages
CREATE TABLE public.whatsapp_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    template_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view WhatsApp logs
CREATE POLICY "Admins can view WhatsApp logs"
    ON public.whatsapp_logs
    FOR SELECT
    USING (public.is_admin_or_manager(auth.uid()));

-- Service role can insert (from edge function)
CREATE POLICY "Service role can insert WhatsApp logs"
    ON public.whatsapp_logs
    FOR INSERT
    WITH CHECK (true);