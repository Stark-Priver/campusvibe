import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/sync/sync_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/status_badge.dart';
import '../../core/database/models/attendance_log.dart';
import 'providers/logs_provider.dart';

class LogsScreen extends ConsumerStatefulWidget {
  const LogsScreen({super.key});

  @override
  ConsumerState<LogsScreen> createState() => _LogsScreenState();
}

class _LogsScreenState extends ConsumerState<LogsScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _onRefresh() async {
    await ref.read(syncServiceProvider.notifier).sync();
    ref.read(logsProvider.notifier).loadLogs();
  }

  @override
  Widget build(BuildContext context) {
    final logsState = ref.watch(logsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    AppStrings.logsTitle,
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${logsState.filteredLogs.length} records',
                    style: const TextStyle(
                      fontSize: 13,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Search bar
                  _SearchBar(
                    controller: _searchController,
                    onChanged: (q) =>
                        ref.read(logsProvider.notifier).search(q),
                  ),

                  const SizedBox(height: 12),

                  // Filter chips
                  _FilterChips(currentFilter: logsState.filter),
                ],
              ),
            ),

            // Logs list
            Expanded(
              child: logsState.isLoading
                  ? const _LoadingState()
                  : logsState.filteredLogs.isEmpty
                      ? const _EmptyState()
                      : RefreshIndicator(
                          color: AppColors.accentBlue,
                          backgroundColor: const Color(0xFF1A2F5A),
                          onRefresh: _onRefresh,
                          child: ListView.builder(
                            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                            physics:
                                const AlwaysScrollableScrollPhysics(),
                            itemCount: logsState.filteredLogs.length,
                            itemBuilder: (context, index) {
                              final log = logsState.filteredLogs[index];
                              return Padding(
                                padding:
                                    const EdgeInsets.only(bottom: 10),
                                child: _LogTile(log: log),
                              )
                                  .animate(
                                    delay: Duration(
                                        milliseconds: index * 40),
                                  )
                                  .fadeIn(
                                    duration:
                                        const Duration(milliseconds: 300),
                                  )
                                  .slideX(
                                    begin: -0.05,
                                    duration:
                                        const Duration(milliseconds: 300),
                                  );
                            },
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  const _SearchBar({
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.10,
      borderRadius: 14,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      child: Row(
        children: [
          Icon(
            Icons.search_rounded,
            color: AppColors.textMuted,
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: TextField(
              controller: controller,
              onChanged: onChanged,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
              ),
              decoration: const InputDecoration(
                hintText: AppStrings.searchPlaceholder,
                hintStyle: TextStyle(
                  color: AppColors.textMuted,
                  fontSize: 14,
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          if (controller.text.isNotEmpty)
            GestureDetector(
              onTap: () {
                controller.clear();
                onChanged('');
              },
              child: Icon(
                Icons.close_rounded,
                color: AppColors.textMuted,
                size: 18,
              ),
            ),
        ],
      ),
    );
  }
}

class _FilterChips extends ConsumerWidget {
  final LogFilter currentFilter;

  const _FilterChips({required this.currentFilter});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filters = [
      (LogFilter.all, AppStrings.filterAll),
      (LogFilter.eligible, AppStrings.filterEligible),
      (LogFilter.notEligible, AppStrings.filterNotEligible),
      (LogFilter.unsynced, AppStrings.filterUnsynced),
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filters.map((item) {
          final (filter, label) = item;
          final isActive = currentFilter == filter;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: _FilterChip(
              label: label,
              isActive: isActive,
              onTap: () =>
                  ref.read(logsProvider.notifier).setFilter(filter),
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive
              ? AppColors.accentBlue.withOpacity(0.25)
              : Colors.white.withOpacity(0.07),
          borderRadius: BorderRadius.circular(100),
          border: Border.all(
            color: isActive
                ? AppColors.accentBlue.withOpacity(0.60)
                : Colors.white.withOpacity(0.15),
            width: 1.0,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isActive
                ? AppColors.accentBlue
                : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

class _LogTile extends StatelessWidget {
  final AttendanceLog log;

  const _LogTile({required this.log});

  @override
  Widget build(BuildContext context) {
    final status =
        log.isEligible ? ScanStatus.eligible : ScanStatus.notEligible;
    final timeStr = DateFormat('HH:mm').format(log.timestamp);
    final dateStr = DateFormat('dd MMM yyyy').format(log.timestamp);

    return GlassCard(
      opacity: 0.09,
      borderRadius: 16,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          StatusDot(status: status),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  log.studentName,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      log.studentId,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    Text(
                      '  ·  ',
                      style: TextStyle(
                        color: AppColors.textMuted,
                        fontSize: 12,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        log.sessionName,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                timeStr,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                dateStr,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
              if (!log.isSynced) ...[
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppColors.brandYellow.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: AppColors.brandYellow.withOpacity(0.40),
                    ),
                  ),
                  child: const Text(
                    'Pending',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: AppColors.brandYellow,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 56,
            color: AppColors.textMuted,
          ),
          const SizedBox(height: 16),
          const Text(
            AppStrings.noLogsFound,
            style: TextStyle(
              fontSize: 15,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Start scanning student IDs to\nbuild attendance records',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textMuted,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _LoadingState extends StatelessWidget {
  const _LoadingState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: CircularProgressIndicator(color: AppColors.accentBlue),
    );
  }
}
