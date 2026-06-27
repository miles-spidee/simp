import 'package:flutter/material.dart';

/// SlideUpFadeTransition — Animates children as they are built/added to the screen.
/// Provides a subtle fade and vertical translation slide up.
class SlideUpFadeTransition extends StatelessWidget {
  final Widget child;
  final Duration duration;
  final Duration delay;
  final double slideOffset;

  const SlideUpFadeTransition({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 400),
    this.delay = Duration.zero,
    this.slideOffset = 18.0,
  });

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: Future.delayed(delay),
      builder: (context, snapshot) {
        final show = snapshot.connectionState == ConnectionState.done || delay == Duration.zero;
        return TweenAnimationBuilder<double>(
          tween: Tween<double>(begin: show ? 0.0 : 1.0, end: show ? 1.0 : 0.0),
          duration: duration,
          curve: Curves.easeOutCubic,
          builder: (context, value, child) {
            return Opacity(
              opacity: value,
              child: Transform.translate(
                offset: Offset(0.0, slideOffset * (1.0 - value)),
                child: child,
              ),
            );
          },
          child: child,
        );
      },
    );
  }
}

/// CounterText — Animates numeric values by sliding/counting up.
class CounterText extends StatelessWidget {
  final int value;
  final TextStyle? style;
  final String prefix;
  final String suffix;
  final Duration duration;

  const CounterText({
    super.key,
    required this.value,
    this.style,
    this.prefix = '',
    this.suffix = '',
    this.duration = const Duration(milliseconds: 800),
  });

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: value.toDouble()),
      duration: duration,
      curve: Curves.easeOutCubic,
      builder: (context, val, child) {
        return Text(
          '$prefix${val.toInt()}$suffix',
          style: style,
        );
      },
    );
  }
}

/// BouncingPressable — Smooth micro-interaction scaling effect on press.
class BouncingPressable extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scaleFactor;

  const BouncingPressable({
    super.key,
    required this.child,
    this.onTap,
    this.scaleFactor = 0.95,
  });

  @override
  State<BouncingPressable> createState() => _BouncingPressableState();
}

class _BouncingPressableState extends State<BouncingPressable>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      lowerBound: 0.0,
      upperBound: 1.0 - widget.scaleFactor,
    );
    _scaleAnimation = _controller.drive(
      Tween<double>(begin: 1.0, end: widget.scaleFactor),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    if (widget.onTap != null) {
      _controller.forward();
    }
  }

  void _onTapUp(TapUpDetails details) {
    if (widget.onTap != null) {
      _controller.reverse();
      widget.onTap!();
    }
  }

  void _onTapCancel() {
    if (widget.onTap != null) {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      behavior: HitTestBehavior.opaque,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.child,
      ),
    );
  }
}
