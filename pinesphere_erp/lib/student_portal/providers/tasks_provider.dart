import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/task_model.dart';

class TasksState {
  final List<TaskItem> tasks;
  final String activeFilter; // 'all' | 'pending' | 'review' | 'completed'

  TasksState({
    required this.tasks,
    required this.activeFilter,
  });

  TasksState copyWith({
    List<TaskItem>? tasks,
    String? activeFilter,
  }) {
    return TasksState(
      tasks: tasks ?? this.tasks,
      activeFilter: activeFilter ?? this.activeFilter,
    );
  }
}

class TasksNotifier extends StateNotifier<TasksState> {
  TasksNotifier()
      : super(
          TasksState(
            activeFilter: 'all',
            tasks: [
              TaskItem(
                id: 'PS-2026-W3',
                title: 'Week 3 Discipline Evaluation Task: Real-time Frame Selection Script',
                category: 'Week 3 Task',
                assignedBy: 'Mentor Sarah',
                dueDate: 'June 14, 2026 (2 Days Overdue)',
                isOverdue: true,
                alert: 'Alert: This overdue assignment has automatically notified your Reporting Manager. High-priority resolution required to avoid academic credit deduction.',
                status: 'pending',
                code: 'realtime-frame-selection',
                isLocked: false,
              ),
              TaskItem(
                id: 'Pr-2026-3Px',
                title: 'Optimization Report: Lightweight Model Compression Metrics',
                category: 'Optimization Report',
                assignedBy: 'Mentor Sarah',
                dueDate: 'June 19, 2026 (3 days remaining)',
                isOverdue: false,
                status: 'review',
                code: 'model-compression',
                isLocked: false,
              ),
              TaskItem(
                id: 'Pr-2026-4Ab',
                title: 'Neural Network Visualizer: Frontend Wireframes',
                category: 'Wireframes',
                assignedBy: 'Mentor Sarah',
                dueDate: 'June 25, 2026',
                isOverdue: false,
                status: 'pending',
                code: 'nn-visualizer',
                isLocked: true,
              ),
              TaskItem(
                id: 'PS-2026-W2',
                title: 'Week 2: Advanced React Design Patterns',
                category: 'Week 2 Task',
                assignedBy: 'Mentor Sarah',
                dueDate: 'June 07, 2026',
                isOverdue: false,
                status: 'completed',
                code: 'react-design-patterns',
                isLocked: false,
              ),
              TaskItem(
                id: 'PS-2026-W1',
                title: 'Week 1: Next.js Boilerplate Integration',
                category: 'Week 1 Task',
                assignedBy: 'Mentor Sarah',
                dueDate: 'May 31, 2026',
                isOverdue: false,
                status: 'review',
                code: 'nextjs-boilerplate',
                isLocked: false,
              ),
            ],
          ),
        );

  void setFilter(String filter) {
    state = state.copyWith(activeFilter: filter);
  }

  void updateTaskStatus(String taskId, String newStatus) {
    state = state.copyWith(
      tasks: state.tasks.map((t) {
        if (t.id == taskId) {
          return t.copyWith(status: newStatus);
        }
        return t;
      }).toList(),
    );
  }

  void selectFile(String taskId, String fileName) {
    state = state.copyWith(
      tasks: state.tasks.map((t) {
        if (t.id == taskId) {
          return t.copyWith(submissionFile: fileName);
        }
        return t;
      }).toList(),
    );
  }

  void removeFile(String taskId) {
    state = state.copyWith(
      tasks: state.tasks.map((t) {
        if (t.id == taskId) {
          return t.copyWith(submissionFile: null);
        }
        return t;
      }).toList(),
    );
  }

  void submitTask(String taskId) {
    state = state.copyWith(
      tasks: state.tasks.map((t) {
        if (t.id == taskId) {
          return t.copyWith(
            status: 'review',
            submissionFile: t.submissionFile ?? 'deliverables.zip',
          );
        }
        return t;
      }).toList(),
    );
  }
}

final tasksProvider = StateNotifierProvider<TasksNotifier, TasksState>((ref) {
  return TasksNotifier();
});
