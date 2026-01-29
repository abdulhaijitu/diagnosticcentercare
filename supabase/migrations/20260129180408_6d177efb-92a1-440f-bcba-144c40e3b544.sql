-- Create corporate_packages table
CREATE TABLE public.corporate_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  price_label TEXT NOT NULL DEFAULT 'প্রতি জন',
  min_employees INTEGER NOT NULL DEFAULT 20,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  tests TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corporate_packages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active packages
CREATE POLICY "Anyone can view active packages"
ON public.corporate_packages
FOR SELECT
USING (is_active = true);

-- Policy: Admins can manage all packages
CREATE POLICY "Admins can manage packages"
ON public.corporate_packages
FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_corporate_packages_updated_at
BEFORE UPDATE ON public.corporate_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();