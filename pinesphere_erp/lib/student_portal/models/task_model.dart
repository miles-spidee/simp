class TaskItem {
  final String id;
  final String title;
  final String category;
  final String assignedBy;
  final String dueDate;
  final bool isOverdue;
  final String? alert;
  final String status; // 'todo' | 'in-progress' | 'in-review' | 'completed'
  final String code;
  final bool isLocked;
  final String? submissionFile;

  TaskItem({
    required this.id,
    required this.title,
    required this.category,
    required this.assignedBy,
    required this.dueDate,
    required this.isOverdue,
    this.alert,
    required this.status,
    required this.code,
    required this.isLocked,
    this.submissionFile,
  });

  TaskItem copyWith({
    String? id,
    String? title,
    String? category,
    String? assignedBy,
    String? dueDate,
    bool? isOverdue,
    String? alert,
    String? status,
    String? code,
    bool? isLocked,
    String? submissionFile,
  }) {
    return TaskItem(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      assignedBy: assignedBy ?? this.assignedBy,
      dueDate: dueDate ?? this.dueDate,
      isOverdue: isOverdue ?? this.isOverdue,
      alert: alert ?? this.alert,
      status: status ?? this.status,
      code: code ?? this.code,
      isLocked: isLocked ?? this.isLocked,
      submissionFile: submissionFile ?? this.submissionFile,
    );
  }
}
