-- Create doctor_education table
CREATE TABLE public.doctor_education (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    year INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor_experience table  
CREATE TABLE public.doctor_experience (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    position TEXT NOT NULL,
    organization TEXT NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER,
    is_current BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctor_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_experience ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctor_education
CREATE POLICY "Anyone can view doctor education"
ON public.doctor_education
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage doctor education"
ON public.doctor_education
FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- RLS Policies for doctor_experience
CREATE POLICY "Anyone can view doctor experience"
ON public.doctor_experience
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage doctor experience"
ON public.doctor_experience
FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- Add indexes for better query performance
CREATE INDEX idx_doctor_education_doctor_id ON public.doctor_education(doctor_id);
CREATE INDEX idx_doctor_experience_doctor_id ON public.doctor_experience(doctor_id);

-- Insert sample education data for existing doctors
INSERT INTO public.doctor_education (doctor_id, degree, institution, year, description)
SELECT id, 'MBBS', 'Dhaka Medical College', 2005, 'Bachelor of Medicine and Bachelor of Surgery'
FROM public.doctors WHERE name = 'Dr. Mohammad Rahman';

INSERT INTO public.doctor_education (doctor_id, degree, institution, year, description)
SELECT id, 'MD (Cardiology)', 'National Institute of Cardiovascular Diseases', 2010, 'Specialization in Cardiology'
FROM public.doctors WHERE name = 'Dr. Mohammad Rahman';

INSERT INTO public.doctor_education (doctor_id, degree, institution, year, description)
SELECT id, 'FCPS', 'Bangladesh College of Physicians and Surgeons', 2012, 'Fellowship in Cardiology'
FROM public.doctors WHERE name = 'Dr. Mohammad Rahman';

-- Insert sample experience data
INSERT INTO public.doctor_experience (doctor_id, position, organization, start_year, end_year, is_current, description)
SELECT id, 'Senior Consultant', 'TrustCare Diagnostic Center', 2018, NULL, true, 'Leading cardiology department'
FROM public.doctors WHERE name = 'Dr. Mohammad Rahman';

INSERT INTO public.doctor_experience (doctor_id, position, organization, start_year, end_year, is_current, description)
SELECT id, 'Associate Professor', 'Dhaka Medical College Hospital', 2012, 2018, false, 'Teaching and clinical practice'
FROM public.doctors WHERE name = 'Dr. Mohammad Rahman';