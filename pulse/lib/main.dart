import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/app_theme.dart';
import 'features/splash/splash_screen.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/scan/scan_screen.dart';
import 'features/result/result_screen.dart';
import 'features/admin/admin_panel_screen.dart';
import 'features/logs/attendance_logs_screen.dart';

void main() {
  runApp(const PulseApp());
}

class PulseApp extends StatelessWidget {
  const PulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pulse',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      home: const SplashScreen(),
      // TODO: Replace with GoRouter for navigation
    );
  }
}
