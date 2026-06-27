class MentorProfile {
  final String mentorProfileId;
  final String employeeId;
  final String employeeName;
  final String mentorBio;
  final List<String> mentorExpertise;
  final int yearsOfExperience;
  final int maxStudentCapacity;
  final int currentStudentCount;
  final bool isAvailable;
  final String createdAt;
  final String updatedAt;

  MentorProfile({
    required this.mentorProfileId,
    required this.employeeId,
    required this.employeeName,
    required this.mentorBio,
    required this.mentorExpertise,
    required this.yearsOfExperience,
    required this.maxStudentCapacity,
    required this.currentStudentCount,
    required this.isAvailable,
    required this.createdAt,
    required this.updatedAt,
  });

  factory MentorProfile.fromJson(Map<String, dynamic> json) {
    return MentorProfile(
      mentorProfileId: json['mentor_profile_id'] as String,
      employeeId: json['employee_id'] as String,
      employeeName: json['employeeName'] as String,
      mentorBio: json['mentor_bio'] as String,
      mentorExpertise: (json['mentor_expertise'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      yearsOfExperience: json['years_of_experience'] as int,
      maxStudentCapacity: json['max_student_capacity'] as int,
      currentStudentCount: json['current_student_count'] as int,
      isAvailable: json['is_available'] as bool,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mentor_profile_id': mentorProfileId,
      'employee_id': employeeId,
      'employeeName': employeeName,
      'mentor_bio': mentorBio,
      'mentor_expertise': mentorExpertise,
      'years_of_experience': yearsOfExperience,
      'max_student_capacity': maxStudentCapacity,
      'current_student_count': currentStudentCount,
      'is_available': isAvailable,
      'created_at': createdAt,
      'updated_at': updatedAt,
    };
  }

  MentorProfile copyWith({
    String? mentorProfileId,
    String? employeeId,
    String? employeeName,
    String? mentorBio,
    List<String>? mentorExpertise,
    int? yearsOfExperience,
    int? maxStudentCapacity,
    int? currentStudentCount,
    bool? isAvailable,
    String? createdAt,
    String? updatedAt,
  }) {
    return MentorProfile(
      mentorProfileId: mentorProfileId ?? this.mentorProfileId,
      employeeId: employeeId ?? this.employeeId,
      employeeName: employeeName ?? this.employeeName,
      mentorBio: mentorBio ?? this.mentorBio,
      mentorExpertise: mentorExpertise ?? this.mentorExpertise,
      yearsOfExperience: yearsOfExperience ?? this.yearsOfExperience,
      maxStudentCapacity: maxStudentCapacity ?? this.maxStudentCapacity,
      currentStudentCount: currentStudentCount ?? this.currentStudentCount,
      isAvailable: isAvailable ?? this.isAvailable,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class MentorAssignment {
  final String id;
  final String mentorProfileId;
  final String mentorName;
  final String employeeId;
  final String studentId;
  final String studentName;
  final String internId;
  final String batchId;
  final String batchName;
  final String assignedDate;
  final String status; // 'Active' | 'Completed' | 'Transferred'
  final String assignedBy;

  MentorAssignment({
    required this.id,
    required this.mentorProfileId,
    required this.mentorName,
    required this.employeeId,
    required this.studentId,
    required this.studentName,
    required this.internId,
    required this.batchId,
    required this.batchName,
    required this.assignedDate,
    required this.status,
    required this.assignedBy,
  });

  factory MentorAssignment.fromJson(Map<String, dynamic> json) {
    return MentorAssignment(
      id: json['id'] as String,
      mentorProfileId: json['mentorProfileId'] as String,
      mentorName: json['mentorName'] as String,
      employeeId: json['employeeId'] as String,
      studentId: json['studentId'] as String,
      studentName: json['studentName'] as String,
      internId: json['internId'] as String,
      batchId: json['batchId'] as String,
      batchName: json['batchName'] as String,
      assignedDate: json['assignedDate'] as String,
      status: json['status'] as String,
      assignedBy: json['assignedBy'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'mentorProfileId': mentorProfileId,
      'mentorName': mentorName,
      'employeeId': employeeId,
      'studentId': studentId,
      'studentName': studentName,
      'internId': internId,
      'batchId': batchId,
      'batchName': batchName,
      'assignedDate': assignedDate,
      'status': status,
      'assignedBy': assignedBy,
    };
  }
}

class MentorBatchMapping {
  final String id;
  final String mentorProfileId;
  final String mentorName;
  final String employeeId;
  final String batchId;
  final String batchName;
  final String batchCode;
  final String programName;
  final int studentCount;
  final int batchCapacity;
  final String mappedDate;
  final String status; // 'Active' | 'Completed' | 'Upcoming'
  final String mappedBy;

  MentorBatchMapping({
    required this.id,
    required this.mentorProfileId,
    required this.mentorName,
    required this.employeeId,
    required this.batchId,
    required this.batchName,
    required this.batchCode,
    required this.programName,
    required this.studentCount,
    required this.batchCapacity,
    required this.mappedDate,
    required this.status,
    required this.mappedBy,
  });

  factory MentorBatchMapping.fromJson(Map<String, dynamic> json) {
    return MentorBatchMapping(
      id: json['id'] as String,
      mentorProfileId: json['mentorProfileId'] as String,
      mentorName: json['mentorName'] as String,
      employeeId: json['employeeId'] as String,
      batchId: json['batchId'] as String,
      batchName: json['batchName'] as String,
      batchCode: json['batchCode'] as String,
      programName: json['programName'] as String,
      studentCount: json['studentCount'] as int,
      batchCapacity: json['batchCapacity'] as int,
      mappedDate: json['mappedDate'] as String,
      status: json['status'] as String,
      mappedBy: json['mappedBy'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'mentorProfileId': mentorProfileId,
      'mentorName': mentorName,
      'employeeId': employeeId,
      'batchId': batchId,
      'batchName': batchName,
      'batchCode': batchCode,
      'programName': programName,
      'studentCount': studentCount,
      'batchCapacity': batchCapacity,
      'mappedDate': mappedDate,
      'status': status,
      'mappedBy': mappedBy,
    };
  }
}
