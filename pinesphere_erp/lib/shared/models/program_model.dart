/// Mirrors ProgramResponse from frontend program.types.ts
class ProgramModel {
  final String programId;
  final String name;
  final String? description;
  final String? internshipTypeId;
  final String? status;
  final String? createdAt;

  const ProgramModel({
    required this.programId,
    required this.name,
    this.description,
    this.internshipTypeId,
    this.status,
    this.createdAt,
  });

  factory ProgramModel.fromJson(Map<String, dynamic> json) {
    return ProgramModel(
      programId: json['program_id'] as String? ??
          json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
      internshipTypeId: json['internship_type_id'] as String?,
      status: json['status'] as String?,
      createdAt: json['created_at'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'program_id': programId,
        'name': name,
        'description': description,
        'internship_type_id': internshipTypeId,
        'status': status,
        'created_at': createdAt,
      };
}

/// Mirrors InternshipTypeResponse from frontend program.types.ts
class InternshipTypeModel {
  final String typeId;
  final String name;
  final String? description;

  const InternshipTypeModel({
    required this.typeId,
    required this.name,
    this.description,
  });

  factory InternshipTypeModel.fromJson(Map<String, dynamic> json) {
    return InternshipTypeModel(
      typeId: json['internship_type_id'] as String? ?? json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String?,
    );
  }
}
