import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';

class AttendanceLogsScreen extends StatelessWidget {
  const AttendanceLogsScreen({super.key});

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
                  'Attendance Logs',
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.3,
                    color: Colors.white,
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.search, color: Colors.white),
                  onPressed: () {},
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
            GlassCard(
              opacity: 0.10,
              borderRadius: 20,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.search,
                    color: Colors.white54,
                    size: 20,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        color: Colors.white,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Search logs...',
                        hintStyle: GoogleFonts.poppins(
                          fontSize: 14,
                              color: Colors.white.withAlpha((0.35 * 255).round()),
                        ),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _FilterChip(label: 'All', selected: true),
                const SizedBox(width: 8),
                _FilterChip(label: 'Eligible'),
                const SizedBox(width: 8),
                _FilterChip(label: 'Not Eligible'),
                const SizedBox(width: 8),
                _FilterChip(label: 'Unsynced'),
              ],
            ),
            const SizedBox(height: 18),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () async {},
                child: ListView.separated(
                  itemCount: 5, // Replace with real data
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (context, index) => GlassCard(
                    opacity: 0.08,
                    borderRadius: 20,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                    child: Row(
                      children: [
                        Icon(
                              LucideIcons.user,
                              color: Colors.white.withAlpha((0.60 * 255).round()),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Student Name $index',
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                              Text(
                                'Session: Exam | 10:30 AM',
                                style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w400,
                                      color: Colors.white.withAlpha((0.60 * 255).round()),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: index % 2 == 0
                                ? const Color(0xFF00C851)
                                : const Color(0xFFFF3547),
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
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

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  const _FilterChip({required this.label, this.selected = false});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: selected ? 0.10 : 0.05,
      borderRadius: 32,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
      child: Text(
        label,
        style: GoogleFonts.poppins(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
    );
  }
}
