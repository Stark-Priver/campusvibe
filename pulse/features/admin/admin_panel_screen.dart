import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';

class AdminPanelScreen extends StatelessWidget {
  const AdminPanelScreen({super.key});

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
                  'Admin Panel',
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.3,
                    color: Colors.white,
                  ),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.settings, color: Colors.white),
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
            Row(
              children: [
                Expanded(
                  child: GlassCard(
                    opacity: 0.10,
                    borderRadius: 20,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 22),
                    child: Column(
                      children: [
                        Icon(LucideIcons.fileSpreadsheet, color: const Color(0xFFFFC107), size: 28),
                        const SizedBox(height: 8),
                        Text('Import Excel', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: GlassCard(
                    opacity: 0.10,
                    borderRadius: 20,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 22),
                    child: Column(
                      children: [
                        Icon(LucideIcons.refreshCw, color: const Color(0xFF1E90FF), size: 28),
                        const SizedBox(height: 8),
                        Text('Force Sync', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: GlassCard(
                    opacity: 0.10,
                    borderRadius: 20,
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 22),
                    child: Column(
                      children: [
                        Icon(LucideIcons.users, color: const Color(0xFFFFC107), size: 28),
                        const SizedBox(height: 8),
                        Text('Manage Sessions', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            Text('Sync Progress', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white)),
            const SizedBox(height: 10),
            GlassCard(
              opacity: 0.10,
              borderRadius: 20,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              child: Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: 0.7, // Replace with real progress
                      backgroundColor: Colors.white.withOpacity(0.08),
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF1E90FF)),
                      minHeight: 8,
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text('70%', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _StatTile(label: 'Total Students', value: '1200'),
                _StatTile(label: 'Eligible Count', value: '1150'),
                _StatTile(label: 'Last Sync', value: '10:45 AM'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final String label;
  final String value;
  const _StatTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.08,
      borderRadius: 16,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      child: Column(
        children: [
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: Colors.white.withOpacity(0.60),
            ),
          ),
        ],
      ),
    );
  }
}
