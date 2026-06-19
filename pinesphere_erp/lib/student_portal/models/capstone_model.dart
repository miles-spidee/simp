class CapstoneSubtask {
  final int id;
  final int phase;
  final String task;
  final bool completed;

  CapstoneSubtask({
    required this.id,
    required this.phase,
    required this.task,
    required this.completed,
  });

  CapstoneSubtask copyWith({
    int? id,
    int? phase,
    String? task,
    bool? completed,
  }) {
    return CapstoneSubtask(
      id: id ?? this.id,
      phase: phase ?? this.phase,
      task: task ?? this.task,
      completed: completed ?? this.completed,
    );
  }
}

class CapstoneCommit {
  final String commit;
  final String author;
  final String message;
  final String date;
  final String guideComment;

  CapstoneCommit({
    required this.commit,
    required this.author,
    required this.message,
    required this.date,
    required this.guideComment,
  });
}

class CapstoneState {
  final String repoLink;
  final String liveLink;
  final String status; // 'Not Submitted' | 'Under Review' | 'Approved'
  final List<CapstoneSubtask> subtasks;
  final List<CapstoneCommit> commits;
  final bool isDiagnosticsActive;
  final List<String> diagnosticsLogs;

  CapstoneState({
    required this.repoLink,
    required this.liveLink,
    required this.status,
    required this.subtasks,
    required this.commits,
    required this.isDiagnosticsActive,
    required this.diagnosticsLogs,
  });

  CapstoneState copyWith({
    String? repoLink,
    String? liveLink,
    String? status,
    List<CapstoneSubtask>? subtasks,
    List<CapstoneCommit>? commits,
    bool? isDiagnosticsActive,
    List<String>? diagnosticsLogs,
  }) {
    return CapstoneState(
      repoLink: repoLink ?? this.repoLink,
      liveLink: liveLink ?? this.liveLink,
      status: status ?? this.status,
      subtasks: subtasks ?? this.subtasks,
      commits: commits ?? this.commits,
      isDiagnosticsActive: isDiagnosticsActive ?? this.isDiagnosticsActive,
      diagnosticsLogs: diagnosticsLogs ?? this.diagnosticsLogs,
    );
  }
}
