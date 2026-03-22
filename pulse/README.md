# Pulse — Campus Smart ID System

> **Scan Fast. Work Offline. Stay Accurate.**

A production-grade, offline-first Flutter application for university campus management — built for Android with a glassmorphism design language.

---

## Features

- **Offline-first** — Full functionality without internet. All data stored locally using Isar database.
- **QR / Barcode Scanning** — Real-time student ID scanning via device camera.
- **Eligibility Check** — Instant feedback: Eligible, Not Eligible, or Not Found.
- **Attendance Logs** — Searchable, filterable attendance history with sync status.
- **Cloud Sync** — Automatic background sync to Supabase when connectivity is restored.
- **Excel Import** — Bulk import student records from `.xlsx` files.
- **Session Management** — Support for multiple exam and class sessions.
- **Glassmorphism UI** — Deep navy background with frosted glass components, Poppins typography.

---

## Quick Start

### 1. Prerequisites

| Tool | Version |
|------|---------|
| Flutter SDK | ≥ 3.2.0 |
| Dart SDK | ≥ 3.2.0 |
| Android SDK | API 21+ |
| Java | 11+ |

Install Flutter: https://docs.flutter.dev/get-started/install

### 2. Clone & Install

```bash
# Navigate to the project
cd pulse_campus

# Install dependencies
flutter pub get

# Run code generation (Isar models)
dart run build_runner build --delete-conflicting-outputs
```

### 3. Configure Supabase

Open `lib/core/constants/supabase_config.dart` and replace:

```dart
static const String supabaseUrl    = 'YOUR_SUPABASE_URL_HERE';
static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

> **The app runs fully offline without Supabase configured.** Sync features will be disabled until credentials are added.

### 4. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE students (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id  TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  course      TEXT NOT NULL,
  year        INTEGER NOT NULL DEFAULT 1,
  is_eligible BOOLEAN NOT NULL DEFAULT true,
  synced_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance_logs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id   TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('exam','class','gate','library')),
  scanned_at   TIMESTAMPTZ NOT NULL,
  device_log_id TEXT,
  booklet_number TEXT,
  is_student_check_in BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('exam','class','gate','library')),
  is_active    BOOLEAN DEFAULT true,
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  radius       DOUBLE PRECISION,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE app_users (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_uid     TEXT UNIQUE NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  full_name    TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('admin','watchman','invigilator','librarian','student')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON students FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON attendance_logs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON sessions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON app_users FOR ALL TO anon USING (true) WITH CHECK (true);
```

### 5. Run the App

```bash
# Connect Android device or start emulator, then:
flutter run

# For release build:
flutter build apk --release
```

---

## Excel Import Format

Your `.xlsx` file must follow this column layout (Row 1 = headers, skipped automatically):

| Column | Field | Example |
|--------|-------|---------|
| A | Student ID | `CS2024001` |
| B | Full Name | `John Mwangi` |
| C | Course / Programme | `Computer Science` |
| D | Year of Study | `2` |
| E | Eligible | `TRUE` or `FALSE` |

---

## Project Structure

```
lib/
├── main.dart                          # Entry point, ThemeData, Supabase init
├── core/
│   ├── constants/
│   │   ├── app_colors.dart            # Color palette
│   │   ├── app_strings.dart           # All text strings
│   │   └── supabase_config.dart       # Supabase credentials (edit this)
│   ├── database/
│   │   ├── isar_service.dart          # All Isar DB operations
│   │   └── models/
│   │       ├── student_record.dart    # Student Isar collection
│   │       ├── attendance_log.dart    # Attendance Isar collection
│   │       └── sync_queue_item.dart   # Sync queue Isar collection
│   ├── router/
│   │   └── app_router.dart            # GoRouter config + bottom nav shell
│   ├── sync/
│   │   └── sync_service.dart          # Offline sync logic + connectivity
│   └── widgets/
│       ├── glass_card.dart            # GlassCard + GlassActionCard
│       ├── glass_button.dart          # GlassButton + PrimaryButton
│       └── status_badge.dart          # StatusBadge, StatusDot, SyncDot
└── features/
    ├── splash/
    │   └── splash_screen.dart
    ├── dashboard/
    │   ├── dashboard_screen.dart
    │   └── providers/dashboard_provider.dart
    ├── scan/
    │   ├── scan_screen.dart
    │   ├── result_screen.dart
    │   └── providers/scan_provider.dart
    ├── logs/
    │   ├── logs_screen.dart
    │   └── providers/logs_provider.dart
    └── admin/
        ├── admin_screen.dart
        └── providers/admin_provider.dart
```

---

## Architecture

| Layer | Technology |
|-------|-----------|
| State Management | Riverpod (StateNotifierProvider, FutureProvider) |
| Local Database | Isar 3 (offline-first, embedded) |
| Cloud Backend | Supabase (PostgreSQL + REST) |
| Navigation | GoRouter with ShellRoute |
| Camera / Scanner | mobile_scanner |
| Fonts | Google Fonts — Poppins |
| Animations | flutter_animate |
| Connectivity | connectivity_plus |

---

## Offline-First Sync Flow

```
Scan barcode
    ↓
Look up student in local Isar DB
    ↓
Save AttendanceLog (isSynced = false)
    ↓
Show result immediately
    ↓
[Background] connectivity_plus detects internet
    ↓
Batch push unsync'd logs → Supabase attendance_logs
    ↓
Pull latest students from Supabase → upsert Isar
    ↓
Mark logs as isSynced = true
```

**Conflict resolution:**
- Student eligibility: server wins (Supabase timestamp)
- Attendance records: local timestamp is authoritative

---

## Permissions Required

| Permission | Reason |
|-----------|--------|
| `CAMERA` | Barcode / QR scanning |
| `INTERNET` | Supabase cloud sync |
| `READ_EXTERNAL_STORAGE` | Excel file import (Android < 13) |
| `READ_MEDIA_IMAGES` | File picker (Android 13+) |

---

## Troubleshooting

**`isar_generator` errors during build_runner**
```bash
flutter pub upgrade
dart run build_runner clean
dart run build_runner build --delete-conflicting-outputs
```

**Camera not working on emulator**
Use a physical Android device for scanning. Emulators do not support camera reliably.

**Supabase connection refused**
Verify your URL and anonKey in `supabase_config.dart`. The URL should look like `https://xxxxxx.supabase.co`.

**Excel import fails**
Ensure your file is `.xlsx` format (not `.csv` or older `.xls`). Check column order matches the format table above.

---

## License

MIT — free to use and modify for academic or commercial purposes.
