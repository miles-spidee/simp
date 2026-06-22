import 'package:flutter/material.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/theme/app_spacing.dart';
import 'package:pinesphere_erp/core/widgets/app_scaffold.dart';
import 'package:pinesphere_erp/features/placement/widgets/start_card.dart';
import 'package:pinesphere_erp/features/placement/widgets/funnel_bar.dart';
import 'package:pinesphere_erp/features/placement/widgets/recruiter_tile.dart';
import 'package:pinesphere_erp/features/placement/widgets/tracking_card.dart';
class PlacementScreen extends StatelessWidget {
  const PlacementScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'College Admin Portal',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            Text(
              'St. Xavier\'s Institute of Technology',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textTertiary,
                    fontSize: 11,
                  ),
            ),
          ],
        ),
        actions: [
          // Academic year badge
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.s8),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s12,
              vertical: AppSpacing.s4,
            ),
            decoration: BoxDecoration(
              color: AppColors.surfaceLight1,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.borderLight),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.calendar_today,
                    size: 12, color: AppColors.textTertiary),
                const SizedBox(width: 4),
                Text(
                  'AY 2025-26',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 11,
                      ),
                ),
              ],
            ),
          ),
          // Live indicator
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.s16),
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.s8,
              vertical: AppSpacing.s4,
            ),
            decoration: BoxDecoration(
              color: AppColors.success.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 7,
                  height: 7,
                  decoration: const BoxDecoration(
                    color: AppColors.success,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 4),
                Text(
                  'LIVE',
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: AppColors.successDark,
                        fontWeight: FontWeight.w700,
                        fontSize: 10,
                        letterSpacing: 0.5,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.s16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Admin profile card ──
            _buildAdminCard(context),
            const SizedBox(height: AppSpacing.s20),
            // ── Stats row ──
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  StatCard(
                    title: 'Total Students',
                    value: '320',
                    subtitle: 'ENROLLED',
                    icon: Icons.groups_outlined,
                    iconColor: AppColors.primary,
                  ),
                  const SizedBox(width: AppSpacing.s12),
                  StatCard(
                    title: 'Avg Performance',
                    value: '81%',
                    subtitle: 'THIS TERM',
                    icon: Icons.trending_up,
                    iconColor: AppColors.success,
                  ),
                  const SizedBox(width: AppSpacing.s12),
                  StatCard(
                    title: 'Placement Rate',
                    value: '51%',
                    subtitle: '9 PLACED',
                    icon: Icons.business_center_outlined,
                    iconColor: const Color(0xFFD97706),
                  ),
                  const SizedBox(width: AppSpacing.s12),
                  StatCard(
                    title: 'Avg Package',
                    value: '₹10.6 LPA',
                    subtitle: 'UP 12%',
                    icon: Icons.account_balance_wallet_outlined,
                    iconColor: AppColors.primary,
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.s20),
            // ── Placement Funnel ──
            FunnelBar(
              steps: const [
                FunnelStep(label: 'Eligible', count: 280),
                FunnelStep(label: 'Applied', count: 246, percentage: '88%'),
                FunnelStep(label: 'Interviewed', count: 198, percentage: '80%'),
                FunnelStep(label: 'Offered', count: 164, percentage: '83%'),
                FunnelStep(label: 'Placed', count: 142, percentage: '87%'),
              ],
            ),
            const SizedBox(height: AppSpacing.s20),
            // ── Top Recruiters ──
            _buildTopRecruiters(context),
            const SizedBox(height: AppSpacing.s20),
            // ── Placement Tracking ──
            _buildTrackingSection(context),
            const SizedBox(height: AppSpacing.s32),
          ],
        ),
      ),
    );
  }
  // ─── Admin profile card ─────────────────────────────────────────────
  Widget _buildAdminCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          // Avatar
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.primary, AppColors.primaryDark],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(
              child: Text(
                'DM',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.s12),
          // Name & role
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Dr. Meera Krishnan',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
                const SizedBox(height: 2),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.s8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'COLLEGE ADMIN',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 9,
                          letterSpacing: 0.8,
                        ),
                  ),
                ),
              ],
            ),
          ),
          // College icon
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight1,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.school_outlined,
              size: 18,
              color: AppColors.primary,
            ),
          ),
        ],
      ),
    );
  }
  // ─── Top Recruiters section ─────────────────────────────────────────
  Widget _buildTopRecruiters(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.s16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.emoji_events_outlined,
                  size: 18, color: AppColors.textTertiary),
              const SizedBox(width: AppSpacing.s8),
              Text(
                'TOP RECRUITERS',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textTertiary,
                      letterSpacing: 0.8,
                    ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.s8),
          const RecruiterTile(
            companyName: 'TCS',
            abbreviation: 'TC',
            hireCount: 31,
            avatarColor: Color(0xFF2563EB),
          ),
          const RecruiterTile(
            companyName: 'Zoho',
            abbreviation: 'ZO',
            hireCount: 18,
            avatarColor: Color(0xFFDC2626),
          ),
          const RecruiterTile(
            companyName: 'Freshworks',
            abbreviation: 'FR',
            hireCount: 14,
            avatarColor: Color(0xFF059669),
          ),
          const RecruiterTile(
            companyName: 'Amazon',
            abbreviation: 'AM',
            hireCount: 12,
            avatarColor: Color(0xFFD97706),
          ),
          const RecruiterTile(
            companyName: 'Microsoft',
            abbreviation: 'MI',
            hireCount: 9,
            avatarColor: Color(0xFF7C3AED),
          ),
          const RecruiterTile(
            companyName: 'Google',
            abbreviation: 'GO',
            hireCount: 6,
            avatarColor: Color(0xFF0891B2),
          ),
        ],
      ),
    );
  }
  // ─── Placement Tracking section ─────────────────────────────────────
  Widget _buildTrackingSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.track_changes,
                size: 18, color: AppColors.textTertiary),
            const SizedBox(width: AppSpacing.s8),
            Text(
              'PLACEMENT TRACKING',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textTertiary,
                    letterSpacing: 0.8,
                  ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.s12),
        // Student tracking cards
        const TrackingCard(
          studentName: 'Aranya Iyer',
          department: 'CSE',
          company: 'Google',
          role: 'SWE Intern',
          package: '₹18 LPA',
          status: PlacementStatus.placed,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Aarav Sharma',
          department: 'CSE',
          company: 'Microsoft',
          role: 'SDE',
          package: '₹14.5 LPA',
          status: PlacementStatus.placed,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Ishita Bose',
          department: 'CSE',
          company: 'Amazon',
          role: 'SDE-1',
          package: '₹12 LPA',
          status: PlacementStatus.offer,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Diya Patel',
          department: 'IT',
          company: 'Zoho',
          role: 'Member Tech Staff',
          package: '₹8 LPA',
          status: PlacementStatus.placed,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Priya Menon',
          department: 'CSE',
          company: 'Freshworks',
          role: 'Associate Engineer',
          package: '₹7.5 LPA',
          status: PlacementStatus.inProcess,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Rohan Mehta',
          department: 'CSE',
          company: 'Qualcomm',
          role: 'Hardware Intern',
          package: '₹9.5 LPA',
          status: PlacementStatus.offer,
        ),
        const SizedBox(height: AppSpacing.s12),
        const TrackingCard(
          studentName: 'Sneha Reddy',
          department: 'CSE',
          company: 'TCS',
          role: 'Systems Engineer',
          package: '₹4.5 LPA',
          status: PlacementStatus.inProcess,
        ),
      ],
    );
  }
}
