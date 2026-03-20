import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/widgets/glass_card.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/student_provider.dart';
import '../../core/providers/attendance_log_provider.dart';
import 'package:go_router/go_router.dart';

class ScanScreen extends StatelessWidget {
  const ScanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A1F44),
      body: Stack(
        children: [
          // Camera preview placeholder (replace with MobileScanner)
          Container(
            color: Colors.black,
            child: const Center(
              child: Icon(LucideIcons.camera, color: Colors.white24, size: 120),
            ),
          ),
          // Animated scanning frame
          Center(child: _AnimatedScanFrame()),
          // Glass overlay panel at bottom
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Consumer(
              builder: (context, ref, _) {
                // TODO: Replace with real session selection provider
                final session = 'Exam';
                return GlassCard(
                  opacity: 0.16,
                  borderRadius: 24,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 28,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Align the student ID barcode within the frame',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Text(
                            'Session:',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              color: Colors.white.withOpacity(0.60),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              session,
                              style: GoogleFonts.poppins(color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _AnimatedScanFrame extends StatefulWidget {
  @override
  State<_AnimatedScanFrame> createState() => _AnimatedScanFrameState();
}

class _AnimatedScanFrameState extends State<_AnimatedScanFrame>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _glowAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);
    _glowAnim = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _glowAnim,
      builder: (context, child) {
        return Container(
          width: 240,
          height: 240,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFFFC107), width: 4),
            boxShadow: [
              BoxShadow(
                color: const Color(
                  0xFFFFC107,
                ).withAlpha(((_glowAnim.value * 0.25) * 255).round()),
                blurRadius: 32,
                spreadRadius: 2,
              ),
            ],
          ),
          child: CustomPaint(
            painter: _CornerBracketPainter(),
            child: const SizedBox.expand(),
          ),
        );
      },
    );
  }
}

class _CornerBracketPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFFFC107)
      ..strokeWidth = 5
      ..style = PaintingStyle.stroke;
    const length = 32.0;
    // Top left
    canvas.drawLine(const Offset(0, 0), const Offset(length, 0), paint);
    canvas.drawLine(const Offset(0, 0), const Offset(0, length), paint);
    // Top right
    canvas.drawLine(
      Offset(size.width, 0),
      Offset(size.width - length, 0),
      paint,
    );
    canvas.drawLine(Offset(size.width, 0), Offset(size.width, length), paint);
    // Bottom left
    canvas.drawLine(Offset(0, size.height), Offset(length, size.height), paint);
    canvas.drawLine(
      Offset(0, size.height),
      Offset(0, size.height - length),
      paint,
    );
    // Bottom right
    canvas.drawLine(
      Offset(size.width, size.height),
      Offset(size.width - length, size.height),
      paint,
    );
    canvas.drawLine(
      Offset(size.width, size.height),
      Offset(size.width, size.height - length),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _SessionSelector extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GlassCard(
      opacity: 0.10,
      borderRadius: 16,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Row(
        children: [
          Icon(
            LucideIcons.chevronDown,
            color: Colors.white.withOpacity(0.60),
            size: 18,
          ),
          const SizedBox(width: 8),
          Text(
            'Exam Session',
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
