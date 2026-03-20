import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'features/splash/splash_screen.dart';
import 'features/dashboard/dashboard_screen.dart';
import 'features/scan/scan_screen.dart';
import 'features/result/result_screen.dart';
import 'features/admin/admin_panel_screen.dart';
import 'features/logs/attendance_logs_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
    GoRoute(
      path: '/scan',
      builder: (context, state) => const ScanScreen(),
    ),
    GoRoute(
      path: '/result',
      builder: (context, state) => ResultScreen(
        fullName: state.extra != null ? (state.extra as Map)['fullName'] : '',
        regNumber: state.extra != null ? (state.extra as Map)['regNumber'] : '',
        course: state.extra != null ? (state.extra as Map)['course'] : '',
        status: state.extra != null ? (state.extra as Map)['status'] : '',
        sessionId: state.extra != null ? (state.extra as Map)['sessionId'] : '',
        timestamp: state.extra != null ? (state.extra as Map)['timestamp'] : DateTime.now(),
      ),
    ),
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminPanelScreen(),
    ),
    GoRoute(
      path: '/logs',
      builder: (context, state) => const AttendanceLogsScreen(),
    ),
  ],
);
