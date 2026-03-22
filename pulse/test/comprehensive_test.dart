import 'package:flutter_test/flutter_test.dart';
import 'package:pulse_campus/core/database/models/attendance_log.dart';
import 'package:pulse_campus/core/database/models/session_model.dart';

void main() {
  group('Attendance Logic Tests', () {
    test('AttendanceLog.create should correctly assign bookletNumber', () {
      final log = AttendanceLog.create(
        studentId: 'S123',
        studentName: 'John Doe',
        sessionId: 'exam_01',
        sessionName: 'Math Exam',
        sessionType: 'exam',
        isEligible: true,
        localId: 'uuid_123',
        bookletNumber: 'B001',
      );

      expect(log.bookletNumber, 'B001');
      expect(log.sessionType, 'exam');
    });

    test('AttendanceLog.create should correctly assign isStudentCheckIn', () {
      final log = AttendanceLog.create(
        studentId: 'S123',
        studentName: 'John Doe',
        sessionId: 'class_01',
        sessionName: 'CS 101',
        sessionType: 'class',
        isEligible: true,
        localId: 'uuid_456',
        isStudentCheckIn: true,
      );

      expect(log.isStudentCheckIn, true);
    });
  });

  group('Session Model Tests', () {
    test('SessionModel should hold geofencing data', () {
      final session = SessionModel()
        ..name = 'Hall A'
        ..type = 'class'
        ..isActive = true
        ..isSynced = false
        ..latitude = -1.234
        ..longitude = 36.821
        ..radius = 50.0;

      expect(session.latitude, -1.234);
      expect(session.longitude, 36.821);
      expect(session.radius, 50.0);
    });
  });
}
