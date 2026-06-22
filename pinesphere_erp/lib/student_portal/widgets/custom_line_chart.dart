import 'package:flutter/material.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class CustomLineChart extends StatelessWidget {
  final List<double> values; // E.g. [75.0, 78.5, 81.0, 84.2, 87.0, 90.6]
  final List<String> xAxisLabels; // E.g. ['W1', 'W2', 'W3', 'W4', 'W5', 'W6']
  final double height;

  const CustomLineChart({
    super.key,
    required this.values,
    required this.xAxisLabels,
    this.height = 200,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: PortalTheme.cardSurface(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: PortalTheme.borderLight(context)),
      ),
      padding: EdgeInsets.fromLTRB(16, 20, 20, 16),
      height: height,
      width: double.infinity,
      child: CustomPaint(
        painter: _LineChartPainter(
          values: values,
          xAxisLabels: xAxisLabels,
          accentColor: PortalTheme.accentBlue(context),
          backgroundColor: PortalTheme.backgroundSlate(context),
          textColor: PortalTheme.textColor(context),
        ),
      ),
    );
  }
}

class _LineChartPainter extends CustomPainter {
  final List<double> values;
  final List<String> xAxisLabels;
  final Color accentColor;
  final Color backgroundColor;
  final Color textColor;

  _LineChartPainter({
    required this.values,
    required this.xAxisLabels,
    required this.accentColor,
    required this.backgroundColor,
    required this.textColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;

    final double paddingLeft = 30;
    final double paddingBottom = 25;
    final double chartWidth = size.width - paddingLeft;
    final double chartHeight = size.height - paddingBottom;

    // Draw horizontal grid lines and Y-axis labels
    final gridPaint = Paint()
      ..color = textColor.withValues(alpha: 0.08)
      ..strokeWidth = 1;

    final textStyle = TextStyle(
      color: textColor.withValues(alpha: 0.6),
      fontSize: 9,
      fontWeight: FontWeight.bold,
    );

    final int yDivisions = 4;
    for (int i = 0; i <= yDivisions; i++) {
      final double y = chartHeight * (1 - (i / yDivisions));
      canvas.drawLine(Offset(paddingLeft, y), Offset(size.width, y), gridPaint);

      // Y Label
      final int val = (100 * (i / yDivisions)).round();
      final textPainter = TextPainter(
        text: TextSpan(text: "$val", style: textStyle),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(canvas, Offset(paddingLeft - textPainter.width - 6, y - textPainter.height / 2));
    }

    // Calculate Coordinates
    final int dataCount = values.length;
    final double stepX = chartWidth / (dataCount - 1);
    final List<Offset> points = [];

    for (int i = 0; i < dataCount; i++) {
      final double x = paddingLeft + (i * stepX);
      final double ratio = values[i] / 100.0;
      final double y = chartHeight - (chartHeight * ratio);
      points.add(Offset(x, y));

      // Draw X Labels
      final textPainter = TextPainter(
        text: TextSpan(text: xAxisLabels[i], style: textStyle),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(
        canvas,
        Offset(x - textPainter.width / 2, chartHeight + 8),
      );
    }

    // Draw Gradient Area under the path
    if (points.length >= 2) {
      final fillPath = Path()
        ..moveTo(paddingLeft, chartHeight);
      
      for (var pt in points) {
        fillPath.lineTo(pt.dx, pt.dy);
      }
      fillPath.lineTo(points.last.dx, chartHeight);
      fillPath.close();

      final areaGradient = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          accentColor.withValues(alpha: 0.35),
          accentColor.withValues(alpha: 0.0),
        ],
      );

      final fillPaint = Paint()
        ..shader = areaGradient.createShader(Rect.fromLTRB(paddingLeft, 0, size.width, chartHeight))
        ..style = PaintingStyle.fill;

      canvas.drawPath(fillPath, fillPaint);
    }

    // Draw Line
    final linePaint = Paint()
      ..color = accentColor
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final path = Path()..moveTo(points.first.dx, points.first.dy);
    for (int i = 1; i < points.length; i++) {
      path.lineTo(points[i].dx, points[i].dy);
    }
    canvas.drawPath(path, linePaint);

    // Draw Dots and active hover indicator value
    final dotPaint = Paint()
      ..color = backgroundColor
      ..style = PaintingStyle.fill;

    final dotBorderPaint = Paint()
      ..color = accentColor
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    for (int i = 0; i < points.length; i++) {
      final pt = points[i];
      // Draw shadow circle
      canvas.drawCircle(pt, 5, Paint()..color = Colors.black38);
      canvas.drawCircle(pt, 4, dotPaint);
      canvas.drawCircle(pt, 4, dotBorderPaint);

      // Score Tooltip text on top of dot
      final scorePainter = TextPainter(
        text: TextSpan(
          text: "${values[i].toStringAsFixed(1)}%",
          style: TextStyle(
            color: textColor,
            fontSize: 8,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      scorePainter.paint(canvas, Offset(pt.dx - scorePainter.width / 2, pt.dy - 16));
    }
  }

  @override
  bool shouldRepaint(covariant _LineChartPainter oldDelegate) {
    return oldDelegate.values != values ||
        oldDelegate.xAxisLabels != xAxisLabels ||
        oldDelegate.accentColor != accentColor ||
        oldDelegate.backgroundColor != backgroundColor ||
        oldDelegate.textColor != textColor;
  }
}
