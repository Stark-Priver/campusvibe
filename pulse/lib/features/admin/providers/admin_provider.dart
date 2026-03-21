import 'package:excel/excel.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:io';
import '../../../core/constants/app_strings.dart';
import '../../../core/database/isar_service.dart';
import '../../../core/database/models/student_record.dart';
import '../../../core/sync/sync_service.dart';

enum AdminActionState { idle, loading, success, error }

class AdminState {
  final AdminActionState importState;
  final AdminActionState syncState;
  final String? importMessage;
  final String? syncMessage;
  final double syncProgress;
  final int importedCount;

  const AdminState({
    required this.importState,
    required this.syncState,
    this.importMessage,
    this.syncMessage,
    required this.syncProgress,
    required this.importedCount,
  });

  static const initial = AdminState(
    importState: AdminActionState.idle,
    syncState: AdminActionState.idle,
    syncProgress: 0,
    importedCount: 0,
  );

  AdminState copyWith({
    AdminActionState? importState,
    AdminActionState? syncState,
    String? importMessage,
    String? syncMessage,
    double? syncProgress,
    int? importedCount,
  }) {
    return AdminState(
      importState: importState ?? this.importState,
      syncState: syncState ?? this.syncState,
      importMessage: importMessage ?? this.importMessage,
      syncMessage: syncMessage ?? this.syncMessage,
      syncProgress: syncProgress ?? this.syncProgress,
      importedCount: importedCount ?? this.importedCount,
    );
  }
}

class AdminNotifier extends StateNotifier<AdminState> {
  final Ref _ref;
  AdminNotifier(this._ref) : super(AdminState.initial);

  Future<void> importExcel() async {
    state = state.copyWith(importState: AdminActionState.loading);

    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['xlsx', 'xls'],
        allowMultiple: false,
      );

      if (result == null || result.files.isEmpty) {
        state = state.copyWith(importState: AdminActionState.idle);
        return;
      }

      final filePath = result.files.single.path;
      if (filePath == null) throw Exception(AppStrings.errorInvalidFile);

      final bytes = File(filePath).readAsBytesSync();
      final excel = Excel.decodeBytes(bytes);

      final students = <StudentRecord>[];
      final sheet = excel.tables.values.firstOrNull;

      if (sheet == null) {
        throw Exception('No worksheet found in Excel file');
      }

      // Skip header row (index 0)
      for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
        final row = sheet.rows[rowIndex];
        if (row.isEmpty) continue;

        final studentId = _cellString(row, 0);
        final fullName = _cellString(row, 1);
        final course = _cellString(row, 2);
        final year = _cellInt(row, 3);
        final isEligible = _cellBool(row, 4);

        if (studentId.isEmpty || fullName.isEmpty) continue;

        students.add(StudentRecord.fromExcelRow(
          studentId: studentId,
          fullName: fullName,
          course: course.isEmpty ? 'Unknown' : course,
          year: year,
          isEligible: isEligible,
        ));
      }

      if (students.isEmpty) {
        throw Exception(
            'No valid student records found. Check column format:\nA: Student ID, B: Full Name, C: Course, D: Year, E: Eligible (TRUE/FALSE)');
      }

      await IsarService.upsertStudents(students);

      state = state.copyWith(
        importState: AdminActionState.success,
        importMessage:
            '${students.length} students imported successfully',
        importedCount: students.length,
      );
    } catch (e) {
      state = state.copyWith(
        importState: AdminActionState.error,
        importMessage: e.toString(),
      );
    }
  }

  Future<void> forceSync() async {
    state = state.copyWith(
      syncState: AdminActionState.loading,
      syncProgress: 0,
      syncMessage: null,
    );

    // Simulate progressive progress while sync runs
    _simulateProgress();

    await _ref.read(syncServiceProvider.notifier).sync();

    final syncResult = _ref.read(syncServiceProvider);
    if (syncResult.state == SyncState.success) {
      state = state.copyWith(
        syncState: AdminActionState.success,
        syncProgress: 1.0,
        syncMessage: AppStrings.syncSuccess,
      );
    } else {
      state = state.copyWith(
        syncState: AdminActionState.error,
        syncProgress: 0,
        syncMessage:
            syncResult.errorMessage ?? AppStrings.syncFailed,
      );
    }
  }

  void _simulateProgress() async {
    for (var i = 1; i <= 8; i++) {
      await Future.delayed(const Duration(milliseconds: 200));
      if (state.syncState != AdminActionState.loading) return;
      state = state.copyWith(syncProgress: i * 0.10);
    }
  }

  void reset() {
    state = AdminState.initial;
  }

  String _cellString(List<Data?> row, int index) {
    if (index >= row.length) return '';
    final cell = row[index];
    if (cell == null || cell.value == null) return '';
    return cell.value.toString().trim();
  }

  int _cellInt(List<Data?> row, int index) {
    final str = _cellString(row, index);
    return int.tryParse(str) ?? 1;
  }

  bool _cellBool(List<Data?> row, int index) {
    final str = _cellString(row, index).toLowerCase();
    return str == 'true' || str == '1' || str == 'yes' || str == 'eligible';
  }
}

final adminProvider =
    StateNotifierProvider<AdminNotifier, AdminState>((ref) {
  return AdminNotifier(ref);
});
