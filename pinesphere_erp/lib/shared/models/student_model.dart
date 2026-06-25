/// Mirrors StudentResponse from frontend student.types.ts
class StudentModel {
  final String studentId;
  final String? internId;
  final String studentStatus;
  final String? joinedAt;
  final String? completedAt;
  final String createdAt;

  const StudentModel({
    required this.studentId,
    this.internId,
    required this.studentStatus,
    this.joinedAt,
    this.completedAt,
    required this.createdAt,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      studentId: json['student_id'] as String? ?? json['id'] as String? ?? '',
      internId: json['intern_id'] as String?,
      studentStatus: json['student_status'] as String? ?? 'Active',
      joinedAt: json['joined_at'] as String?,
      completedAt: json['completed_at'] as String?,
      createdAt: json['created_at'] as String? ?? '',
    );
  }

  /// Derived display name — backend currently returns limited fields,
  /// so we construct a readable identifier from intern_id or student_id.
  String get displayName {
    if (internId != null && internId!.isNotEmpty) return internId!;
    if (studentId.length > 8) return studentId.substring(0, 8).toUpperCase();
    return studentId.toUpperCase();
  }

  Map<String, dynamic> toJson() => {
        'student_id': studentId,
        'intern_id': internId,
        'student_status': studentStatus,
        'joined_at': joinedAt,
        'completed_at': completedAt,
        'created_at': createdAt,
      };
}
