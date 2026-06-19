import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/kpi_model.dart';

class KpiState {
  final KpiStats stats;
  final List<MentorFeedbackLog> feedbackLogs;
  final double consistencyIndex;
  final double growthVelocity;
  final List<double> weeklyTrend; // 6 values for progression chart
  final List<String> strengths;
  final List<String> growthAreas;

  KpiState({
    required this.stats,
    required this.feedbackLogs,
    required this.consistencyIndex,
    required this.growthVelocity,
    required this.weeklyTrend,
    required this.strengths,
    required this.growthAreas,
  });

  KpiState copyWith({
    KpiStats? stats,
    List<MentorFeedbackLog>? feedbackLogs,
    double? consistencyIndex,
    double? growthVelocity,
    List<double>? weeklyTrend,
    List<String>? strengths,
    List<String>? growthAreas,
  }) {
    return KpiState(
      stats: stats ?? this.stats,
      feedbackLogs: feedbackLogs ?? this.feedbackLogs,
      consistencyIndex: consistencyIndex ?? this.consistencyIndex,
      growthVelocity: growthVelocity ?? this.growthVelocity,
      weeklyTrend: weeklyTrend ?? this.weeklyTrend,
      strengths: strengths ?? this.strengths,
      growthAreas: growthAreas ?? this.growthAreas,
    );
  }
}

class KpiNotifier extends StateNotifier<KpiState> {
  KpiNotifier()
      : super(
          KpiState(
            stats: KpiStats(
              technical: 88,
              delivery: 92,
              communication: 85,
              attendance: 98,
              collaboration: 90,
            ),
            consistencyIndex: 94.2,
            growthVelocity: 12.5,
            weeklyTrend: [75.0, 78.5, 81.0, 84.2, 87.0, 90.6],
            strengths: [
              "Highly proactive commit schedule and robust version control updates.",
              "Excellent problem resolution during proctored exams.",
              "Consistent workstation attendance logs with automatic synchronization.",
            ],
            growthAreas: [
              "Provide earlier responses to reporting managers on slack evaluations.",
              "Enhance backend route validations for Capstone API parameters.",
            ],
            feedbackLogs: [
              MentorFeedbackLog(
                date: "June 15, 2026",
                evaluator: "Mr. Anand Jayavel (Core Architect)",
                comments: "Harini shows a very neat grasp of React Server Components and server rendering hydration limits. Capstone staging checkups passed with no major lint errors.",
                overallRating: 9.0,
              ),
              MentorFeedbackLog(
                date: "June 08, 2026",
                evaluator: "Mentor Sarah (Discipline Lead)",
                comments: "Week 2 React design patterns were complete. Staging layout fits the branding requirements perfectly.",
                overallRating: 8.5,
              ),
            ],
          ),
        );
}

final kpiProvider = StateNotifierProvider<KpiNotifier, KpiState>((ref) {
  return KpiNotifier();
});
