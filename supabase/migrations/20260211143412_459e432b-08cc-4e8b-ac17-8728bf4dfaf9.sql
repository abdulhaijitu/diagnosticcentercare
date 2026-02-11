
-- Create specialty_categories table
CREATE TABLE public.specialty_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.specialty_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view specialty categories"
ON public.specialty_categories FOR SELECT
USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage specialty categories"
ON public.specialty_categories FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

-- Seed default specialties
INSERT INTO public.specialty_categories (name) VALUES
  ('General Physician'),
  ('Cardiology'),
  ('Dermatology'),
  ('Orthopedics'),
  ('Gynecology'),
  ('Pediatrics'),
  ('Neurology'),
  ('Gastroenterology'),
  ('ENT'),
  ('Ophthalmology'),
  ('Psychiatry'),
  ('Urology');
