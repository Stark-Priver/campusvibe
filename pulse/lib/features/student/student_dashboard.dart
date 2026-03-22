import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/glass_card.dart';
import '../../core/widgets/glass_button.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/providers/location_service.dart';
import '../../core/database/isar_service.dart';
import '../../core/database/models/session_model.dart';
import '../../core/database/models/attendance_log.dart';
import '../scan/providers/scan_provider.dart';

class StudentDashboard extends ConsumerStatefulWidget {
  const StudentDashboard({super.key});

  @override
  ConsumerState<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends ConsumerState<StudentDashboard> {
  bool _isCheckingIn = false;
  String? _statusMessage;

  Future<void> _checkIn(SessionModel session) async {
    setState(() {
      _isCheckingIn = true;
      _statusMessage = 'Checking your location...';
    });

    try {
      final locService = ref.read(locationServiceProvider);
      final position = await locService.getCurrentPosition();

      if (position == null) {
        setState(() {
          _isCheckingIn = false;
          _statusMessage = 'Location access denied.';
        });
        return;
      }

      if (session.latitude != null && session.longitude != null && session.radius != null) {
        final isInside = locService.isWithinGeofence(
          position.latitude,
          position.longitude,
          session.latitude!,
          session.longitude!,
          session.radius!,
        );

        if (!isInside) {
          setState(() {
            _isCheckingIn = false;
            _statusMessage = 'Not within range of this session.';
          });
          return;
        }
      }

      final user = ref.read(authProvider).user!;

      final log = AttendanceLog.create(
        studentId: user.email.split('@')[0], // Mock student ID from email
        studentName: user.fullName,
        sessionId: session.remoteId ?? session.id.toString(),
        sessionName: session.name,
        sessionType: session.type,
        isEligible: true, // Assuming student is eligible if they can log in
        localId: const Uuid().v4(),
        isStudentCheckIn: true,
      );

      await IsarService.saveAttendanceLog(log);

      setState(() {
        _isCheckingIn = false;
        _statusMessage = 'Check-in successful!';
      });

      // Clear message after 3 seconds
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _statusMessage = null);
      });

    } catch (e) {
      setState(() {
        _isCheckingIn = false;
        _statusMessage = 'Check-in failed: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final activeSessions = defaultSessions.where((s) => s.type == 'class').toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Student Hub',
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        'Welcome, ${user?.fullName ?? "Student"}',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.logout_rounded, color: AppColors.textSecondary),
                    onPressed: () => ref.read(authProvider.notifier).logout(),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              if (_statusMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: _statusMessage!.contains('successful')
                        ? AppColors.success.withOpacity(0.1)
                        : AppColors.danger.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: _statusMessage!.contains('successful')
                        ? AppColors.success.withOpacity(0.3)
                        : AppColors.danger.withOpacity(0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _statusMessage!.contains('successful')
                          ? Icons.check_circle_outline
                          : Icons.error_outline,
                        color: _statusMessage!.contains('successful')
                          ? AppColors.success
                          : AppColors.danger,
                        size: 20,
                      ),
                      const SizedBox(width: 10),
                      Text(
                        _statusMessage!,
                        style: TextStyle(
                          color: _statusMessage!.contains('successful')
                            ? AppColors.success
                            : AppColors.danger,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),

              const Text(
                'Active Class Sessions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),

              Expanded(
                child: ListView.builder(
                  itemCount: activeSessions.length,
                  itemBuilder: (context, index) {
                    final session = activeSessions[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: GlassCard(
                        opacity: 0.1,
                        borderRadius: 16,
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Text(
                            session.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          subtitle: const Text(
                            'Within 50m of Lecture Hall',
                            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                          ),
                          trailing: _isCheckingIn
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(strokeWidth: 2),
                              )
                            : ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppColors.accentBlue,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                onPressed: () => _checkIn(session),
                                child: const Text('Check-in'),
                              ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
