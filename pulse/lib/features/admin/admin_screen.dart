import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/sync/sync_service.dart';
import '../../core/widgets/glass_button.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/status_badge.dart';
import '../dashboard/providers/dashboard_provider.dart';
import 'providers/admin_provider.dart';

class AdminScreen extends ConsumerWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adminState = ref.watch(adminProvider);
    final syncStatus = ref.watch(syncServiceProvider);
    final statsAsync = ref.watch(dashboardStatsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Text(
                AppStrings.adminTitle,
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Manage data, sync and sessions',
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),

              const SizedBox(height: 24),

              // Stats summary
              statsAsync.when(
                loading: () => const SizedBox.shrink(),
                error: (_, __) => const SizedBox.shrink(),
                data: (stats) => _StatsRow(
                  stats: stats,
                  lastSyncAt: syncStatus.lastSyncAt,
                ),
              ),

              const SizedBox(height: 24),

              // Import Excel card
              _ImportCard(state: adminState),

              const SizedBox(height: 16),

              // Force Sync card
              _SyncCard(state: adminState, syncStatus: syncStatus),

              const SizedBox(height: 16),

              // Session management card
              const _SessionsCard(),

              const SizedBox(height: 16),

              // Excel format guide
              _FormatGuideCard(),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final DashboardStats stats;
  final DateTime? lastSyncAt;

  const _StatsRow({required this.stats, this.lastSyncAt});

  @override
  Widget build(BuildContext context) {
    final syncText = lastSyncAt != null
        ? DateFormat('dd MMM, HH:mm').format(lastSyncAt!)
        : 'Never';

    return Row(
      children: [
        Expanded(
          child: _MiniStat(
            label: AppStrings.totalStudents,
            value: stats.totalStudents.toString(),
            color: AppColors.accentBlue,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MiniStat(
            label: AppStrings.eligibleStudents,
            value: stats.eligibleStudents.toString(),
            color: AppColors.success,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _MiniStat(
            label: AppStrings.lastSync,
            value: syncText,
            color: AppColors.brandYellow,
            smallValue: true,
          ),
        ),
      ],
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final bool smallValue;

  const _MiniStat({
    required this.label,
    required this.value,
    required this.color,
    this.smallValue = false,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.09,
      borderRadius: 14,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: smallValue ? 12 : 22,
              fontWeight: FontWeight.w700,
              color: color,
              letterSpacing: smallValue ? 0 : -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _ImportCard extends ConsumerWidget {
  final AdminState state;
  const _ImportCard({required this.state});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoading = state.importState == AdminActionState.loading;
    final isSuccess = state.importState == AdminActionState.success;
    final isError = state.importState == AdminActionState.error;

    return GlassCard(
      opacity: 0.11,
      borderRadius: 20,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: const Color(0xFF9C6FFF).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.upload_file_rounded,
                  color: Color(0xFF9C6FFF),
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      AppStrings.importExcel,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      AppStrings.importExcelDesc,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          if (isSuccess || isError) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isSuccess
                    ? AppColors.success.withOpacity(0.10)
                    : AppColors.danger.withOpacity(0.10),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isSuccess
                      ? AppColors.success.withOpacity(0.30)
                      : AppColors.danger.withOpacity(0.30),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isSuccess
                        ? Icons.check_circle_outline_rounded
                        : Icons.error_outline_rounded,
                    color: isSuccess
                        ? AppColors.success
                        : AppColors.danger,
                    size: 18,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      state.importMessage ?? '',
                      style: TextStyle(
                        fontSize: 13,
                        color: isSuccess
                            ? AppColors.success
                            : AppColors.danger,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 16),

          PrimaryButton(
            label: isLoading ? 'Importing...' : AppStrings.importExcel,
            icon: Icons.folder_open_rounded,
            isLoading: isLoading,
            width: double.infinity,
            onPressed: isLoading
                ? null
                : () {
                    ref.read(adminProvider.notifier).importExcel();
                  },
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(duration: const Duration(milliseconds: 400))
        .slideY(begin: 0.1, duration: const Duration(milliseconds: 400));
  }
}

class _SyncCard extends ConsumerWidget {
  final AdminState state;
  final SyncStatus syncStatus;

  const _SyncCard({required this.state, required this.syncStatus});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoading = state.syncState == AdminActionState.loading;
    final isSuccess = state.syncState == AdminActionState.success;
    final isError = state.syncState == AdminActionState.error;

    return GlassCard(
      opacity: 0.11,
      borderRadius: 20,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.sync_rounded,
                  color: AppColors.success,
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      AppStrings.forceSync,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${syncStatus.pendingCount} records pending',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              SyncDot(
                isOnline: syncStatus.state != SyncState.offline,
                isSyncing: syncStatus.state == SyncState.syncing,
              ),
            ],
          ),

          if (isLoading) ...[
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Syncing records...',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: state.syncProgress,
                    backgroundColor: Colors.white.withOpacity(0.08),
                    color: AppColors.accentBlue,
                    minHeight: 6,
                  ),
                ),
              ],
            ),
          ],

          if (isSuccess || isError) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isSuccess
                    ? AppColors.success.withOpacity(0.10)
                    : AppColors.danger.withOpacity(0.10),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isSuccess
                      ? AppColors.success.withOpacity(0.30)
                      : AppColors.danger.withOpacity(0.30),
                ),
              ),
              child: Text(
                state.syncMessage ?? '',
                style: TextStyle(
                  fontSize: 13,
                  color: isSuccess
                      ? AppColors.success
                      : AppColors.danger,
                ),
              ),
            ),
          ],

          const SizedBox(height: 16),

          GlassButton(
            label: isLoading ? 'Syncing...' : AppStrings.forceSync,
            icon: Icons.cloud_upload_rounded,
            borderColor: AppColors.success.withOpacity(0.50),
            textColor: AppColors.success,
            isLoading: isLoading,
            width: double.infinity,
            onPressed: isLoading
                ? null
                : () {
                    ref.read(adminProvider.notifier).forceSync();
                  },
          ),
        ],
      ),
    )
        .animate(delay: const Duration(milliseconds: 80))
        .fadeIn(duration: const Duration(milliseconds: 400))
        .slideY(begin: 0.1, duration: const Duration(milliseconds: 400));
  }
}

