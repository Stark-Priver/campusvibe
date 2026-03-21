import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';

enum ScanStatus { eligible, notEligible, notFound }

class StatusBadge extends StatelessWidget {
  final ScanStatus status;
  final bool large;

  const StatusBadge({
    super.key,
    required this.status,
    this.large = false,
  });

  Color get _backgroundColor {
    switch (status) {
      case ScanStatus.eligible:
        return AppColors.success;
      case ScanStatus.notEligible:
        return AppColors.danger;
      case ScanStatus.notFound:
        return AppColors.warning;
    }
  }

  IconData get _icon {
    switch (status) {
      case ScanStatus.eligible:
        return LucideIcons.checkCircle;
      case ScanStatus.notEligible:
        return LucideIcons.xCircle;
      case ScanStatus.notFound:
        return LucideIcons.alertTriangle;
    }
  }

  String get _label {
    switch (status) {
      case ScanStatus.eligible:
        return AppStrings.statusEligible;
      case ScanStatus.notEligible:
        return AppStrings.statusNotEligible;
      case ScanStatus.notFound:
        return AppStrings.statusNotFound;
    }
  }

  Color get _textColor {
    if (status == ScanStatus.notFound) return const Color(0xFF1A1A1A);
    return Colors.white;
  }

  @override
  Widget build(BuildContext context) {
    final iconSize = large ? 22.0 : 16.0;
    final fontSize = large ? 15.0 : 12.0;
    final hPad = large ? 22.0 : 12.0;
    final vPad = large ? 12.0 : 6.0;

    return Container(
      padding: EdgeInsets.symmetric(horizontal: hPad, vertical: vPad),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(large ? 16 : 100),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_icon, size: iconSize, color: _textColor),
          const SizedBox(width: 8),
          Text(
            _label,
            style: TextStyle(
              fontSize: fontSize,
              fontWeight: FontWeight.w700,
              color: _textColor,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

/// Small colored dot indicator for list tiles
class StatusDot extends StatelessWidget {
  final ScanStatus status;

  const StatusDot({super.key, required this.status});

  Color get _color {
    switch (status) {
      case ScanStatus.eligible:
        return AppColors.success;
      case ScanStatus.notEligible:
        return AppColors.danger;
      case ScanStatus.notFound:
        return AppColors.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: _color,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: _color.withOpacity(0.5),
            blurRadius: 6,
            spreadRadius: 1,
          ),
        ],
      ),
    );
  }
}

/// Sync status indicator dot
class SyncDot extends StatelessWidget {
  final bool isOnline;
  final bool isSyncing;

  const SyncDot({
    super.key,
    required this.isOnline,
    this.isSyncing = false,
  });

  @override
  Widget build(BuildContext context) {
    final color = isSyncing
        ? AppColors.brandYellow
        : isOnline
            ? AppColors.success
            : AppColors.danger;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(0.6),
                blurRadius: 5,
                spreadRadius: 1,
              ),
            ],
          ),
        ),
        const SizedBox(width: 6),
        Text(
          isSyncing
              ? 'Syncing...'
              : isOnline
                  ? AppStrings.connected
                  : AppStrings.offline,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
