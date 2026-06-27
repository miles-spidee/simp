import 'package:flutter/material.dart';
import 'package:dotlottie_loader/dotlottie_loader.dart';
import 'package:lottie/lottie.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/premium_components.dart';

class LoadingWidget extends StatelessWidget {
  final double size;

  const LoadingWidget({super.key, this.size = 100});

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
          errorBuilder:
              (BuildContext ctx, dynamic error, StackTrace? stackTrace) {
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

class LoadingSkeletonList extends StatelessWidget {
  final int itemCount;

  const LoadingSkeletonList({super.key, this.itemCount = 4});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(20),
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: itemCount,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        return const PremiumCard(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              SkeletonBox(height: 48, width: 48, radius: 16),
              SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SkeletonBox(height: 14, radius: 8),
                    SizedBox(height: 10),
                    SkeletonBox(height: 12, width: 160, radius: 8),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
