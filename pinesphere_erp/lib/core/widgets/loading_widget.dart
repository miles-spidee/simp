import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

class LoadingWidget extends StatelessWidget {
  final double size;

  const LoadingWidget({
    super.key,
    this.size = 40,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        height: size,
        width: size,
        child: const CircularProgressIndicator(
          color: AppColors.primary,
          strokeWidth: 3,
        ),
      ),
    );
  }
}
