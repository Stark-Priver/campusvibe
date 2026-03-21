import 'package:flutter/material.dart';

abstract final class AppColors {
  // Background
  static const Color background = Color(0xFF0A1F44);

  // Accent
  static const Color accentBlue = Color(0xFF1E90FF);
  static const Color brandYellow = Color(0xFFFFC107);
  static const Color softYellow = Color(0xFFFFD54F);

  // Glass surfaces
  static const Color glassSurfaceLow = Color(0x0DFFFFFF);
  static const Color glassSurfaceMid = Color(0x1AFFFFFF);
  static const Color glassSurfaceHigh = Color(0x29FFFFFF);
  static const Color glassBorder = Color(0x2EFFFFFF);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0x99FFFFFF);
  static const Color textMuted = Color(0x59FFFFFF);

  // Status
  static const Color success = Color(0xFF00C851);
  static const Color danger = Color(0xFFFF3547);
  static const Color warning = Color(0xFFFFC107);

  // Helpers
  static Color glassOf(double opacity) =>
      Colors.white.withOpacity(opacity);

  static Color borderOf(double opacity) =>
      Colors.white.withOpacity(opacity);
}
