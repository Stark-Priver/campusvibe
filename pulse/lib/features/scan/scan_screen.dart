import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:ui';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/router/app_router.dart';
import '../../core/widgets/glass_card.dart';
import 'providers/scan_provider.dart';

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ConsumerState<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends ConsumerState<ScanScreen>
    with TickerProviderStateMixin {
  late final MobileScannerController _scannerController;
  late final AnimationController _pulseController;
  late final Animation<double> _pulseAnimation;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _scannerController = MobileScannerController(
      detectionSpeed: DetectionSpeed.normal,
      facing: CameraFacing.back,
      torchEnabled: false,
    );

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scannerController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _onBarcodeDetected(BarcodeCapture capture) async {
    if (_isProcessing) return;
    final barcode = capture.barcodes.firstOrNull;
    if (barcode == null || barcode.rawValue == null) return;

    final session = ref.read(selectedSessionProvider);
    if (session == null) {
      _showNoSessionSnackbar();
      return;
    }

    setState(() => _isProcessing = true);
    await _scannerController.stop();

    final result = await ref.read(scanProvider.notifier).processScan(
          barcode: barcode.rawValue!,
          session: session,
        );

    if (mounted) {
      context.push(AppRoutes.result, extra: {
        'log': result?.log,
        'scannedId': barcode.rawValue ?? '',
      });

      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) {
        setState(() => _isProcessing = false);
        await _scannerController.start();
      }
    }
  }

  void _showNoSessionSnackbar() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(AppStrings.noSessionSelected),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Camera preview fills entire screen
          MobileScanner(
            controller: _scannerController,
            onDetect: _onBarcodeDetected,
          ),

          // Dark overlay with cutout effect
          _ScanOverlay(pulseAnimation: _pulseAnimation),

          // Top bar
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.40),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.20),
                          ),
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.arrow_back_ios_new_rounded,
                              size: 18, color: Colors.white),
                          onPressed: () => context.go(AppRoutes.dashboard),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    AppStrings.scanTitle,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const Spacer(),
                  // Torch toggle
                  _TorchButton(controller: _scannerController),
                ],
              ),
            ),
          ),

          // Bottom panel
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _BottomPanel(isProcessing: _isProcessing),
          ),

          // Processing overlay
          if (_isProcessing)
            const _ProcessingOverlay(),
        ],
      ),
    );
  }
}

class _ScanOverlay extends StatelessWidget {
  final Animation<double> pulseAnimation;
  const _ScanOverlay({required this.pulseAnimation});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    const frameSize = 260.0;

    return Stack(
      children: [
        // Top dark area
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          height: size.height / 2 - frameSize / 2,
          child: Container(color: Colors.black.withOpacity(0.60)),
        ),
        // Bottom dark area
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          height: size.height / 2 - frameSize / 2,
          child: Container(color: Colors.black.withOpacity(0.60)),
        ),
        // Left dark area
        Positioned(
          top: size.height / 2 - frameSize / 2,
          left: 0,
          width: size.width / 2 - frameSize / 2,
          height: frameSize,
          child: Container(color: Colors.black.withOpacity(0.60)),
        ),
        // Right dark area
        Positioned(
          top: size.height / 2 - frameSize / 2,
          right: 0,
          width: size.width / 2 - frameSize / 2,
          height: frameSize,
          child: Container(color: Colors.black.withOpacity(0.60)),
        ),
        // Scan frame with animated corners
        Center(
          child: AnimatedBuilder(
            animation: pulseAnimation,
            builder: (_, __) => Transform.scale(
              scale: pulseAnimation.value,
              child: const _ScanFrame(size: frameSize),
            ),
          ),
        ),
      ],
    );
  }
}

class _ScanFrame extends StatelessWidget {
  final double size;
  const _ScanFrame({required this.size});

  @override
  Widget build(BuildContext context) {
    const cornerLen = 28.0;
    const cornerThick = 3.5;
    const r = 4.0;
    const color = AppColors.brandYellow;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        children: [
          // Glow border
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(r),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.35),
                  blurRadius: 24,
                  spreadRadius: 4,
                ),
              ],
            ),
          ),
          // Corner: top-left
          Positioned(
            top: 0,
            left: 0,
            child: _Corner(
              color: color,
              len: cornerLen,
              thick: cornerThick,
              top: true,
              left: true,
            ),
          ),
          // Corner: top-right
          Positioned(
            top: 0,
            right: 0,
            child: _Corner(
              color: color,
              len: cornerLen,
              thick: cornerThick,
              top: true,
              left: false,
            ),
          ),
          // Corner: bottom-left
          Positioned(
            bottom: 0,
            left: 0,
            child: _Corner(
              color: color,
              len: cornerLen,
              thick: cornerThick,
              top: false,
              left: true,
            ),
          ),
          // Corner: bottom-right
          Positioned(
            bottom: 0,
            right: 0,
            child: _Corner(
              color: color,
              len: cornerLen,
              thick: cornerThick,
              top: false,
              left: false,
            ),
          ),
        ],
      ),
    );
  }
}

