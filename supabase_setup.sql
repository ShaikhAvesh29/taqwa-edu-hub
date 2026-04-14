-- Supabase Integration SQL Setup
-- Run this directly in your Supabase SQL Editor

-- 1. Create Teachers Table
CREATE TABLE public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Courses Table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    total_lectures INTEGER DEFAULT 0,
    class_duration TEXT,
    upcoming_class_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. We use Supabase Auth for Users natively, but we can create a public profiles mapping table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('parent', 'student', 'admin')) DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: In a production environment, you would enable RLS (Row Level Security)
-- ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
-- CREATE POLICY "Courses are editable by admins only" ON public.courses FOR ALL USING (
--     EXISTS (SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role = 'admin')
-- );
