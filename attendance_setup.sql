-- 1. Create or Update the PROFILES Table
-- We map these profiles directly to Supabase internal Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    name TEXT,
    role TEXT CHECK (role IN ('student', 'teacher', 'admin', 'parent')) DEFAULT 'student',
    batch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: If `profiles` already exists, you can just add the missing columns:
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS batch TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- 2. Create the ATTENDANCE Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('Present', 'Late', 'Absent')) DEFAULT 'Present',
    batch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- CRITICAL: We need a unique constraint to ensure we can "Upsert" safely in the dashboard
    -- without creating duplicate copies of attendance for the same student on the same day.
    UNIQUE(student_id, date)
);

-- 3. Enable Row Level Security (RLS) on Attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Attendance
-- Let Students view ONLY their own records
CREATE POLICY "Students can view their own attendance" 
ON public.attendance 
FOR SELECT 
USING (auth.uid() = student_id);

-- Let Teachers and Admins View ALL attendance records
CREATE POLICY "Teachers can view all attendance" 
ON public.attendance 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Let Teachers and Admins Insert / Upsert Attendance
CREATE POLICY "Teachers can insert attendance" 
ON public.attendance 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Let Teachers and Admins Update Attendance
CREATE POLICY "Teachers can update attendance" 
ON public.attendance 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Optional: If you intend to let Teachers delete mistaken attendance records
CREATE POLICY "Teachers can delete attendance" 
ON public.attendance 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('teacher', 'admin')
    )
);

-- Create a Trigger to automatically create a profile entry when a user signs up.
-- (Only run this if you haven't enabled it globally yet!)
-- CREATE OR REPLACE FUNCTION public.handle_new_user() 
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, role)
--   VALUES (new.id, 'student');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
