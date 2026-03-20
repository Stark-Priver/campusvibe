import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/student_record.dart';
import '../models/attendance_log.dart';

class SupabaseRepository {
  final SupabaseClient client;
  SupabaseRepository(this.client);

  // StudentRecord
  Future<List<StudentRecord>> fetchAllStudents() async {
    final response = await client.from('student_records').select();
    return (response as List)
        .map(
          (e) => StudentRecord()
            ..studentId = e['student_id']
            ..fullName = e['full_name']
            ..course = e['course']
            ..year = e['year']
            ..isEligible = e['is_eligible']
            ..syncedAt = e['synced_at'] == null
                ? null
                : DateTime.parse(e['synced_at']),
        )
        .toList();
  }

  // AttendanceLog
  Future<void> uploadAttendanceLogs(List<AttendanceLog> logs) async {
    final data = logs
        .map(
          (log) => {
            'student_id': log.studentId,
            'session_id': log.sessionId,
            'session_type': log.sessionType,
            'timestamp': log.timestamp.toIso8601String(),
            'is_synced': true,
          },
        )
        .toList();
    await client
        .from('attendance_logs')
        .insert(data);
  }
}
