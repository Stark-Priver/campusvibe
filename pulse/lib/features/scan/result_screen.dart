import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/database/models/attendance_log.dart';
import '../../core/router/app_router.dart';
import '../../core/widgets/glass_button.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/status_badge.dart';

class ResultScreen extends ConsumerWidget {
  final AttendanceLog? attendanceLog;
  final String scannedId;

  const ResultScreen({
    super.key,
    required this.attendanceLog,
    required this.scannedId,
  });

  ScanStatus get _status {
    if (attendanceLog == null) return ScanStatus.notFound;
    return attendanceLog!.isEligible
        ? ScanStatus.eligible
        : ScanStatus.notEligible;
  }

  Color get _accentColor {
    switch (_status) {
      case ScanStatus.eligible:
        return AppColors.success;
      case ScanStatus.notEligible:
        return AppColors.danger;
      case ScanStatus.notFound:
        return AppColors.brandYellow;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final log = attendanceLog;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // App bar
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                children: [
                  GlassCard(
                    opacity: 0.10,
                    borderRadius: 12,
                    padding: const EdgeInsets.all(8),
                    onTap: () => context.go(AppRoutes.scan),
                    child: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      color: AppColors.textPrimary,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Text(
                    AppStrings.resultTitle,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    // Status glow circle
                    Container(
                      width: 96,
                      height: 96,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _accentColor.withOpacity(0.12),
                        border: Border.all(
                          color: _accentColor.withOpacity(0.40),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: _accentColor.withOpacity(0.30),
                            blurRadius: 30,
                            spreadRadius: 4,
                          ),
                        ],
                      ),
                      child: Icon(
                        _status == ScanStatus.eligible
                            ? Icons.check_circle_rounded
                            : _status == ScanStatus.notEligible
                                ? Icons.cancel_rounded
                                : Icons.help_rounded,
                        color: _accentColor,
                        size: 46,
                      ),
                    )
                        .animate()
                        .scale(
                          begin: const Offset(0.5, 0.5),
                          duration: const Duration(milliseconds: 500),
                          curve: Curves.easeOutBack,
                        )
                        .fadeIn(duration: const Duration(milliseconds: 400)),

                    const SizedBox(height: 24),

                    // Main result card
                    GlassCard(
                      opacity: 0.14,
                      borderRadius: 24,
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          // Status badge
                          StatusBadge(status: _status, large: true),
                          const SizedBox(height: 24),

                          if (log != null) ...[
                            // Student name
                            Text(
                              log.studentName,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              log.studentId,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textSecondary,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ] else ...[
                            Text(
                              'ID: $scannedId',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              AppStrings.errorStudentNotFound,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],

                          const SizedBox(height: 24),
                          Divider(
                              color: Colors.white.withOpacity(0.10),
                              height: 1),
                          const SizedBox(height: 20),

                          // Detail rows
                          if (log != null) ...[
                            _DetailRow(
                              label: AppStrings.course,
                              value: log.sessionName,
                            ),
                            const SizedBox(height: 12),
                            _DetailRow(
                              label: AppStrings.session,
                              value:
                                  '${log.sessionName} (${log.sessionType.toUpperCase()})',
                            ),
                            const SizedBox(height: 12),
                          ],
                          _DetailRow(
                            label: AppStrings.scannedAt,
                            value: log != null
                                ? DateFormat('dd MMM yyyy · HH:mm:ss')
                                    .format(log.timestamp)
                                : DateFormat('dd MMM yyyy · HH:mm:ss')
                                    .format(DateTime.now()),
                          ),
                          if (log != null && !log.isSynced) ...[
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Container(
                                  width: 7,
                                  height: 7,
                                  decoration: const BoxDecoration(
                                    color: AppColors.brandYellow,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Text(
                                  'Pending cloud sync',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppColors.brandYellow,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                    )
                        .animate(delay: const Duration(milliseconds: 200))
                        .fadeIn(duration: const Duration(milliseconds: 400))
                        .slideY(
                          begin: 0.15,
                          duration: const Duration(milliseconds: 400),
                          curve: Curves.easeOut,
                        ),

                    const SizedBox(height: 32),

                    // Action buttons
                    Row(
                      children: [
                        Expanded(
                          child: GlassButton(
                            label: AppStrings.viewDetails,
                            borderColor:
                                Colors.white.withOpacity(0.25),
                            onPressed: () =>
                                context.go(AppRoutes.logs),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: PrimaryButton(
                            label: AppStrings.scanNext,
                            icon: Icons.qr_code_scanner_rounded,
                            onPressed: () => context.go(AppRoutes.scan),
                          ),
                        ),
                      ],
                    )
                        .animate(delay: const Duration(milliseconds: 350))
                        .fadeIn(duration: const Duration(milliseconds: 350)),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 100,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textMuted,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.end,
          ),
        ),
      ],
    );
  }
}
