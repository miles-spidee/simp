import 'dart:math';
import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class ProgressCircle extends StatelessWidget {
  final double progress; // value between 0.0 and 1.0
  final String centerHeader;
  final String centerSub;
  final double size;
  final Color strokeColor;

  ProgressCircle({
    super.key,
    required this.progress,
    required this.centerHeader,
    required this.centerSub,
    this.size = 100,
    required this.strokeColor,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _CircularProgressPainter(
              progress: progress,
              strokeColor: strokeColor,
              brightness: Theme.of(context).brightness,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                centerHeader,
                style: TextStyle(
                  color: PortalTheme.textColor(context),
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                ),
              ),
              Text(
                centerSub.toUpperCase(),
                style: TextStyle(
                  color: PortalTheme.textSecondary(context),
                  fontWeight: FontWeight.bold,
                  fontSize: 8,
                  letterSpacing: 1,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _CircularProgressPainter extends CustomPainter {
  final double progress;
  final Color strokeColor;
  final Brightness brightness;

  _CircularProgressPainter({
    required this.progress,
    required this.strokeColor,
    required this.brightness,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width / 2, size.height / 2) - 4;
    final strokeWidth = size.width * 0.08;

    final backgroundPaint = Paint()
      ..color = brightness == Brightness.dark
          ? Colors.white.withOpacity(0.05)
          : Colors.black.withOpacity(0.05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    final progressPaint = Paint()
      ..color = strokeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, backgroundPaint);

    final startAngle = -pi / 2;
    final sweepAngle = 2 * pi * progress;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _CircularProgressPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.strokeColor != strokeColor ||
        oldDelegate.brightness != brightness;
  }
}
