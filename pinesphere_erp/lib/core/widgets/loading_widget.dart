import 'package:flutter/material.dart';
import 'package:dotlottie_loader/dotlottie_loader.dart';
import 'package:lottie/lottie.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';

class LoadingWidget extends StatelessWidget {
  final double size;

  const LoadingWidget({
    super.key,
    this.size = 100,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        height: size,
        width: size,
        child: DotLottieLoader.fromNetwork(
          "https://lottie.host/af8f5f26-7303-4e8f-935d-43692169553a/wKEg1Qd03G.lottie",
          frameBuilder: (BuildContext ctx, DotLottie? dotLottie) {
            if (dotLottie != null) {
              return Lottie.memory(
                dotLottie.animations.values.single,
                fit: BoxFit.contain,
              );
            } else {
              return Center(
                child: SizedBox(
                  width: size * 0.4,
                  height: size * 0.4,
                  child: const CircularProgressIndicator(
                    color: AppColors.primary,
                    strokeWidth: 3,
                  ),
                ),
              );
            }
          },
          errorBuilder: (BuildContext ctx, dynamic error, StackTrace? stackTrace) {
            return Center(
              child: SizedBox(
                width: size * 0.4,
                height: size * 0.4,
                child: const CircularProgressIndicator(
                  color: AppColors.primary,
                  strokeWidth: 3,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
