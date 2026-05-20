-- NEXT-GEN INTERNAL TASK TRACKER SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DEPARTMENTS
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES (Extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'dept_admin', 'staff')),
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASKS
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  links JSONB DEFAULT '[]'::jsonb, -- Store text/links as array of objects
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'started', 'in_progress', 'review', 'done')),
  start_date DATE,
  due_date DATE,
  department_id UUID REFERENCES departments(id),
  assigned_to UUID REFERENCES profiles(id),
  assigned_by UUID REFERENCES profiles(id),
  needs_approval BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACTIVITY LOG
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- e.g., 'STATUS_CHANGE', 'COMMENT', 'ASSIGNMENT'
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- DEPARTMENTS POLICIES
CREATE POLICY "Public read for departments" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage departments" ON departments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PROFILES POLICIES
CREATE POLICY "Users can see all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- TASKS POLICIES
-- Global Admin access
CREATE POLICY "Admin full access" ON tasks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Departmental Isolation
CREATE POLICY "Departmental read access" ON tasks FOR SELECT TO authenticated USING (
  department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  OR 
  assigned_to = auth.uid()
);

CREATE POLICY "Dept Admins manage their department" ON tasks FOR ALL TO authenticated USING (
  department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'dept_admin')
);

-- ACTIVITY LOG POLICIES
CREATE POLICY "Read activity log" ON activity_log FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM tasks WHERE id = task_id) -- Inherited from task visibility
);
