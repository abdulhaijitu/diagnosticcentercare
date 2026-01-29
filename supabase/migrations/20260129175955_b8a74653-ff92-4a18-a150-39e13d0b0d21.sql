-- Create corporate inquiries table
CREATE TABLE public.corporate_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  employee_count TEXT NOT NULL,
  preferred_package TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public form)
CREATE POLICY "Anyone can submit corporate inquiry"
ON public.corporate_inquiries
FOR INSERT
WITH CHECK (true);

-- Policy: Only admin/manager can view
CREATE POLICY "Admins can view corporate inquiries"
ON public.corporate_inquiries
FOR SELECT
USING (public.is_admin_or_manager(auth.uid()));

-- Policy: Only admin/manager can update
CREATE POLICY "Admins can update corporate inquiries"
ON public.corporate_inquiries
FOR UPDATE
USING (public.is_admin_or_manager(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_corporate_inquiries_updated_at
BEFORE UPDATE ON public.corporate_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();