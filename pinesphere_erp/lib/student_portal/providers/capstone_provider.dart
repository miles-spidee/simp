import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/capstone_model.dart';
import 'package:pinesphere_erp/student_portal/services/mock_diagnostics_service.dart';

class CapstoneNotifier extends StateNotifier<CapstoneState> {
  CapstoneNotifier()
      : super(
          CapstoneState(
            repoLink: 'https://github.com/harini/pinesphere-intern-portal-capstone',
            liveLink: '',
            status: 'Under Review',
            isDiagnosticsActive: false,
            diagnosticsLogs: [],
            subtasks: [
              CapstoneSubtask(id: 1, phase: 3, task: 'Configure routing structures & context API', completed: true),
              CapstoneSubtask(id: 2, phase: 3, task: 'Complete dashboard overview layout designs', completed: true),
              CapstoneSubtask(id: 3, phase: 3, task: 'Complete proctored assessment HUD pages', completed: true),
              CapstoneSubtask(id: 4, phase: 3, task: 'Sync styling with high-contrast white & blue theme', completed: true),
              CapstoneSubtask(id: 5, phase: 4, task: 'Design mock relational database tables schema', completed: false),
              CapstoneSubtask(id: 6, phase: 4, task: 'Create REST API routes for attendance log synchronization', completed: false),
              CapstoneSubtask(id: 7, phase: 4, task: 'Implement client JWT auth context interceptors', completed: false),
            ],
            commits: [
              CapstoneCommit(
                commit: 'c82f1a9',
                author: 'Harini',
                message: 'feat: add proctored exam overlay and window focus listener',
                date: 'June 15, 2026',
                guideComment: 'Mr. Anand Jayavel: Excellent implementation of browser blur detection. Please verify that focus warn limits reset properly on new launch.',
              ),
              CapstoneCommit(
                commit: 'a4b10fd',
                author: 'Harini',
                message: 'style: match dashboard typography with landing page header design',
                date: 'June 14, 2026',
                guideComment: 'Mr. Anand Jayavel: Logo layout looks neat and correctly sized. Theme coordinates match the main brand now.',
              ),
              CapstoneCommit(
                commit: 'f00e998',
                author: 'Harini',
                message: 'setup: initial nextjs template with sidebar layout navigation',
                date: 'June 11, 2026',
                guideComment: '',
              ),
            ],
          ),
        );

  void updateLinks(String repoLink, String liveLink) {
    state = state.copyWith(
      repoLink: repoLink,
      liveLink: liveLink,
      status: 'Under Review',
    );
  }

  void toggleSubtask(int id) {
    state = state.copyWith(
      subtasks: state.subtasks.map((t) {
        if (t.id == id) {
          return t.copyWith(completed: !t.completed);
        }
        return t;
      }).toList(),
    );
  }

  Future<void> runDiagnostics() async {
    if (state.isDiagnosticsActive) return;

    state = state.copyWith(
      isDiagnosticsActive: true,
      diagnosticsLogs: [],
    );

    await for (final log in MockDiagnosticsService.runDiagnostics()) {
      state = state.copyWith(
        diagnosticsLogs: [...state.diagnosticsLogs, log],
      );
    }

    state = state.copyWith(isDiagnosticsActive: false);
  }
}

final capstoneProvider = StateNotifierProvider<CapstoneNotifier, CapstoneState>((ref) {
  return CapstoneNotifier();
});
