class KpiStats {
  final double technical;
  final double delivery;
  final double communication;
  final double attendance;
  final double collaboration;

  KpiStats({
    required this.technical,
    required this.delivery,
    required this.communication,
    required this.attendance,
    required this.collaboration,
  });

  double get averageScore =>
      (technical + delivery + communication + attendance + collaboration) / 5;

  KpiStats copyWith({
    double? technical,
    double? delivery,
    double? communication,
    double? attendance,
    double? collaboration,
  }) {
    return KpiStats(
      technical: technical ?? this.technical,
      delivery: delivery ?? this.delivery,
      communication: communication ?? this.communication,
      attendance: attendance ?? this.attendance,
      collaboration: collaboration ?? this.collaboration,
    );
  }
}

class MentorFeedbackLog {
  final String date;
  final String evaluator;
  final String comments;
  final double overallRating;

  MentorFeedbackLog({
    required this.date,
    required this.evaluator,
    required this.comments,
    required this.overallRating,
  });
}
