import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/sync_queue_provider.dart';

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
                                          ElevatedButton(
                                            onPressed: () {
                                              // TODO: implement Excel import logic
                                            },
                                            child: const Text('Import'),
                                          ),
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
                                          Icon(LucideIcons.uploadCloud, color: const Color(0xFF1E90FF), size: 28),
                                          const SizedBox(height: 8),
                                          Text('Export Data', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                                          ElevatedButton(
                                            onPressed: () {
                                              // TODO: implement export logic
                                            },
                                            child: const Text('Export'),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 32),
                              Text('Sync Queue', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white)),
                              const SizedBox(height: 12),
                              Expanded(
                                child: Consumer(
                                  builder: (context, ref, _) {
                                    final queueAsync = ref.watch(syncQueueProvider);
                                    return queueAsync.when(
                                      data: (queue) => ListView.separated(
                                        itemCount: queue.length,
                                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                                        itemBuilder: (context, index) {
                                          final item = queue[index];
                                          return GlassCard(
                                            opacity: 0.08,
                                            borderRadius: 20,
                                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                            child: Row(
                                              children: [
                                                Icon(LucideIcons.refreshCw, color: Colors.white.withAlpha((0.60 * 255).round())),
                                                const SizedBox(width: 14),
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text(item.description, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                                                      Text(item.status, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w400, color: Colors.white.withAlpha((0.60 * 255).round()))),
                                                    ],
                                                  ),
                                                ),
                                                Container(
                                                  width: 10,
                                                  height: 10,
                                                  decoration: BoxDecoration(
                                                    color: item.status == 'Pending' ? const Color(0xFFFF3547) : const Color(0xFF00C851),
                                                    shape: BoxShape.circle,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          );
                                        },
                                      ),
                                      loading: () => const Center(child: CircularProgressIndicator()),
                                      error: (e, _) => Center(child: Text('Error loading queue', style: GoogleFonts.poppins(color: Colors.red))),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }
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
              color: Colors.white.withAlpha((0.60 * 255).round()),
            ),
          ),
        ],
      ),
    );
  }
}
