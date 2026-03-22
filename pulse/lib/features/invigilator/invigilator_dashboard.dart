import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/router/app_router.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/glass_button.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/widgets/status_badge.dart';
import '../../core/database/models/attendance_log.dart';
import '../dashboard/providers/dashboard_provider.dart';

class InvigilatorDashboard extends ConsumerWidget {
  const InvigilatorDashboard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(ref, user),
              const SizedBox(height: 32),
              const Text(
                'Exam Management',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Scan IDs and assign booklets for current examination sessions.',
                style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 48),
              Center(
                child: GlassCard(
                  opacity: 0.15,
                  borderRadius: 32,
                  padding: const EdgeInsets.all(48),
                  onTap: () => context.go(AppRoutes.scan),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppColors.danger.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.assignment_turned_in_rounded,
                          size: 72,
                          color: AppColors.danger,
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        'Start Exam Scan',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),
              GlassCard(
                opacity: 0.1,
                borderRadius: 16,
                padding: const EdgeInsets.all(16),
                onTap: () => context.go(AppRoutes.logs),
                child: const Row(
                  children: [
                    Icon(Icons.list_alt_rounded, color: AppColors.textSecondary),
                    SizedBox(width: 12),
                    Text(
                      'View Booklet Assignments',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Spacer(),
                    Icon(Icons.chevron_right_rounded, color: AppColors.textSecondary),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              const Text(
                'Recent Scans',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              ref.watch(recentLogsProvider).when(
                    data: (logs) => logs.isEmpty
                        ? const _EmptyActivity()
                        : _RecentActivityList(logs: logs),
                    loading: () => const Center(
                      child: CircularProgressIndicator(color: AppColors.accentBlue),
                    ),
                    error: (e, _) => Center(
                      child: Text(
                        'Error loading scans',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ),
                  ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(WidgetRef ref, AppUser? user) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Invigilator Desk',
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              'Hall: A10 · ${user?.fullName ?? "Staff"}',
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        IconButton(
          icon: const Icon(Icons.logout_rounded, color: AppColors.textSecondary),
          onPressed: () => ref.read(authProvider.notifier).logout(),
        ),
      ],
    );
  }
}

class _RecentActivityList extends StatelessWidget {
  final List<AttendanceLog> logs;

  const _RecentActivityList({required this.logs});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.08,
      borderRadius: 20,
      padding: EdgeInsets.zero,
      child: Column(
        children: List.generate(logs.length, (i) {
          final log = logs[i];
          final isLast = i == logs.length - 1;
          return _ActivityTile(log: log, showDivider: !isLast);
        }),
      ),
    );
  }
}

class _ActivityTile extends StatelessWidget {
  final AttendanceLog log;
  final bool showDivider;

  const _ActivityTile({required this.log, required this.showDivider});

  @override
  Widget build(BuildContext context) {
    final status = log.isEligible ? ScanStatus.eligible : ScanStatus.notEligible;
    final time = DateFormat('HH:mm').format(log.timestamp);
    final date = DateFormat('dd MMM').format(log.timestamp);

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              StatusDot(status: status),
              const SizedBox(width: 12),
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
                    const SizedBox(height: 2),
                    Text(
                      '${log.sessionName} · ${log.studentId}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    time,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    date,
                    style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
              if (!log.isSynced) ...[
                const SizedBox(width: 8),
                Container(
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: AppColors.brandYellow,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ],
          ),
        ),
        if (showDivider)
          Divider(
            height: 1,
            thickness: 1,
            color: Colors.white.withOpacity(0.06),
            indent: 40,
          ),
      ],
    );
  }
}

class _EmptyActivity extends StatelessWidget {
  const _EmptyActivity();

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.08,
      borderRadius: 20,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24),
          child: Column(
            children: [
              const Icon(
                Icons.inbox_rounded,
                size: 40,
                color: AppColors.textSecondary,
              ),
              const SizedBox(height: 12),
              Text(
                AppStrings.noRecentActivity,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
