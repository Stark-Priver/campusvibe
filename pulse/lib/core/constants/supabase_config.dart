// ============================================================
//  PULSE — SUPABASE CONFIGURATION
//  Replace the placeholder values below with your actual
//  Supabase project credentials before running the app.
//  You can find these in: Supabase Dashboard > Project Settings > API
// ============================================================

abstract final class SupabaseConfig {
  /// Your Supabase project URL
  static const String supabaseUrl = 'https://caawaccjutpbupovmuri.supabase.co';

  /// Your Supabase anonymous/public key
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXdhY2NqdXRwYnVwb3ZtdXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzM0OTEsImV4cCI6MjA4OTYwOTQ5MX0.2UD19qnaS82ELcbk38eDJBblOIaAz8SGoH1I62E7Bxk';

  // ============================================================
  //  SUPABASE SQL SETUP — Run the following in your Supabase
  //  SQL editor to create the required tables and policies:
  // ============================================================
  //
  // -- STUDENTS TABLE
  // CREATE TABLE IF NOT EXISTS students (
  //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //   student_id TEXT UNIQUE NOT NULL,
  //   full_name TEXT NOT NULL,
  //   course TEXT NOT NULL,
  //   year INTEGER NOT NULL DEFAULT 1,
  //   is_eligible BOOLEAN NOT NULL DEFAULT true,
  //   synced_at TIMESTAMPTZ DEFAULT NOW(),
  //   created_at TIMESTAMPTZ DEFAULT NOW(),
  //   updated_at TIMESTAMPTZ DEFAULT NOW()
  // );
  //
  // -- ATTENDANCE LOGS TABLE
  // CREATE TABLE IF NOT EXISTS attendance_logs (
  //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //   student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  //   session_id TEXT NOT NULL,
  //   session_type TEXT NOT NULL CHECK (session_type IN ('exam','class')),
  //   scanned_at TIMESTAMPTZ NOT NULL,
  //   device_log_id TEXT,
  //   created_at TIMESTAMPTZ DEFAULT NOW()
  // );
  //
  // -- SESSIONS TABLE
  // CREATE TABLE IF NOT EXISTS sessions (
  //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //   name TEXT NOT NULL,
  //   session_type TEXT NOT NULL CHECK (session_type IN ('exam','class')),
  //   is_active BOOLEAN DEFAULT true,
  //   created_at TIMESTAMPTZ DEFAULT NOW()
  // );
  //
  // -- Enable Row Level Security
  // ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  // ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
  // ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
  //
  // -- Policies for anon access (adjust as needed)
  // CREATE POLICY "Allow all for anon" ON students FOR ALL TO anon USING (true) WITH CHECK (true);
  // CREATE POLICY "Allow all for anon" ON attendance_logs FOR ALL TO anon USING (true) WITH CHECK (true);
  // CREATE POLICY "Allow all for anon" ON sessions FOR ALL TO anon USING (true) WITH CHECK (true);
  // ============================================================
}
