import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../../../core/constants/app_strings.dart';
import '../../../core/database/isar_service.dart';
import '../../../core/database/models/attendance_log.dart';
import '../../../core/database/models/student_record.dart';

const _uuid = Uuid();

class SessionInfo {
  final String id;
  final String name;
  final String type;

  const SessionInfo({
    required this.id,
    required this.name,
    required this.type,
  });
}

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
        sessionId: session.id,
        sessionName: session.name,
        sessionType: session.type,
        isEligible: student.isEligible,
        localId: _uuid.v4(),
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
  const SessionInfo(
      id: 'sem1_exam_2024', name: 'Semester 1 Exam', type: 'exam'),
  const SessionInfo(
      id: 'sem1_class_2024', name: 'Semester 1 Class', type: 'class'),
  const SessionInfo(
      id: 'sem2_exam_2024', name: 'Semester 2 Exam', type: 'exam'),
  const SessionInfo(
      id: 'sem2_class_2024', name: 'Semester 2 Class', type: 'class'),
  const SessionInfo(
      id: 'supp_exam_2024', name: 'Supplementary Exam', type: 'exam'),
];

class SelectedSessionNotifier extends StateNotifier<SessionInfo?> {
  SelectedSessionNotifier() : super(null) {
    _loadSaved();
  }

  Future<void> _loadSaved() async {
    final prefs = await SharedPreferences.getInstance();
    final id = prefs.getString(AppStrings.prefSelectedSession);
    if (id != null) {
      final session = defaultSessions.where((s) => s.id == id).firstOrNull;
      if (session != null) state = session;
    }
    state ??= defaultSessions.first;
  }

  Future<void> select(SessionInfo session) async {
    state = session;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppStrings.prefSelectedSession, session.id);
  }
}

final selectedSessionProvider =
    StateNotifierProvider<SelectedSessionNotifier, SessionInfo?>((ref) {
  return SelectedSessionNotifier();
});

final sessionsProvider = Provider<List<SessionInfo>>((ref) => defaultSessions);
