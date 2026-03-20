import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/constants/app_strings.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/student_provider.dart';
import '../../core/providers/attendance_log_provider.dart';
import 'package:go_router/go_router.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1F44),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(64),
        child: Padding(
          padding: const EdgeInsets.only(top: 16.0),
          child: GlassCard(
            opacity: 0.10,
            borderRadius: 24,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  AppStrings.appName,
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.3,
                    color: Colors.white,
                  ),
                ),
                Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: Colors.greenAccent.shade400,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.greenAccent.shade400.withAlpha(
                              (0.5 * 255).round(),
                            ),
                            blurRadius: 6,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    IconButton(
                      icon: const Icon(
                        LucideIcons.settings,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        context.go('/admin');
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _DashboardActionCard(
                  icon: LucideIcons.scanLine,
                  color: const Color(0xFF1E90FF),
                  title: AppStrings.startScan,
                  description: 'Scan student IDs',
                  onTap: () => context.go('/scan'),
                ),
                _DashboardActionCard(
                  icon: LucideIcons.bookOpen,
                  color: const Color(0xFFFFC107),
                  title: AppStrings.viewLogs,
                  description: 'View attendance logs',
                  onTap: () => context.go('/logs'),
                ),
                _DashboardActionCard(
                  icon: LucideIcons.refreshCw,
                  color: const Color(0xFF1E90FF),
                  title: AppStrings.syncData,
                  description: 'Sync with cloud',
                  onTap: () {
                    // TODO: trigger sync logic
                  },
                ),
                _DashboardActionCard(
                  icon: LucideIcons.uploadCloud,
                  color: const Color(0xFFFFC107),
                  title: AppStrings.importData,
                  description: 'Import Excel data',
                  onTap: () {
                    // TODO: implement Excel import
                  },
                ),
              ],
            ),
            const SizedBox(height: 32),
            Text(
              AppStrings.recentActivity,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Consumer(
                builder: (context, ref, _) {
                  final logsAsync = ref.watch(attendanceLogsProvider);
                  return logsAsync.when(
                    data: (logs) => ListView.separated(
                      itemCount: logs.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final log = logs[index];
                        return GlassCard(
                          opacity: 0.08,
                          borderRadius: 20,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          child: Row(
                            children: [
                              Icon(
                                LucideIcons.userCheck,
                                color: Colors.white.withAlpha(
                                  (0.60 * 255).round(),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      log.studentId,
                                      style: GoogleFonts.poppins(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: Colors.white,
                                      ),
                                    ),
                                    Text(
                                      'Session: ${log.sessionType} | ${log.timestamp.hour}:${log.timestamp.minute.toString().padLeft(2, '0')}',
                                      style: GoogleFonts.poppins(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w400,
                                        color: Colors.white.withAlpha(
                                          (0.60 * 255).round(),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                width: 10,
                                height: 10,
                                decoration: BoxDecoration(
                                  color: log.isSynced
                                      ? const Color(0xFF00C851)
                                      : const Color(0xFFFF3547),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (e, _) => Center(
                      child: Text(
                        'Error loading logs',
                        style: GoogleFonts.poppins(color: Colors.red),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _DashboardBottomNav(),
    );
  }
}

class _DashboardActionCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String description;
  final VoidCallback onTap;

  const _DashboardActionCard({
    required this.icon,
    required this.color,
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        opacity: 0.10,
        borderRadius: 20,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 22),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 14),
            Text(
              color: Colors.white.withAlpha((0.60 * 255).round()),
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              description,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Colors.white.withAlpha((0.60 * 255).round()),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardBottomNav extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 12, right: 12, bottom: 16),
      child: GlassCard(
        opacity: 0.10,
        borderRadius: 24,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavItem(
              icon: LucideIcons.home,
              label: AppStrings.home,
              selected: true,
            ),
            _NavItem(icon: LucideIcons.scanLine, label: AppStrings.scan),
            _NavItem(icon: LucideIcons.bookOpen, label: AppStrings.logs),
            _NavItem(icon: LucideIcons.settings, label: AppStrings.settings),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool selected;

  const _NavItem({
    required this.icon,
    required this.label,
    this.selected = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          color: selected
              ? const Color(0xFF1E90FF)
              : Colors.white.withOpacity(0.60),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: selected
                ? const Color(0xFF1E90FF)
                : Colors.white.withAlpha((0.60 * 255).round()),
          ),
        ),
      ],
    );
  }
}