class _Corner extends StatelessWidget {
  final Color color;
  final double len;
  final double thick;
  final bool top;
  final bool left;

  const _Corner({
    required this.color,
    required this.len,
    required this.thick,
    required this.top,
    required this.left,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: len,
      height: len,
      child: CustomPaint(
        painter: _CornerPainter(
          color: color,
          thick: thick,
          top: top,
          left: left,
        ),
      ),
    );
  }
}

class _CornerPainter extends CustomPainter {
  final Color color;
  final double thick;
  final bool top;
  final bool left;

  _CornerPainter({
    required this.color,
    required this.thick,
    required this.top,
    required this.left,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = thick
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path();
    if (top && left) {
      path.moveTo(0, size.height);
      path.lineTo(0, 0);
      path.lineTo(size.width, 0);
    } else if (top && !left) {
      path.moveTo(0, 0);
      path.lineTo(size.width, 0);
      path.lineTo(size.width, size.height);
    } else if (!top && left) {
      path.moveTo(0, 0);
      path.lineTo(0, size.height);
      path.lineTo(size.width, size.height);
    } else {
      path.moveTo(0, size.height);
      path.lineTo(size.width, size.height);
      path.lineTo(size.width, 0);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _TorchButton extends StatefulWidget {
  final MobileScannerController controller;
  const _TorchButton({required this.controller});

  @override
  State<_TorchButton> createState() => _TorchButtonState();
}

class _TorchButtonState extends State<_TorchButton> {
  bool _on = false;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: GestureDetector(
          onTap: () {
            widget.controller.toggleTorch();
            setState(() => _on = !_on);
          },
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.40),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Colors.white.withOpacity(0.20),
              ),
            ),
            child: Icon(
              _on ? Icons.flashlight_on_rounded : Icons.flashlight_off_rounded,
              color: _on ? AppColors.brandYellow : Colors.white,
              size: 20,
            ),
          ),
        ),
      ),
    );
  }
}

class _BottomPanel extends ConsumerWidget {
  final bool isProcessing;
  const _BottomPanel({required this.isProcessing});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(selectedSessionProvider);
    final sessions = ref.watch(sessionsProvider);

    return ClipRRect(
      borderRadius: const BorderRadius.only(
        topLeft: Radius.circular(28),
        topRight: Radius.circular(28),
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          padding: EdgeInsets.fromLTRB(
            24,
            20,
            24,
            MediaQuery.of(context).padding.bottom + 20,
          ),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.55),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(28),
              topRight: Radius.circular(28),
            ),
            border: Border(
              top: BorderSide(
                color: Colors.white.withOpacity(0.15),
                width: 1,
              ),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Drag handle
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),

              // Instructions
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: isProcessing
                          ? AppColors.brandYellow
                          : AppColors.success,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: (isProcessing
                                  ? AppColors.brandYellow
                                  : AppColors.success)
                              .withOpacity(0.6),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    isProcessing
                        ? AppStrings.scanPaused
                        : AppStrings.scanningActive,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                AppStrings.scanInstructions,
                style: TextStyle(
                  fontSize: 13,
                  color: Colors.white.withOpacity(0.55),
                ),
              ),
              const SizedBox(height: 20),

              // Session selector
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.18),
                  ),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<SessionInfo>(
                    value: session,
                    isExpanded: true,
                    dropdownColor: const Color(0xFF0D2456),
                    icon: Icon(
                      Icons.keyboard_arrow_down_rounded,
                      color: Colors.white.withOpacity(0.60),
                    ),
                    hint: Text(
                      AppStrings.selectSession,
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.50),
                        fontSize: 14,
                      ),
                    ),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                    items: sessions
                        .map(
                          (s) => DropdownMenuItem(
                            value: s,
                            child: Text(s.name),
                          ),
                        )
                        .toList(),
                    onChanged: (s) {
                      if (s != null) {
                        ref
                            .read(selectedSessionProvider.notifier)
                            .select(s);
                      }
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(duration: const Duration(milliseconds: 400))
        .slideY(
          begin: 0.2,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeOut,
        );
  }
}

class _ProcessingOverlay extends StatelessWidget {
  const _ProcessingOverlay();

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.45),
        child: const Center(
          child: SizedBox(
            width: 44,
            height: 44,
            child: CircularProgressIndicator(
              color: AppColors.brandYellow,
              strokeWidth: 3,
            ),
          ),
        ),
      ),
    );
  }
}
