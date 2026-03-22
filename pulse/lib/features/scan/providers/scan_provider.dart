import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/database/isar_service.dart';
import '../../../core/database/models/attendance_log.dart';
import '../../../core/database/models/student_record.dart';
import '../../../core/database/models/session_model.dart';

const _uuid = Uuid();

// Keep SessionInfo for backward compatibility during migration if needed,
// but we'll use SessionModel from DB now.
typedef SessionInfo = SessionModel;

class ScanResult {
  final StudentRecord? student;
  final AttendanceLog? log;
  final String scannedId;
  final bool wasFound;

  const ScanResult({
    required this.scannedId,
    this.student,
    this.log,
    required this.wasFound,
  });
}

class ScanNotifier extends StateNotifier<AsyncValue<ScanResult?>> {
  ScanNotifier() : super(const AsyncValue.data(null));

  bool _processing = false;

  Future<ScanResult?> processScan({
    required String barcode,
    required SessionInfo session,
    String? bookletNumber,
  }) async {
    if (_processing) return null;
    _processing = true;
    state = const AsyncValue.loading();

    try {
      final student = await IsarService.getStudentById(barcode.trim());

      if (student == null) {
        final result = ScanResult(
          scannedId: barcode,
          wasFound: false,
        );
        state = AsyncValue.data(result);
        _processing = false;
        return result;
      }

      final log = AttendanceLog.create(
        studentId: student.studentId,
        studentName: student.fullName,
        sessionId: session.remoteId ?? session.id.toString(),
        sessionName: session.name,
        sessionType: session.type,
        isEligible: student.isEligible,
        localId: _uuid.v4(),
        bookletNumber: bookletNumber,
      );

      await IsarService.saveAttendanceLog(log);

      final result = ScanResult(
        scannedId: barcode,
        student: student,
        log: log,
        wasFound: true,
      );

      state = AsyncValue.data(result);
      _processing = false;
      return result;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      _processing = false;
      return null;
    }
  }

  void reset() {
    _processing = false;
    state = const AsyncValue.data(null);
  }
}

final scanProvider =
    StateNotifierProvider<ScanNotifier, AsyncValue<ScanResult?>>((ref) {
  return ScanNotifier();
});

// ─── Session Management ────────────────────────────────────────────────────

/// Hard-coded default sessions (in production, load from Supabase)
final defaultSessions = [
  SessionModel()
    ..remoteId = 'sem1_exam_2024'
    ..name = 'Semester 1 Exam'
    ..type = 'exam'
    ..isActive = true
    ..isSynced = true,
  SessionModel()
    ..remoteId = 'sem1_class_2024'
    ..name = 'Semester 1 Class'
    ..type = 'class'
    ..isActive = true
    ..isSynced = true
    ..latitude = -1.2
    ..longitude = 36.8
    ..radius = 50.0,
  SessionModel()
    ..remoteId = 'gate_main'
    ..name = 'Main Gate'
    ..type = 'gate'
    ..isActive = true
    ..isSynced = true,
  SessionModel()
    ..remoteId = 'library_main'
    ..name = 'Main Library'
    ..type = 'library'
    ..isActive = true
    ..isSynced = true,
];

class SelectedSessionNotifier extends StateNotifier<SessionInfo?> {
  SelectedSessionNotifier() : super(null) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final prefs = await SharedPreferences.getInstance();
    final id = prefs.getString(AppStrings.prefSelectedSession);
    if (id != null) {
      final session = defaultSessions
          .where((s) => (s.remoteId ?? s.id.toString()) == id)
          .firstOrNull;
      if (session != null) state = session;
    }
    state ??= defaultSessions.first;
  }

  Future<void> select(SessionInfo session) async {
    state = session;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
        AppStrings.prefSelectedSession, session.remoteId ?? session.id.toString());
  }
}

final selectedSessionProvider =
    StateNotifierProvider<SelectedSessionNotifier, SessionInfo?>((ref) {
  return SelectedSessionNotifier();
});

final sessionsProvider = Provider<List<SessionInfo>>((ref) => defaultSessions);
