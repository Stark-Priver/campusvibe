import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/isar_service.dart';
import '../../../core/database/models/attendance_log.dart';

enum LogFilter { all, eligible, notEligible, unsynced }

class LogsState {
  final List<AttendanceLog> allLogs;
  final List<AttendanceLog> filteredLogs;
  final String searchQuery;
  final LogFilter filter;
  final bool isLoading;

  const LogsState({
    required this.allLogs,
    required this.filteredLogs,
    required this.searchQuery,
    required this.filter,
    required this.isLoading,
  });

  static const initial = LogsState(
    allLogs: [],
    filteredLogs: [],
    searchQuery: '',
    filter: LogFilter.all,
    isLoading: true,
  );

  LogsState copyWith({
    List<AttendanceLog>? allLogs,
    List<AttendanceLog>? filteredLogs,
    String? searchQuery,
    LogFilter? filter,
    bool? isLoading,
  }) {
    return LogsState(
      allLogs: allLogs ?? this.allLogs,
      filteredLogs: filteredLogs ?? this.filteredLogs,
      searchQuery: searchQuery ?? this.searchQuery,
      filter: filter ?? this.filter,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class LogsNotifier extends StateNotifier<LogsState> {
  LogsNotifier() : super(LogsState.initial) {
    loadLogs();
  }

  Future<void> loadLogs() async {
    state = state.copyWith(isLoading: true);
    final logs = await IsarService.getAllLogs();
    final filtered = _applyFilters(
      logs: logs,
      query: state.searchQuery,
      filter: state.filter,
    );
    state = state.copyWith(
      allLogs: logs,
      filteredLogs: filtered,
      isLoading: false,
    );
  }

  void search(String query) {
    final filtered = _applyFilters(
      logs: state.allLogs,
      query: query,
      filter: state.filter,
    );
    state = state.copyWith(
      searchQuery: query,
      filteredLogs: filtered,
    );
  }

  void setFilter(LogFilter filter) {
    final filtered = _applyFilters(
      logs: state.allLogs,
      query: state.searchQuery,
      filter: filter,
    );
    state = state.copyWith(
      filter: filter,
      filteredLogs: filtered,
    );
  }

  List<AttendanceLog> _applyFilters({
    required List<AttendanceLog> logs,
    required String query,
    required LogFilter filter,
  }) {
    List<AttendanceLog> result = logs;

    // Apply filter
    switch (filter) {
      case LogFilter.eligible:
        result = result.where((l) => l.isEligible).toList();
        break;
      case LogFilter.notEligible:
        result = result.where((l) => !l.isEligible).toList();
        break;
      case LogFilter.unsynced:
        result = result.where((l) => !l.isSynced).toList();
        break;
      case LogFilter.all:
        break;
    }

    // Apply search query
    if (query.isNotEmpty) {
      final lower = query.toLowerCase();
      result = result.where((l) {
        return l.studentName.toLowerCase().contains(lower) ||
            l.studentId.toLowerCase().contains(lower) ||
            l.sessionName.toLowerCase().contains(lower);
      }).toList();
    }

    return result;
  }
}

final logsProvider =
    StateNotifierProvider<LogsNotifier, LogsState>((ref) {
  return LogsNotifier();
});
