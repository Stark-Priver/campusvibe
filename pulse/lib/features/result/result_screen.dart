import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';

class ResultScreen extends StatelessWidget {
  final String fullName;
  final String regNumber;
  final String course;
  final String status;
  final String sessionId;
  final DateTime timestamp;

  const ResultScreen({
    super.key,
    required this.fullName,
    required this.regNumber,
    required this.course,
    required this.status,
    required this.sessionId,
    required this.timestamp,
  });

  Map<String, dynamic> _getStatusData(String status) {
    switch (status.toLowerCase()) {
      case 'present':
        return {
          'color': const Color(0xFF00C851),
          'icon': LucideIcons.checkCircle,
          'label': 'Present',
        };
      case 'absent':
        return {
          'color': const Color(0xFFFF3547),
          'icon': LucideIcons.xCircle,
          'label': 'Absent',
        };
      case 'late':
        return {
          'color': const Color(0xFFFFC107),
          'icon': LucideIcons.alertCircle,
          'label': 'Late',
        };
      case 'not found':
        return {
          'color': Colors.grey,
          'icon': LucideIcons.helpCircle,
          'label': 'Not Found',
        };
      default:
        return {
          'color': Colors.grey,
          'icon': LucideIcons.helpCircle,
          'label': status,
        };
    }
  }

  String _formatTimestamp(DateTime dt) {
    return '${dt.year}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final statusData = _getStatusData(status);
    return Scaffold(
      backgroundColor: const Color(0xFF0A1F44),
      body: Center(
        child: GlassCard(
          opacity: 0.16,
          borderRadius: 24,
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 36),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                fullName,
                style: GoogleFonts.poppins(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                regNumber,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withAlpha((0.60 * 255).round()),
                ),
              ),
              Text(
                course,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withAlpha((0.60 * 255).round()),
                ),
              ),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                decoration: BoxDecoration(
                  color: statusData['color'],
                  borderRadius: BorderRadius.circular(32),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(statusData['icon'], color: Colors.white, size: 20),
                    const SizedBox(width: 10),
                    Text(
                      statusData['label'],
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Session: $sessionId',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withAlpha((0.60 * 255).round()),
                ),
              ),
              Text(
                'Time: ${timestamp.hour}:${timestamp.minute.toString().padLeft(2, '0')}',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w400,
                  color: Colors.white.withAlpha((0.60 * 255).round()),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GlassButton extends StatelessWidget {
  final String label;
  final Color borderColor;
  final VoidCallback onTap;
  final bool ghost;

  const _GlassButton({
    required this.label,
    required this.borderColor,
    required this.onTap,
    this.ghost = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        opacity: ghost ? 0.05 : 0.10,
        borderRadius: 20,
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
        child: Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.4,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
