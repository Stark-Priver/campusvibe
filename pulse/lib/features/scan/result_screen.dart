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

class ResultScreen extends ConsumerStatefulWidget {
  final AttendanceLog? attendanceLog;
  final String scannedId;

  const ResultScreen({
    super.key,
    required this.attendanceLog,
    required this.scannedId,
  });

  @override
  ConsumerState<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends ConsumerState<ResultScreen> {
  final _bookletController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _bookletController.text = widget.attendanceLog?.bookletNumber ?? '';
  }

  @override
  void dispose() {
    _bookletController.dispose();
    super.dispose();
  }

  ScanStatus get _status {
    if (widget.attendanceLog == null) return ScanStatus.notFound;
    return widget.attendanceLog!.isEligible
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
  Widget build(BuildContext context) {
    final log = widget.attendanceLog;

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
                            if (log.sessionType == 'exam') ...[
                              const SizedBox(height: 12),
                              _buildBookletField(),
                              const SizedBox(height: 12),
                            ],
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
                            onPressed: () async {
                              if (log != null &&
                                  log.sessionType == 'exam' &&
                                  _bookletController.text.isNotEmpty) {
                                // Update log with booklet number
                                log.bookletNumber = _bookletController.text;
                                // In a real app, you'd save this back to DB
                                // For now, we've already saved the log in ScanNotifier,
                                // but we might need to update it.
                                await IsarService.saveAttendanceLog(log);
                              }
                              if (mounted) {
                                context.go(AppRoutes.scan);
                              }
                            },
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

  Widget _buildBookletField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Booklet Number',
          style: TextStyle(
            fontSize: 13,
            color: AppColors.textMuted,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: TextField(
            controller: _bookletController,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.book_outlined,
                  color: AppColors.textSecondary, size: 20),
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(vertical: 14),
              hintText: 'Enter booklet ID',
              hintStyle: TextStyle(color: AppColors.textMuted, fontSize: 14),
            ),
          ),
        ),
      ],
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
