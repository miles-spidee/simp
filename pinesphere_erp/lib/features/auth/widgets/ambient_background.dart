import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

class AmbientBackground extends StatelessWidget {
  final Widget child;

  const AmbientBackground({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Base slate background
        Container(
          color: AppColors.slate50,
        ),

        // Glowing Orbs (using RadialGradients for native performance)
        Positioned(
          top: -120,
          left: -80,
          child: _GlowingOrb(
            color: const Color(0xFF3B82F6).withValues(alpha: 0.12), // Cyan/Blue glow
            size: 320,
          ),
        ),
        Positioned(
          bottom: 120,
          right: -100,
          child: _GlowingOrb(
            color: const Color(0xFF6366F1).withValues(alpha: 0.14), // Indigo/Violet glow
            size: 360,
          ),
        ),
        Positioned(
          top: 320,
          left: 60,
          child: _GlowingOrb(
            color: const Color(0xFF14B8A6).withValues(alpha: 0.08), // Teal glow
            size: 260,
          ),
        ),

        // Tech Grid Blueprint lines (faint)
        Positioned.fill(
          child: CustomPaint(
            painter: TechGridPainter(
              color: AppColors.primaryBlue.withValues(alpha: 0.035),
              gridSpacing: 26.0,
            ),
          ),
        ),

        // Content
        Positioned.fill(
          child: child,
        ),
      ],
    );
  }
}

class _GlowingOrb extends StatelessWidget {
  final Color color;
  final double size;

  const _GlowingOrb({
    required this.color,
    required this.size,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color,
            color.withValues(alpha: 0.4),
            color.withValues(alpha: 0.05),
            Colors.transparent,
          ],
          stops: const [0.0, 0.4, 0.8, 1.0],
        ),
      ),
    );
  }
}

class TechGridPainter extends CustomPainter {
  final Color color;
  final double gridSpacing;

  TechGridPainter({
    required this.color,
    this.gridSpacing = 30.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 0.55;

    // Draw vertical lines
    for (double x = 0; x < size.width; x += gridSpacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }

    // Draw horizontal lines
    for (double y = 0; y < size.height; y += gridSpacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant TechGridPainter oldDelegate) {
    return oldDelegate.color != color || oldDelegate.gridSpacing != gridSpacing;
  }
}
