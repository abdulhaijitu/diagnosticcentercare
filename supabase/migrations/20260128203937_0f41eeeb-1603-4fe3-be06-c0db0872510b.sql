-- Create storage bucket for reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', false);

-- Create RLS policies for reports bucket
CREATE POLICY "Staff and admins can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reports' AND
  (
    public.is_admin_or_manager(auth.uid()) OR
    public.is_staff(auth.uid())
  )
);

CREATE POLICY "Staff and admins can view all reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' AND
  (
    public.is_admin_or_manager(auth.uid()) OR
    public.is_staff(auth.uid())
  )
);

CREATE POLICY "Patients can view their own reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create reports table to track uploaded reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.home_collection_requests(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports table
CREATE POLICY "Staff and admins can insert reports"
ON public.reports FOR INSERT
WITH CHECK (
  public.is_admin_or_manager(auth.uid()) OR
  public.is_staff(auth.uid())
);

CREATE POLICY "Staff and admins can view all reports"
ON public.reports FOR SELECT
USING (
  public.is_admin_or_manager(auth.uid()) OR
  public.is_staff(auth.uid())
);

CREATE POLICY "Patients can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Staff and admins can delete reports"
ON public.reports FOR DELETE
USING (
  public.is_admin_or_manager(auth.uid()) OR
  public.is_staff(auth.uid())
);