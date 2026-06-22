import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/providers/assessment_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class AssessmentScreen extends ConsumerWidget {
  const AssessmentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(assessmentProvider);
    final notifier = ref.read(assessmentProvider.notifier);

    // If proctored exam HUD is active, render it over the entire screen
    if (state.hudState.isActive) {
      return _buildExamHUD(context, state, notifier);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("Assessments & Exams"),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Next evaluation notice banner
            Container(
              decoration: BoxDecoration(
                color: PortalTheme.cardSurface(context),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: PortalTheme.borderLight(context)),
              ),
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.accentBlue(context).withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    padding: EdgeInsets.all(12),
                    child: Icon(
                      Icons.assignment_turned_in,
                      color: PortalTheme.accentBlue(context),
                      size: 24,
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "UPCOMING EVALUATION",
                          style: TextStyle(
                            color: PortalTheme.textMuted(context),
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "React Server Components Core Evaluation",
                          style: TextStyle(
                            color: PortalTheme.textColor(context),
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          "Duration: 20 mins | 4 technical questions",
                          style: TextStyle(
                            color: PortalTheme.textSecondary(context),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
            SizedBox(height: 28),

            Text(
              "Hardware Preflight Verification",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 6),
            Text(
              "All parameters must be green and verified before launching the secure exam module.",
              style: TextStyle(
                color: PortalTheme.textMuted(context),
                fontSize: 12,
              ),
            ),
            SizedBox(height: 16),

            // Checklist cards
            _buildChecklistTile(
              context: context,
              title: "Webcam Access Diagnostics",
              desc: "Simulates face tracking proctoring checks",
              verified: state.preflight.camera,
              onTap: () => notifier.togglePreflight('camera'),
            ),
            SizedBox(height: 10),
            _buildChecklistTile(
              context: context,
              title: "Microphone Audio Feeds",
              desc: "Detects acoustic volume spikes in local workspace",
              verified: state.preflight.mic,
              onTap: () => notifier.togglePreflight('mic'),
            ),
            SizedBox(height: 10),
            _buildChecklistTile(
              context: context,
              title: "Primary Screen Sharing API",
              desc: "Enforces dual screen prevention rules",
              verified: state.preflight.screen,
              onTap: () => notifier.togglePreflight('screen'),
            ),
            SizedBox(height: 10),
            _buildChecklistTile(
              context: context,
              title: "Secure ERP Socket Network Node",
              desc: "Ensures stable low latency connections",
              verified: state.preflight.network,
              onTap: () => notifier.togglePreflight('network'),
            ),
            SizedBox(height: 24),

            // Launch Button
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: (state.preflight.camera && state.preflight.mic && state.preflight.screen)
                        ? () => notifier.startExam()
                        : null,
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: PortalTheme.primaryBlue(context),
                      disabledBackgroundColor: PortalTheme.borderLight(context),
                    ),
                    child: Text("LAUNCH ASSESSMENT ENGINE"),
                  ),
                ),
              ],
            ),
            SizedBox(height: 32),

            Text(
              "Past Evaluations Log",
              style: TextStyle(
                color: PortalTheme.textColor(context),
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),

            // Past results list
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: state.pastResults.length,
              itemBuilder: (context, idx) {
                final res = state.pastResults[idx];
                return Padding(
                  padding: EdgeInsets.only(bottom: 10),
                  child: Container(
                    decoration: BoxDecoration(
                      color: PortalTheme.cardSurface(context),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: PortalTheme.borderLight(context)),
                    ),
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              res.title,
                              style: TextStyle(
                                color: PortalTheme.textColor(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              res.date,
                              style: TextStyle(
                                color: PortalTheme.textMuted(context),
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              "${res.score}%",
                              style: TextStyle(
                                color: res.score >= 50
                                    ? PortalTheme.successGreen(context)
                                    : PortalTheme.errorRed(context),
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              res.status,
                              style: TextStyle(
                                color: res.score >= 50
                                    ? PortalTheme.successGreen(context).withValues(alpha: 0.7)
                                    : PortalTheme.errorRed(context).withValues(alpha: 0.7),
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChecklistTile({
    required BuildContext context,
    required String title,
    required String desc,
    required bool verified,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        decoration: BoxDecoration(
          color: PortalTheme.cardSurface(context),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: verified
                ? PortalTheme.successGreen(context).withValues(alpha: 0.3)
                : PortalTheme.borderLight(context),
          ),
        ),
        padding: EdgeInsets.all(14),
        child: Row(
          children: [
            Icon(
              verified ? Icons.check_circle : Icons.radio_button_unchecked,
              color: verified ? PortalTheme.successGreen(context) : PortalTheme.textMuted(context),
              size: 20,
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    desc,
                    style: TextStyle(
                      color: PortalTheme.textMuted(context),
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              verified ? "VERIFIED" : "TAP TO ENABLE",
              style: TextStyle(
                color: verified ? PortalTheme.successGreen(context) : PortalTheme.accentBlue(context),
                fontWeight: FontWeight.bold,
                fontSize: 9,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExamHUD(BuildContext context, AssessmentState state, AssessmentNotifier notifier) {
    if (state.hudState.isCompleted) {
      return Scaffold(
        backgroundColor: PortalTheme.backgroundSlate(context),
        body: Center(
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: Container(
              decoration: BoxDecoration(
                color: PortalTheme.cardSurface(context),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: PortalTheme.borderLight(context)),
              ),
              padding: EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.emoji_events,
                    color: PortalTheme.warningAmber(context),
                    size: 60,
                  ),
                  SizedBox(height: 16),
                  Text(
                    "Assessment Complete",
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    "The proctored socket session is safely finalized.",
                    style: TextStyle(
                      color: PortalTheme.textSecondary(context),
                      fontSize: 12,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          Text(
                            "YOUR SCORE",
                            style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 6),
                          Text(
                            "${state.hudState.score}%",
                            style: TextStyle(color: PortalTheme.textColor(context), fontSize: 24, fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                      Column(
                        children: [
                          Text(
                            "STATUS",
                            style: TextStyle(color: PortalTheme.textMuted(context), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 6),
                          Text(
                            state.hudState.score >= 50 ? "PASSED" : "FAILED",
                            style: TextStyle(
                              color: state.hudState.score >= 50
                                  ? PortalTheme.successGreen(context)
                                  : PortalTheme.errorRed(context),
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 28),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => notifier.exitExamHUD(),
                          child: Text("RETURN TO ASSESSMENT PANEL"),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    final qIndex = state.hudState.currentQuestionIndex;
    final question = state.questions[qIndex];
    final selectedAnswer = state.hudState.answers[qIndex];

    final min = (state.hudState.secondsRemaining / 60).floor();
    final sec = state.hudState.secondsRemaining % 60;
    final timeFormatted = "${min.toString().padLeft(2, '0')}:${sec.toString().padLeft(2, '0')}";

    return PopScope(
      canPop: false, // Restrict user from escaping without submitting
      child: Scaffold(
        backgroundColor: PortalTheme.backgroundSlate(context),
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Proctoring HUD Header bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "PROCTORED EVALUATION HUD",
                          style: TextStyle(
                            color: PortalTheme.errorRed(context),
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Question ${qIndex + 1} of ${state.questions.length}",
                          style: TextStyle(
                            color: PortalTheme.textColor(context),
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      decoration: BoxDecoration(
                        color: PortalTheme.cardSurface(context),
                        border: Border.all(color: PortalTheme.divider(context)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: Row(
                        children: [
                          Icon(Icons.timer, color: PortalTheme.accentBlue(context), size: 16),
                          SizedBox(width: 6),
                          Text(
                            timeFormatted,
                            style: TextStyle(
                              color: PortalTheme.textColor(context),
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),

                // Proctored details status bar
                Container(
                  decoration: BoxDecoration(
                    color: PortalTheme.cardSurface(context),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: PortalTheme.borderLight(context)),
                  ),
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(radius: 4, backgroundColor: PortalTheme.successGreen(context)),
                          SizedBox(width: 8),
                          Text(
                            "Proctoring socket active",
                            style: TextStyle(color: PortalTheme.textSecondary(context), fontSize: 10),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Icon(Icons.warning_amber_rounded, color: PortalTheme.warningAmber(context), size: 14),
                          SizedBox(width: 6),
                          Text(
                            "Focus Warnings: ${state.hudState.warningCount}/3",
                            style: TextStyle(
                              color: state.hudState.warningCount >= 2
                                  ? PortalTheme.errorRed(context)
                                  : PortalTheme.warningAmber(context),
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 24),

                // Question Area
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          question.question,
                          style: TextStyle(
                            color: PortalTheme.textColor(context),
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            height: 1.5,
                          ),
                        ),
                        SizedBox(height: 24),

                        // Options List
                        ...question.options.map((opt) {
                          final isSelected = selectedAnswer == opt;

                          return Padding(
                            padding: EdgeInsets.only(bottom: 12),
                            child: InkWell(
                              onTap: () => notifier.answerQuestion(opt),
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? PortalTheme.primaryBlue(context).withValues(alpha: 0.15)
                                      : PortalTheme.cardSurface(context),
                                  border: Border.all(
                                    color: isSelected
                                        ? PortalTheme.accentBlue(context)
                                        : PortalTheme.borderLight(context),
                                    width: 1.5,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: EdgeInsets.all(16),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 18,
                                      height: 18,
                                      decoration: BoxDecoration(
                                        color: isSelected ? PortalTheme.accentBlue(context) : Colors.transparent,
                                        border: Border.all(
                                          color: isSelected ? PortalTheme.accentBlue(context) : PortalTheme.textMuted(context),
                                        ),
                                        shape: BoxShape.circle,
                                      ),
                                      alignment: Alignment.center,
                                      child: isSelected
                                          ? Icon(Icons.check, size: 12, color: Colors.white)
                                          : null,
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: Text(
                                        opt,
                                        style: TextStyle(
                                          color: isSelected ? Colors.white : PortalTheme.textSecondary(context),
                                          fontSize: 13,
                                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),

                // Proctor simulation triggers (for testing and verification)
                Container(
                  color: Colors.red.withValues(alpha: 0.05),
                  padding: EdgeInsets.all(8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      TextButton.icon(
                        onPressed: () {
                          notifier.recordWarning();
                          if (state.hudState.warningCount + 1 >= 3) {
                            notifier.submitExam(forceFail: true);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Exam terminated: focus limit exceeded!")),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  "Focus warning recorded! Limit: ${state.hudState.warningCount + 1}/3",
                                ),
                                backgroundColor: PortalTheme.warningAmber(context),
                              ),
                            );
                          }
                        },
                        icon: Icon(Icons.warning, color: PortalTheme.warningAmber(context), size: 14),
                        label: Text(
                          "Simulate Focus Loss",
                          style: TextStyle(color: PortalTheme.warningAmber(context), fontSize: 10),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 16),

                // Controls row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    OutlinedButton(
                      onPressed: qIndex > 0 ? () => notifier.prevQuestion() : null,
                      child: Text("PREVIOUS"),
                    ),
                    if (qIndex == state.questions.length - 1)
                      ElevatedButton(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text("Finish Exam?"),
                              content: Text("Are you sure you want to submit your answers and complete this evaluation?"),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text("CANCEL"),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    notifier.submitExam();
                                  },
                                  child: Text("SUBMIT"),
                                ),
                              ],
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: PortalTheme.successGreen(context)),
                        child: Text("FINISH & SUBMIT"),
                      )
                    else
                      ElevatedButton(
                        onPressed: () => notifier.nextQuestion(),
                        child: Text("NEXT QUESTION"),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