class _SessionsCard extends ConsumerWidget {
  const _SessionsCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return GlassCard(
      opacity: 0.11,
      borderRadius: 20,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  color: AppColors.brandYellow.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.event_note_rounded,
                  color: AppColors.brandYellow,
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      AppStrings.manageSessions,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      AppStrings.manageSessionsDesc,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Divider(color: Colors.white.withOpacity(0.08)),
          const SizedBox(height: 12),
          // Session list
          ..._defaultSessionTiles(),
        ],
      ),
    )
        .animate(delay: const Duration(milliseconds: 160))
        .fadeIn(duration: const Duration(milliseconds: 400))
        .slideY(begin: 0.1, duration: const Duration(milliseconds: 400));
  }

  List<Widget> _defaultSessionTiles() {
    final sessions = [
      ('Semester 1 Exam', 'exam', true),
      ('Semester 1 Class', 'class', true),
      ('Semester 2 Exam', 'exam', true),
      ('Semester 2 Class', 'class', true),
      ('Supplementary Exam', 'exam', true),
    ];

    return sessions.map((item) {
      final (name, type, active) = item;
      final isExam = type == 'exam';
      return Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: isExam
                    ? AppColors.danger.withOpacity(0.15)
                    : AppColors.accentBlue.withOpacity(0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                type.toUpperCase(),
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: isExam
                      ? AppColors.danger
                      : AppColors.accentBlue,
                  letterSpacing: 0.5,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                name,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: active ? AppColors.success : AppColors.textMuted,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      );
    }).toList();
  }
}

class _FormatGuideCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.07,
      borderRadius: 18,
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.info_outline_rounded,
                color: AppColors.accentBlue,
                size: 18,
              ),
              const SizedBox(width: 8),
              const Text(
                'Excel Import Format',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _formatRow('Column A', 'Student ID (unique)'),
          _formatRow('Column B', 'Full Name'),
          _formatRow('Column C', 'Course / Programme'),
          _formatRow('Column D', 'Year of Study (1–6)'),
          _formatRow('Column E', 'Eligible (TRUE or FALSE)'),
          const SizedBox(height: 10),
          Text(
            'Row 1 is treated as headers and will be skipped automatically.',
            style: TextStyle(
              fontSize: 11,
              color: AppColors.textMuted,
              height: 1.5,
            ),
          ),
        ],
      ),
    )
        .animate(delay: const Duration(milliseconds: 240))
        .fadeIn(duration: const Duration(milliseconds: 400));
  }

  Widget _formatRow(String col, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Container(
            width: 72,
            child: Text(
              col,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.brandYellow,
              ),
            ),
          ),
          Text(
            desc,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
