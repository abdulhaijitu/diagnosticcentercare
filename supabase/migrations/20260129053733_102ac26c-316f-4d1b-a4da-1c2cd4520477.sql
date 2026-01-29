-- Create doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    qualification TEXT,
    experience_years INTEGER DEFAULT 0,
    consultation_fee INTEGER NOT NULL DEFAULT 500,
    available_days TEXT[] NOT NULL DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    available_from TIME NOT NULL DEFAULT '09:00',
    available_to TIME NOT NULL DEFAULT '17:00',
    slot_duration INTEGER NOT NULL DEFAULT 30,
    max_patients_per_slot INTEGER NOT NULL DEFAULT 1,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on doctors
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- RLS policies for doctors
CREATE POLICY "Anyone can view active doctors"
ON public.doctors FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all doctors"
ON public.doctors FOR ALL
USING (is_admin_or_manager(auth.uid()));

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT,
    reason TEXT,
    notes TEXT,
    cancelled_by UUID REFERENCES auth.users(id),
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointments
CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own pending appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = patient_id AND status IN ('pending', 'confirmed'));

CREATE POLICY "Admins can manage all appointments"
ON public.appointments FOR ALL
USING (is_admin_or_manager(auth.uid()));

CREATE POLICY "Doctors can view their appointments"
ON public.appointments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.id = appointments.doctor_id
    AND doctors.user_id = auth.uid()
));

CREATE POLICY "Doctors can update their appointments"
ON public.appointments FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.doctors
    WHERE doctors.id = appointments.doctor_id
    AND doctors.user_id = auth.uid()
));

-- Add updated_at trigger for doctors
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for appointments
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors
INSERT INTO public.doctors (name, specialty, qualification, experience_years, consultation_fee, available_days, available_from, available_to, slot_duration, bio) VALUES
('Dr. Mohammad Rahman', 'Cardiology', 'MBBS, MD (Cardiology)', 15, 1500, ARRAY['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'], '09:00', '17:00', 30, 'Expert cardiologist with 15+ years of experience in treating heart diseases.'),
('Dr. Fatima Akter', 'Gynecology', 'MBBS, MS (Gynecology)', 12, 1200, ARRAY['sunday', 'monday', 'wednesday', 'friday'], '10:00', '16:00', 30, 'Specialist in women''s health and reproductive medicine.'),
('Dr. Kamal Hossain', 'Orthopedics', 'MBBS, MS (Orthopedics)', 10, 1000, ARRAY['sunday', 'tuesday', 'thursday', 'saturday'], '09:00', '15:00', 20, 'Expert in bone and joint disorders, sports injuries.'),
('Dr. Nusrat Jahan', 'Dermatology', 'MBBS, DDV', 8, 800, ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], '11:00', '18:00', 20, 'Skin specialist with expertise in cosmetic dermatology.'),
('Dr. Abdul Karim', 'General Medicine', 'MBBS, FCPS (Medicine)', 20, 700, ARRAY['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'], '08:00', '14:00', 15, 'Experienced physician for all general health issues.'),
('Dr. Shamima Begum', 'Pediatrics', 'MBBS, DCH', 14, 900, ARRAY['sunday', 'monday', 'wednesday', 'friday', 'saturday'], '09:00', '13:00', 20, 'Child specialist with expertise in newborn care.'),
('Dr. Rafiq Ahmed', 'ENT', 'MBBS, DLO', 11, 800, ARRAY['sunday', 'tuesday', 'thursday'], '10:00', '16:00', 20, 'Ear, nose and throat specialist.'),
('Dr. Tahmina Islam', 'Ophthalmology', 'MBBS, DO', 9, 1000, ARRAY['monday', 'wednesday', 'friday', 'saturday'], '09:00', '15:00', 30, 'Eye specialist with expertise in cataract surgery.');

-- Add notification types for appointments
INSERT INTO public.notification_settings (notification_type, in_app_enabled, template_title, template_message)
VALUES 
    ('appointment_confirmed', true, 'Appointment Confirmed', 'Your appointment with {{doctor_name}} on {{date}} at {{time}} has been confirmed.'),
    ('appointment_cancelled', true, 'Appointment Cancelled', 'Your appointment on {{date}} has been cancelled.')
ON CONFLICT (notification_type) DO NOTHING;