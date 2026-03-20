import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      scaffoldBackgroundColor: const Color(0xFF0A1F44),
      textTheme: GoogleFonts.poppinsTextTheme().apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF1E90FF),
        secondary: Color(0xFFFFC107),
        surface: Color(0xFF0A1F44),
      ),
      useMaterial3: true,
    );
  }
}
