abstract final class AppStrings {
  // App Identity
  static const String appName = 'Pulse';
  static const String appTagline = 'Campus Smart ID System';
  static const String appVersion = 'v1.0.0';
  static const String scanFastTagline = 'Scan Fast. Work Offline. Stay Accurate.';

  // Navigation
  static const String navHome = 'Home';
  static const String navScan = 'Scan';
  static const String navLogs = 'Logs';
  static const String navSettings = 'Settings';

  // Dashboard
  static const String dashboardTitle = 'Dashboard';
  static const String startScan = 'Start Scan';
  static const String startScanDesc = 'Scan student ID card';
  static const String viewLogs = 'View Logs';
  static const String viewLogsDesc = 'Browse attendance records';
  static const String syncData = 'Sync Data';
  static const String syncDataDesc = 'Push records to cloud';
  static const String importData = 'Import Data';
  static const String importDataDesc = 'Load student roster';
  static const String recentActivity = 'Recent Activity';
  static const String noRecentActivity = 'No recent activity found';
  static const String totalStudents = 'Total Students';
  static const String eligibleStudents = 'Eligible';
  static const String lastSync = 'Last Sync';
  static const String syncStatus = 'Sync Status';
  static const String connected = 'Connected';
  static const String offline = 'Offline';

  // Scan
  static const String scanTitle = 'Scan ID';
  static const String scanInstructions = 'Align the barcode within the frame to scan';
  static const String selectSession = 'Select Session';
  static const String noSessionSelected = 'No session selected';
  static const String scanningActive = 'Ready to scan';
  static const String scanPaused = 'Scan paused';

  // Result
  static const String resultTitle = 'Scan Result';
  static const String statusEligible = 'ELIGIBLE';
  static const String statusNotEligible = 'NOT ELIGIBLE';
  static const String statusNotFound = 'NOT FOUND';
  static const String scanNext = 'Scan Next';
  static const String viewDetails = 'View Details';
  static const String registrationNumber = 'Registration No.';
  static const String course = 'Course';
  static const String yearOfStudy = 'Year';
  static const String session = 'Session';
  static const String scannedAt = 'Scanned At';

  // Logs
  static const String logsTitle = 'Attendance Logs';
  static const String searchPlaceholder = 'Search by name or ID...';
  static const String filterAll = 'All';
  static const String filterEligible = 'Eligible';
  static const String filterNotEligible = 'Not Eligible';
  static const String filterUnsynced = 'Unsynced';
  static const String noLogsFound = 'No attendance records found';
  static const String pullToRefresh = 'Pull to refresh';

  // Admin
  static const String adminTitle = 'Admin Panel';
  static const String importExcel = 'Import Excel';
  static const String importExcelDesc = 'Load student records from .xlsx file';
  static const String forceSync = 'Force Sync';
  static const String forceSyncDesc = 'Sync all pending records now';
  static const String manageSessions = 'Manage Sessions';
  static const String manageSessionsDesc = 'Create and configure exam sessions';
  static const String syncProgress = 'Sync Progress';
  static const String importSuccess = 'Students imported successfully';
  static const String importFailed = 'Import failed. Check file format.';
  static const String syncSuccess = 'Sync completed successfully';
  static const String syncFailed = 'Sync failed. Will retry on reconnect.';
  static const String addSession = 'Add Session';
  static const String sessionName = 'Session Name';
  static const String sessionType = 'Session Type';
  static const String examSession = 'Exam';
  static const String classSession = 'Class';

  // Errors
  static const String errorGeneric = 'Something went wrong. Please try again.';
  static const String errorNoInternet = 'No internet connection';
  static const String errorDatabaseFailed = 'Database error occurred';
  static const String errorPermissionCamera = 'Camera permission is required to scan IDs';
  static const String errorInvalidFile = 'Invalid file format. Please select an Excel file.';
  static const String errorStudentNotFound = 'Student record not found in local database';
  static const String errorSupabaseConfig = 'Supabase is not configured. Update lib/core/constants/supabase_config.dart';

  // Supabase Tables
  static const String tableStudents = 'students';
  static const String tableAttendanceLogs = 'attendance_logs';
  static const String tableSessions = 'sessions';

  // Shared Prefs Keys
  static const String prefLastSync = 'last_sync_timestamp';
  static const String prefSelectedSession = 'selected_session_id';
}
