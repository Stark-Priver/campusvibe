import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/router/app_router.dart';
import '../../core/sync/sync_service.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/status_badge.dart';
import '../dashboard/providers/dashboard_provider.dart';
import '../../core/database/models/attendance_log.dart';
import '../../core/providers/auth_provider.dart';
import '../watchman/watchman_dashboard.dart';
import '../library/library_dashboard.dart';
import '../invigilator/invigilator_dashboard.dart';
import '../student/student_dashboard.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final role = authState.user?.role;

    if (role == 'watchman') return const WatchmanDashboard();
    if (role == 'librarian') return const LibraryDashboard();
    if (role == 'invigilator') return const InvigilatorDashboard();
    if (role == 'student') return const StudentDashboard();

    final statsAsync = ref.watch(dashboardStatsProvider);
    final recentAsync = ref.watch(recentLogsProvider);
    final syncStatus = ref.watch(syncServiceProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _DashboardAppBar(syncStatus: syncStatus),
            Expanded(
              child: RefreshIndicator(
                color: AppColors.accentBlue,
                backgroundColor: const Color(0xFF1A2F5A),
                onRefresh: ref.read(dashboardSyncProvider),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Stats Row
                      statsAsync.when(
                        loading: () => const _StatsRowSkeleton(),
                        error: (_, __) => const SizedBox.shrink(),
                        data: (stats) => _StatsRow(stats: stats),
                      ),

                      const SizedBox(height: 28),

                      // Quick Actions
                      const Text(
                        'Quick Actions',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 14),
                      _QuickActionsGrid(),

                      const SizedBox(height: 28),

                      // Recent Activity
                      const Text(
                        AppStrings.recentActivity,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 14),

                      recentAsync.when(
                        loading: () => const _ActivitySkeleton(),
                        error: (_, __) => const _EmptyActivity(),
                        data: (logs) => logs.isEmpty
                            ? const _EmptyActivity()
                            : _RecentActivityList(logs: logs),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardAppBar extends StatelessWidget {
  final SyncStatus syncStatus;

  const _DashboardAppBar({required this.syncStatus});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                AppStrings.appName,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 2),
              SyncDot(
                isOnline: syncStatus.state != SyncState.offline,
                isSyncing: syncStatus.state == SyncState.syncing,
              ),
            ],
          ),
          const Spacer(),
          GlassCard(
            opacity: 0.10,
            borderRadius: 14,
            padding: const EdgeInsets.all(10),
            onTap: () => context.go(AppRoutes.admin),
            child: const Icon(
              Icons.settings_outlined,
              color: AppColors.textSecondary,
              size: 22,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final DashboardStats stats;

  const _StatsRow({required this.stats});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _StatTile(
            label: AppStrings.totalStudents,
            value: stats.totalStudents.toString(),
            color: AppColors.accentBlue,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatTile(
            label: AppStrings.eligibleStudents,
            value: stats.eligibleStudents.toString(),
            color: AppColors.success,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _StatTile(
            label: 'Unsynced',
            value: stats.unsyncedLogs.toString(),
            color: AppColors.brandYellow,
          ),
        ),
      ],
    )
        .animate()
        .fadeIn(duration: const Duration(milliseconds: 400))
        .slideY(begin: 0.2, duration: const Duration(milliseconds: 400));
  }
}

class _StatTile extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _StatTile({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.10,
      borderRadius: 16,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: color,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _QuickActionsGrid extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final actions = [
      _ActionItem(
        icon: Icons.qr_code_scanner_rounded,
        iconColor: AppColors.accentBlue,
        title: AppStrings.startScan,
        description: AppStrings.startScanDesc,
        onTap: () => context.go(AppRoutes.scan),
      ),
      _ActionItem(
        icon: Icons.receipt_long_rounded,
        iconColor: AppColors.brandYellow,
        title: AppStrings.viewLogs,
        description: AppStrings.viewLogsDesc,
        onTap: () => context.go(AppRoutes.logs),
      ),
      _ActionItem(
        icon: Icons.sync_rounded,
        iconColor: AppColors.success,
        title: AppStrings.syncData,
        description: AppStrings.syncDataDesc,
        onTap: ref.read(dashboardSyncProvider),
      ),
      _ActionItem(
        icon: Icons.upload_file_rounded,
        iconColor: const Color(0xFF9C6FFF),
        title: AppStrings.importData,
        description: AppStrings.importDataDesc,
        onTap: () => context.go(AppRoutes.admin),
      ),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1.1,
      ),
      itemCount: actions.length,
      itemBuilder: (context, index) {
        return GlassActionCard(
          icon: actions[index].icon,
          iconColor: actions[index].iconColor,
          title: actions[index].title,
          description: actions[index].description,
          onTap: actions[index].onTap,
        )
            .animate(delay: Duration(milliseconds: index * 80))
            .fadeIn(duration: const Duration(milliseconds: 350))
            .scale(
              begin: const Offset(0.92, 0.92),
              duration: const Duration(milliseconds: 350),
              curve: Curves.easeOut,
            );
      },
    );
  }
}

class _ActionItem {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String description;
  final VoidCallback onTap;

  const _ActionItem({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.description,
    required this.onTap,
  });
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
              Icon(
                Icons.inbox_rounded,
                size: 40,
                color: AppColors.textMuted,
              ),
              const SizedBox(height: 12),
              const Text(
                AppStrings.noRecentActivity,
                style: TextStyle(
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

class _StatsRowSkeleton extends StatelessWidget {
  const _StatsRowSkeleton();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(
        3,
        (i) => Expanded(
          child: Padding(
            padding: EdgeInsets.only(right: i < 2 ? 12 : 0),
            child: GlassCard(
              opacity: 0.06,
              borderRadius: 16,
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 40,
                    height: 28,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 60,
                    height: 10,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ActivitySkeleton extends StatelessWidget {
  const _ActivitySkeleton();

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.08,
      borderRadius: 20,
      padding: const EdgeInsets.all(16),
      child: Column(
        children: List.generate(
          4,
          (i) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 140,
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.10),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 100,
                        height: 10,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
