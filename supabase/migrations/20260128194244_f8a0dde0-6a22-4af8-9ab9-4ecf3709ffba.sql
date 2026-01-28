-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'doctor', 'manager', 'sales', 'staff', 'patient');

-- Create enum for home collection status
CREATE TYPE public.collection_status AS ENUM ('requested', 'assigned', 'collected', 'processing', 'ready');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create home_collection_requests table
CREATE TABLE public.home_collection_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_names TEXT[] NOT NULL,
    total_amount INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    status collection_status NOT NULL DEFAULT 'requested',
    assigned_staff_id UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    assigned_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create status_history table for tracking changes
CREATE TABLE public.collection_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.home_collection_requests(id) ON DELETE CASCADE,
    status collection_status NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_collection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_status_history ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has a specific role (SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Helper function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role IN ('super_admin', 'admin', 'manager')
    )
$$;

-- Helper function to check if user is staff
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = 'staff'
    )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Staff can view patient profiles"
ON public.profiles FOR SELECT
USING (public.is_staff(auth.uid()));

-- RLS Policies for home_collection_requests
CREATE POLICY "Patients can view their own requests"
ON public.home_collection_requests FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own requests"
ON public.home_collection_requests FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own pending requests"
ON public.home_collection_requests FOR UPDATE
USING (auth.uid() = patient_id AND status = 'requested');

CREATE POLICY "Staff can view their assigned requests"
ON public.home_collection_requests FOR SELECT
USING (auth.uid() = assigned_staff_id);

CREATE POLICY "Staff can update their assigned requests"
ON public.home_collection_requests FOR UPDATE
USING (auth.uid() = assigned_staff_id);

CREATE POLICY "Admins can view all requests"
ON public.home_collection_requests FOR SELECT
USING (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Admins can manage all requests"
ON public.home_collection_requests FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

-- RLS Policies for collection_status_history
CREATE POLICY "Users can view history of their requests"
ON public.collection_status_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.home_collection_requests
        WHERE id = request_id AND patient_id = auth.uid()
    )
);

CREATE POLICY "Staff can view history of assigned requests"
ON public.collection_status_history FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.home_collection_requests
        WHERE id = request_id AND assigned_staff_id = auth.uid()
    )
);

CREATE POLICY "Staff can add history to assigned requests"
ON public.collection_status_history FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.home_collection_requests
        WHERE id = request_id AND assigned_staff_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all history"
ON public.collection_status_history FOR SELECT
USING (public.is_admin_or_manager(auth.uid()));

CREATE POLICY "Admins can manage all history"
ON public.collection_status_history FOR ALL
USING (public.is_admin_or_manager(auth.uid()));

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    
    -- Default role is patient
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_home_collection_requests_updated_at
BEFORE UPDATE ON public.home_collection_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for status tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.home_collection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_status_history;