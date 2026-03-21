import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_strings.dart';
import '../../core/router/app_router.dart';
import '../../core/widgets/glass_card.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    _navigate();
  }

  Future<void> _navigate() async {
    print('[DEBUG] SplashScreen: waiting 2.8s before navigating');
    await Future.delayed(const Duration(milliseconds: 2800));
    if (mounted) {
      print('[DEBUG] SplashScreen: navigating to dashboard');
      context.go(AppRoutes.dashboard);
    } else {
      print('[DEBUG] SplashScreen: not mounted, navigation skipped');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            // Ambient glow decoration
            Positioned(
              top: -80,
              left: -60,
              child: Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.accentBlue.withOpacity(0.08),
                ),
              ),
            ),
            Positioned(
              bottom: 100,
              right: -80,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.brandYellow.withOpacity(0.06),
                ),
              ),
            ),

            // Center content
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  GlassCard(
                    opacity: 0.12,
                    borderRadius: 28,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 40, vertical: 40),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // App icon
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: AppColors.accentBlue.withOpacity(0.20),
                            borderRadius: BorderRadius.circular(22),
                            border: Border.all(
                              color: AppColors.accentBlue.withOpacity(0.40),
                              width: 1.5,
                            ),
                          ),
                          child: const Icon(
                            Icons.qr_code_scanner_rounded,
                            color: AppColors.accentBlue,
                            size: 38,
                          ),
                        )
                            .animate()
                            .scale(
                              begin: const Offset(0.6, 0.6),
                              duration: const Duration(milliseconds: 600),
                              curve: Curves.easeOutBack,
                            )
                            .fadeIn(
                                duration: const Duration(milliseconds: 400)),

                        const SizedBox(height: 24),

                        // App name
                        Text(
                          AppStrings.appName,
                          style: const TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                            letterSpacing: -0.5,
                          ),
                        )
                            .animate(delay: const Duration(milliseconds: 300))
                            .fadeIn(duration: const Duration(milliseconds: 500))
                            .slideY(
                              begin: 0.3,
                              duration: const Duration(milliseconds: 500),
                              curve: Curves.easeOut,
                            ),

                        const SizedBox(height: 8),

                        // Subtitle
                        Text(
                          AppStrings.appTagline,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                            color: AppColors.textSecondary,
                            letterSpacing: 0.2,
                          ),
                        )
                            .animate(delay: const Duration(milliseconds: 450))
                            .fadeIn(
                                duration: const Duration(milliseconds: 500)),

                        const SizedBox(height: 32),

                        // Loading indicator
                        SizedBox(
                          width: 120,
                          child: LinearProgressIndicator(
                            backgroundColor: Colors.white.withOpacity(0.10),
                            color: AppColors.accentBlue,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        )
                            .animate(delay: const Duration(milliseconds: 600))
                            .fadeIn(
                                duration: const Duration(milliseconds: 400)),
                      ],
                    ),
                  )
                      .animate()
                      .fadeIn(duration: const Duration(milliseconds: 400))
                      .scale(
                        begin: const Offset(0.92, 0.92),
                        duration: const Duration(milliseconds: 600),
                        curve: Curves.easeOut,
                      ),
                ],
              ),
            ),

            // Version number
            Positioned(
              bottom: 24,
              left: 0,
              right: 0,
              child: Text(
                AppStrings.appVersion,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                  color: AppColors.textMuted,
                  letterSpacing: 0.2,
                ),
              )
                  .animate(delay: const Duration(milliseconds: 800))
                  .fadeIn(duration: const Duration(milliseconds: 400)),
            ),
          ],
        ),
      ),
    );
  }
}
