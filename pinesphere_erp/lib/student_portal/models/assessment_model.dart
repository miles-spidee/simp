class AssessmentPreflight {
  final bool camera;
  final bool mic;
  final bool screen;
  final bool network;

  AssessmentPreflight({
    this.camera = false,
    this.mic = false,
    this.screen = false,
    this.network = true,
  });

  AssessmentPreflight copyWith({
    bool? camera,
    bool? mic,
    bool? screen,
    bool? network,
  }) {
    return AssessmentPreflight(
      camera: camera ?? this.camera,
      mic: mic ?? this.mic,
      screen: screen ?? this.screen,
      network: network ?? this.network,
    );
  }
}

class ExamQuestion {
  final int id;
  final String question;
  final List<String> options;
  final String correctAnswer;

  ExamQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.correctAnswer,
  });
}

class PastExamResult {
  final String id;
  final String title;
  final String date;
  final int score;
  final String status;

  PastExamResult({
    required this.id,
    required this.title,
    required this.date,
    required this.score,
    required this.status,
  });
}

class ExamHUDState {
  final bool isActive;
  final int warningCount;
  final int currentQuestionIndex;
  final Map<int, String> answers;
  final int secondsRemaining;
  final bool isCompleted;
  final int score;

  ExamHUDState({
    required this.isActive,
    required this.warningCount,
    required this.currentQuestionIndex,
    required this.answers,
    required this.secondsRemaining,
    required this.isCompleted,
    required this.score,
  });

  ExamHUDState.initial()
      : isActive = false,
        warningCount = 0,
        currentQuestionIndex = 0,
        answers = {},
        secondsRemaining = 1200,
        isCompleted = false,
        score = 0;

  ExamHUDState copyWith({
    bool? isActive,
    int? warningCount,
    int? currentQuestionIndex,
    Map<int, String>? answers,
    int? secondsRemaining,
    bool? isCompleted,
    int? score,
  }) {
    return ExamHUDState(
      isActive: isActive ?? this.isActive,
      warningCount: warningCount ?? this.warningCount,
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      answers: answers ?? this.answers,
      secondsRemaining: secondsRemaining ?? this.secondsRemaining,
      isCompleted: isCompleted ?? this.isCompleted,
      score: score ?? this.score,
    );
  }
}
