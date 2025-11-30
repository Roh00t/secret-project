-- SafeOps Database Schema for Supabase

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('safety_officer', 'facility_manager', 'approver', 'admin');
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'changes_requested');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE likelihood_level AS ENUM ('low', 'medium', 'high', 'very_high');
CREATE TYPE venue_status AS ENUM ('safe', 'warning', 'critical', 'restricted');
CREATE TYPE issue_status AS ENUM ('open', 'resolved', 'pending', 'in_progress');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'safety_officer',
  department TEXT,
  phone TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_code TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  type TEXT, -- e.g., 'office', 'warehouse', 'factory', 'event_space'
  status venue_status DEFAULT 'safe',
  critical_issues_count INTEGER DEFAULT 0,
  last_raw_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue Hazards table
CREATE TABLE IF NOT EXISTS venue_hazards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  hazard_category TEXT NOT NULL,
  description TEXT,
  severity severity_level,
  likelihood likelihood_level,
  rpn INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN severity = 'critical' THEN CASE WHEN likelihood = 'very_high' THEN 16 WHEN likelihood = 'high' THEN 12 WHEN likelihood = 'medium' THEN 8 ELSE 4 END
      WHEN severity = 'high' THEN CASE WHEN likelihood = 'very_high' THEN 12 WHEN likelihood = 'high' THEN 9 WHEN likelihood = 'medium' THEN 6 ELSE 3 END
      WHEN severity = 'medium' THEN CASE WHEN likelihood = 'very_high' THEN 8 WHEN likelihood = 'high' THEN 6 WHEN likelihood = 'medium' THEN 4 ELSE 2 END
      ELSE CASE WHEN likelihood = 'very_high' THEN 4 WHEN likelihood = 'high' THEN 3 WHEN likelihood = 'medium' THEN 2 ELSE 1 END
    END
  ) STORED,
  status issue_status DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAW Templates table
CREATE TABLE IF NOT EXISTS raw_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  common_hazards TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAW Submissions table
CREATE TABLE IF NOT EXISTS raw_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  template_id UUID REFERENCES raw_templates(id),
  status submission_status DEFAULT 'draft',
  risk_level risk_level,
  activity_description TEXT,
  control_measures TEXT,
  approver_id UUID REFERENCES users(id),
  approver_comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RAW Hazards table (hazards within a RAW submission)
CREATE TABLE IF NOT EXISTS raw_hazards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_id UUID NOT NULL REFERENCES raw_submissions(id) ON DELETE CASCADE,
  hazard_description TEXT NOT NULL,
  severity severity_level NOT NULL,
  likelihood likelihood_level NOT NULL,
  rpn INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN severity = 'critical' THEN CASE WHEN likelihood = 'very_high' THEN 16 WHEN likelihood = 'high' THEN 12 WHEN likelihood = 'medium' THEN 8 ELSE 4 END
      WHEN severity = 'high' THEN CASE WHEN likelihood = 'very_high' THEN 12 WHEN likelihood = 'high' THEN 9 WHEN likelihood = 'medium' THEN 6 ELSE 3 END
      WHEN severity = 'medium' THEN CASE WHEN likelihood = 'very_high' THEN 8 WHEN likelihood = 'high' THEN 6 WHEN likelihood = 'medium' THEN 4 ELSE 2 END
      ELSE CASE WHEN likelihood = 'very_high' THEN 4 WHEN likelihood = 'high' THEN 3 WHEN likelihood = 'medium' THEN 2 ELSE 1 END
    END
  ) STORED,
  control_measures TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  raw_id UUID REFERENCES raw_submissions(id),
  title TEXT NOT NULL,
  description TEXT,
  status issue_status DEFAULT 'open',
  severity severity_level NOT NULL,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_id UUID REFERENCES raw_submissions(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT, -- e.g., 'raw_submitted', 'raw_approved', 'issue_assigned'
  related_id UUID, -- ID of related RAW or Issue
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_created_by ON venues(created_by);
CREATE INDEX idx_raw_submissions_user ON raw_submissions(user_id);
CREATE INDEX idx_raw_submissions_venue ON raw_submissions(venue_id);
CREATE INDEX idx_raw_submissions_status ON raw_submissions(status);
CREATE INDEX idx_venue_hazards_venue ON venue_hazards(venue_id);
CREATE INDEX idx_issues_venue ON issues(venue_id);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

-- Users can see all venues
CREATE POLICY "Users can view all venues" ON venues
  FOR SELECT USING (true);

-- Users can see their own RAWs and all approved RAWs
CREATE POLICY "Users can view own RAWs" ON raw_submissions
  FOR SELECT USING (user_id = auth.uid() OR status = 'approved');

-- Users can insert their own RAWs
CREATE POLICY "Users can create RAWs" ON raw_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own RAWs
CREATE POLICY "Users can update own RAWs" ON raw_submissions
  FOR UPDATE USING (user_id = auth.uid() AND status = 'draft');

-- Users can see issues on venues
CREATE POLICY "Users can view issues" ON issues
  FOR SELECT USING (true);

-- Users can see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
