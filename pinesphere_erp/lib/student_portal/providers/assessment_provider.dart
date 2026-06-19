import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/assessment_model.dart';
import 'package:pinesphere_erp/student_portal/services/mock_assessment_service.dart';

class AssessmentState {
  final AssessmentPreflight preflight;
  final ExamHUDState hudState;
  final List<PastExamResult> pastResults;
  final List<ExamQuestion> questions;

  AssessmentState({
    required this.preflight,
    required this.hudState,
    required this.pastResults,
    required this.questions,
  });

  AssessmentState copyWith({
    AssessmentPreflight? preflight,
    ExamHUDState? hudState,
    List<PastExamResult>? pastResults,
    List<ExamQuestion>? questions,
  }) {
    return AssessmentState(
      preflight: preflight ?? this.preflight,
      hudState: hudState ?? this.hudState,
      pastResults: pastResults ?? this.pastResults,
      questions: questions ?? this.questions,
    );
  }
}

class AssessmentNotifier extends StateNotifier<AssessmentState> {
  Timer? _examTimer;

  AssessmentNotifier()
      : super(
          AssessmentState(
            preflight: AssessmentPreflight(),
            hudState: ExamHUDState.initial(),
            pastResults: [
              PastExamResult(id: 'ex1', title: 'Next.js Routing & Data Flow', date: 'June 10, 2026', score: 88, status: 'Passed'),
              PastExamResult(id: 'ex2', title: 'Node.js Libuv Event Loop Mechanics', date: 'May 28, 2026', score: 92, status: 'Passed'),
              PastExamResult(id: 'ex3', title: 'Relational Database Schema Design', date: 'May 15, 2026', score: 80, status: 'Passed'),
            ],
            questions: MockAssessmentService.getQuestions(),
          ),
        );

  void togglePreflight(String hardware) {
    if (hardware == 'camera') {
      state = state.copyWith(preflight: state.preflight.copyWith(camera: !state.preflight.camera));
    } else if (hardware == 'mic') {
      state = state.copyWith(preflight: state.preflight.copyWith(mic: !state.preflight.mic));
    } else if (hardware == 'screen') {
      state = state.copyWith(preflight: state.preflight.copyWith(screen: !state.preflight.screen));
    } else if (hardware == 'network') {
      state = state.copyWith(preflight: state.preflight.copyWith(network: !state.preflight.network));
    }
  }

  void startExam() {
    if (!state.preflight.camera || !state.preflight.mic || !state.preflight.screen) {
      return;
    }
    state = state.copyWith(
      hudState: ExamHUDState(
        isActive: true,
        warningCount: 0,
        currentQuestionIndex: 0,
        answers: {},
        secondsRemaining: 1200,
        isCompleted: false,
        score: 0,
      ),
    );
    _examTimer?.cancel();
    _examTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (state.hudState.secondsRemaining <= 1) {
        submitExam();
      } else {
        state = state.copyWith(
          hudState: state.hudState.copyWith(
            secondsRemaining: state.hudState.secondsRemaining - 1,
          ),
        );
      }
    });
  }

  void answerQuestion(String answer) {
    final updatedAnswers = Map<int, String>.from(state.hudState.answers);
    updatedAnswers[state.hudState.currentQuestionIndex] = answer;
    state = state.copyWith(
      hudState: state.hudState.copyWith(answers: updatedAnswers),
    );
  }

  void nextQuestion() {
    if (state.hudState.currentQuestionIndex < state.questions.length - 1) {
      state = state.copyWith(
        hudState: state.hudState.copyWith(
          currentQuestionIndex: state.hudState.currentQuestionIndex + 1,
        ),
      );
    }
  }

  void prevQuestion() {
    if (state.hudState.currentQuestionIndex > 0) {
      state = state.copyWith(
        hudState: state.hudState.copyWith(
          currentQuestionIndex: state.hudState.currentQuestionIndex - 1,
        ),
      );
    }
  }

  void recordWarning() {
    state = state.copyWith(
      hudState: state.hudState.copyWith(
        warningCount: state.hudState.warningCount + 1,
      ),
    );
  }

  void submitExam({bool forceFail = false}) {
    _examTimer?.cancel();
    int score = 0;
    if (!forceFail) {
      state.questions.asMap().forEach((idx, q) {
        if (state.hudState.answers[idx] == q.correctAnswer) {
          score += 25; // 4 questions * 25 = 100
        }
      });
    }

    state = state.copyWith(
      hudState: state.hudState.copyWith(
        isCompleted: true,
        score: score,
      ),
    );
  }

  void exitExamHUD() {
    _examTimer?.cancel();
    // Save to past exam list if completed
    if (state.hudState.isCompleted) {
      final newResult = PastExamResult(
        id: "ex-${DateTime.now().millisecondsSinceEpoch.toString().substring(10)}",
        title: "Assessment Evaluator",
        date: "June 18, 2026",
        score: state.hudState.score,
        status: state.hudState.score >= 50 ? "Passed" : "Failed",
      );
      state = state.copyWith(
        pastResults: [newResult, ...state.pastResults],
      );
    }
    state = state.copyWith(
      hudState: ExamHUDState.initial(),
      preflight: AssessmentPreflight(camera: false, mic: false, screen: false, network: true),
    );
  }

  @override
  void dispose() {
    _examTimer?.cancel();
    super.dispose();
  }
}

final assessmentProvider = StateNotifierProvider<AssessmentNotifier, AssessmentState>((ref) {
  return AssessmentNotifier();
});
