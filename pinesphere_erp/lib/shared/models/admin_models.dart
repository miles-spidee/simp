class OrganizationDepartment {
  final String name;
  final String hod;
  final int studentsCount;
  final int facultyCount;
  final int internshipsCount;
  final int placementRate;
  final String status;

  OrganizationDepartment({
    required this.name,
    required this.hod,
    required this.studentsCount,
    required this.facultyCount,
    required this.internshipsCount,
    required this.placementRate,
    required this.status,
  });

  factory OrganizationDepartment.fromJson(Map<String, dynamic> json) {
    return OrganizationDepartment(
      name: (json['name'] ?? '') as String,
      hod: (json['hod'] ?? '') as String,
      studentsCount: (json['studentsCount'] ?? 0) as int,
      facultyCount: (json['facultyCount'] ?? 0) as int,
      internshipsCount: (json['internshipsCount'] ?? 0) as int,
      placementRate: (json['placementRate'] ?? 0) as int,
      status: (json['status'] ?? 'Active') as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'hod': hod,
      'studentsCount': studentsCount,
      'facultyCount': facultyCount,
      'internshipsCount': internshipsCount,
      'placementRate': placementRate,
      'status': status,
    };
  }
}

class OrganizationCoordinator {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String department;
  final int studentsManaged;
  final int programsManaged;
  final String status;
  final int applicationsProcessed;
  final int attendanceApprovals;
  final int internshipCompletions;
  final int placementSuccess;

  OrganizationCoordinator({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.department,
    required this.studentsManaged,
    required this.programsManaged,
    required this.status,
    required this.applicationsProcessed,
    required this.attendanceApprovals,
    required this.internshipCompletions,
    required this.placementSuccess,
  });

  factory OrganizationCoordinator.fromJson(Map<String, dynamic> json) {
    final kpis = json['kpis'] as Map<String, dynamic>? ?? {};
    return OrganizationCoordinator(
      id: (json['id'] ?? '') as String,
      name: (json['name'] ?? '') as String,
      email: (json['email'] ?? '') as String,
      phone: (json['phone'] ?? '') as String,
      department: (json['department'] ?? '') as String,
      studentsManaged: (json['studentsManaged'] ?? 0) as int,
      programsManaged: (json['programsManaged'] ?? 0) as int,
      status: (json['status'] ?? 'Active') as String,
      applicationsProcessed: (kpis['applicationsProcessed'] ?? json['applicationsProcessed'] ?? 0) as int,
      attendanceApprovals: (kpis['attendanceApprovals'] ?? json['attendanceApprovals'] ?? 0) as int,
      internshipCompletions: (kpis['internshipCompletions'] ?? json['internshipCompletions'] ?? 0) as int,
      placementSuccess: (kpis['placementSuccess'] ?? json['placementSuccess'] ?? 0) as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'department': department,
      'studentsManaged': studentsManaged,
      'programsManaged': programsManaged,
      'status': status,
      'kpis': {
        'applicationsProcessed': applicationsProcessed,
        'attendanceApprovals': attendanceApprovals,
        'internshipCompletions': internshipCompletions,
        'placementSuccess': placementSuccess,
      }
    };
  }
}

class OrganizationStudent {
  final String id;
  final String name;
  final String department;
  final int year;
  final String program;
  final String status;
  final String coordinatorName;

  OrganizationStudent({
    required this.id,
    required this.name,
    required this.department,
    required this.year,
    required this.program,
    required this.status,
    required this.coordinatorName,
  });

  factory OrganizationStudent.fromJson(Map<String, dynamic> json) {
    return OrganizationStudent(
      id: (json['id'] ?? '') as String,
      name: (json['name'] ?? '') as String,
      department: (json['department'] ?? '') as String,
      year: (json['year'] ?? 1) as int,
      program: (json['program'] ?? '') as String,
      status: (json['status'] ?? 'Active') as String,
      coordinatorName: (json['coordinatorName'] ?? '') as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'department': department,
      'year': year,
      'program': program,
      'status': status,
      'coordinatorName': coordinatorName,
    };
  }
}

class OrganizationProgram {
  final String name;
  final String duration;
  final int enrolledCount;
  final String status;
  final String coordinatorName;
  final int completionRate;
  final int attendanceRate;
  final int placementRate;
  final double satisfactionScore;
  final int performanceScore;

  OrganizationProgram({
    required this.name,
    required this.duration,
    required this.enrolledCount,
    required this.status,
    required this.coordinatorName,
    required this.completionRate,
    required this.attendanceRate,
    required this.placementRate,
    required this.satisfactionScore,
    required this.performanceScore,
  });

  factory OrganizationProgram.fromJson(Map<String, dynamic> json) {
    final analytics = json['analytics'] as Map<String, dynamic>? ?? {};
    return OrganizationProgram(
      name: (json['name'] ?? '') as String,
      duration: (json['duration'] ?? '') as String,
      enrolledCount: (json['enrolledCount'] ?? 0) as int,
      status: (json['status'] ?? 'Active') as String,
      coordinatorName: (json['coordinatorName'] ?? '') as String,
      completionRate: (analytics['completionRate'] ?? json['completionRate'] ?? 0) as int,
      attendanceRate: (analytics['attendanceRate'] ?? json['attendanceRate'] ?? 0) as int,
      placementRate: (analytics['placementRate'] ?? json['placementRate'] ?? 0) as int,
      satisfactionScore: ((analytics['satisfactionScore'] ?? json['satisfactionScore'] ?? 4.0) as num).toDouble(),
      performanceScore: (analytics['performanceScore'] ?? json['performanceScore'] ?? 0) as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'duration': duration,
      'enrolledCount': enrolledCount,
      'status': status,
      'coordinatorName': coordinatorName,
      'analytics': {
        'completionRate': completionRate,
        'attendanceRate': attendanceRate,
        'placementRate': placementRate,
        'satisfactionScore': satisfactionScore,
        'performanceScore': performanceScore,
      }
    };
  }
}

class OrganizationDocument {
  final String type;
  final String name;
  final String uploadDate;
  final String status;
  final String verifiedBy;
  final String version;
  final String previewContent;

  OrganizationDocument({
    required this.type,
    required this.name,
    required this.uploadDate,
    required this.status,
    required this.verifiedBy,
    required this.version,
    required this.previewContent,
  });

  factory OrganizationDocument.fromJson(Map<String, dynamic> json) {
    return OrganizationDocument(
      type: (json['type'] ?? 'MoU') as String,
      name: (json['name'] ?? '') as String,
      uploadDate: (json['uploadDate'] ?? '') as String,
      status: (json['status'] ?? 'Verified') as String,
      verifiedBy: (json['verifiedBy'] ?? 'N/A') as String,
      version: (json['version'] ?? '1.0') as String,
      previewContent: (json['previewContent'] ?? '') as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'name': name,
      'uploadDate': uploadDate,
      'status': status,
      'verifiedBy': verifiedBy,
      'version': version,
      'previewContent': previewContent,
    };
  }
}

class OrganizationTimelineEvent {
  final String date;
  final String title;
  final String description;
  final String type;

  OrganizationTimelineEvent({
    required this.date,
    required this.title,
    required this.description,
    required this.type,
  });

  factory OrganizationTimelineEvent.fromJson(Map<String, dynamic> json) {
    return OrganizationTimelineEvent(
      date: (json['date'] ?? '') as String,
      title: (json['title'] ?? '') as String,
      description: (json['description'] ?? '') as String,
      type: (json['type'] ?? 'added') as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'title': title,
      'description': description,
      'type': type,
    };
  }
}

class OrganizationModel {
  final String id;
  final String name;
  final String code;
  final String type;
  final int headcount;
  final String status;
  final String logo;
  final String university;
  final String location;
  final String partnershipStatus;
  final String partnershipSince;
  final String website;
  final String email;
  final String phone;
  final String address;
  final String naacGrade;
  final String nbaStatus;
  final String autonomousStatus;
  final int nationalRanking;
  
  final List<OrganizationDepartment> departments;
  final List<OrganizationCoordinator> coordinators;
  final List<OrganizationStudent> students;
  final List<OrganizationProgram> programs;
  final List<OrganizationDocument> documents;
  final List<OrganizationTimelineEvent> timeline;

  OrganizationModel({
    required this.id,
    required this.name,
    required this.code,
    required this.type,
    required this.headcount,
    required this.status,
    required this.logo,
    required this.university,
    required this.location,
    required this.partnershipStatus,
    required this.partnershipSince,
    required this.website,
    required this.email,
    required this.phone,
    required this.address,
    required this.naacGrade,
    required this.nbaStatus,
    required this.autonomousStatus,
    required this.nationalRanking,
    required this.departments,
    required this.coordinators,
    required this.students,
    required this.programs,
    required this.documents,
    required this.timeline,
  });

  factory OrganizationModel.fromJson(Map<String, dynamic> json) {
    return OrganizationModel(
      id: (json['id'] ?? json['college_id'] ?? '') as String,
      name: (json['name'] ?? json['college_name'] ?? '') as String,
      code: (json['code'] ?? json['college_code'] ?? '') as String,
      type: (json['type'] ?? 'Engineering') as String,
      headcount: (json['headcount'] ?? 1000) as int,
      status: (json['status'] ?? 'Active') as String,
      logo: (json['logo'] ?? '') as String,
      university: (json['university'] ?? '') as String,
      location: (json['location'] ?? '') as String,
      partnershipStatus: (json['partnershipStatus'] ?? 'Active') as String,
      partnershipSince: (json['partnershipSince'] ?? '') as String,
      website: (json['website'] ?? '') as String,
      email: (json['email'] ?? '') as String,
      phone: (json['phone'] ?? '') as String,
      address: (json['address'] ?? '') as String,
      naacGrade: (json['naacGrade'] ?? '') as String,
      nbaStatus: (json['nbaStatus'] ?? 'Accredited') as String,
      autonomousStatus: (json['autonomousStatus'] ?? 'Autonomous') as String,
      nationalRanking: (json['nationalRanking'] ?? 50) as int,
      departments: ((json['departments'] as List?) ?? [])
          .map((d) => OrganizationDepartment.fromJson(d as Map<String, dynamic>))
          .toList(),
      coordinators: ((json['coordinators'] as List?) ?? [])
          .map((c) => OrganizationCoordinator.fromJson(c as Map<String, dynamic>))
          .toList(),
      students: ((json['students'] as List?) ?? [])
          .map((s) => OrganizationStudent.fromJson(s as Map<String, dynamic>))
          .toList(),
      programs: ((json['programs'] as List?) ?? [])
          .map((p) => OrganizationProgram.fromJson(p as Map<String, dynamic>))
          .toList(),
      documents: ((json['documents'] as List?) ?? [])
          .map((d) => OrganizationDocument.fromJson(d as Map<String, dynamic>))
          .toList(),
      timeline: ((json['timeline'] as List?) ?? [])
          .map((t) => OrganizationTimelineEvent.fromJson(t as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'type': type,
      'headcount': headcount,
      'status': status,
      'logo': logo,
      'university': university,
      'location': location,
      'partnershipStatus': partnershipStatus,
      'partnershipSince': partnershipSince,
      'website': website,
      'email': email,
      'phone': phone,
      'address': address,
      'naacGrade': naacGrade,
      'nbaStatus': nbaStatus,
      'autonomousStatus': autonomousStatus,
      'nationalRanking': nationalRanking,
      'departments': departments.map((d) => d.toJson()).toList(),
      'coordinators': coordinators.map((c) => c.toJson()).toList(),
      'students': students.map((s) => s.toJson()).toList(),
      'programs': programs.map((p) => p.toJson()).toList(),
      'documents': documents.map((d) => d.toJson()).toList(),
      'timeline': timeline.map((t) => t.toJson()).toList(),
    };
  }

  OrganizationModel copyWith({
    String? id,
    String? name,
    String? code,
    String? type,
    int? headcount,
    String? status,
    String? logo,
    String? university,
    String? location,
    String? partnershipStatus,
    String? partnershipSince,
    String? website,
    String? email,
    String? phone,
    String? address,
    String? naacGrade,
    String? nbaStatus,
    String? autonomousStatus,
    int? nationalRanking,
    List<OrganizationDepartment>? departments,
    List<OrganizationCoordinator>? coordinators,
    List<OrganizationStudent>? students,
    List<OrganizationProgram>? programs,
    List<OrganizationDocument>? documents,
    List<OrganizationTimelineEvent>? timeline,
  }) {
    return OrganizationModel(
      id: id ?? this.id,
      name: name ?? this.name,
      code: code ?? this.code,
      type: type ?? this.type,
      headcount: headcount ?? this.headcount,
      status: status ?? this.status,
      logo: logo ?? this.logo,
      university: university ?? this.university,
      location: location ?? this.location,
      partnershipStatus: partnershipStatus ?? this.partnershipStatus,
      partnershipSince: partnershipSince ?? this.partnershipSince,
      website: website ?? this.website,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      address: address ?? this.address,
      naacGrade: naacGrade ?? this.naacGrade,
      nbaStatus: nbaStatus ?? this.nbaStatus,
      autonomousStatus: autonomousStatus ?? this.autonomousStatus,
      nationalRanking: nationalRanking ?? this.nationalRanking,
      departments: departments ?? this.departments,
      coordinators: coordinators ?? this.coordinators,
      students: students ?? this.students,
      programs: programs ?? this.programs,
      documents: documents ?? this.documents,
      timeline: timeline ?? this.timeline,
    );
  }
}

class AuditLogModel {
  final String id;
  final String userId;
  final String action;
  final String entityType;
  final String entityId;
  final String timestamp;
  final String status;

  AuditLogModel({
    required this.id,
    required this.userId,
    required this.action,
    required this.entityType,
    required this.entityId,
    required this.timestamp,
    required this.status,
  });

  factory AuditLogModel.fromJson(Map<String, dynamic> json) {
    return AuditLogModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      action: json['action'] as String,
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      timestamp: json['timestamp'] as String,
      status: json['status'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'action': action,
      'entityType': entityType,
      'entityId': entityId,
      'timestamp': timestamp,
      'status': status,
    };
  }
}

class SystemSettingModel {
  final String id;
  final String category;
  final String key;
  final String value;

  SystemSettingModel({
    required this.id,
    required this.category,
    required this.key,
    required this.value,
  });

  factory SystemSettingModel.fromJson(Map<String, dynamic> json) {
    return SystemSettingModel(
      id: json['id'] as String,
      category: json['category'] as String,
      key: json['key'] as String,
      value: json['value'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'key': key,
      'value': value,
    };
  }

  SystemSettingModel copyWith({
    String? id,
    String? category,
    String? key,
    String? value,
  }) {
    return SystemSettingModel(
      id: id ?? this.id,
      category: category ?? this.category,
      key: key ?? this.key,
      value: value ?? this.value,
    );
  }
}

class SystemPermissionModel {
  final String id;
  final String label;
  final String module;

  SystemPermissionModel({
    required this.id,
    required this.label,
    required this.module,
  });

  factory SystemPermissionModel.fromJson(Map<String, dynamic> json) {
    return SystemPermissionModel(
      id: json['id'] as String,
      label: json['label'] as String,
      module: json['module'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'label': label,
      'module': module,
    };
  }
}

class RoleModel {
  final String id;
  final String name;
  final String code;
  final String desc;
  final String status; // 'Active' | 'Inactive'
  final int modulesCount;
  final int usersCount;
  final List<String> moduleIds;
  final List<String> permissions;

  const RoleModel({
    required this.id,
    required this.name,
    required this.code,
    required this.desc,
    required this.status,
    required this.modulesCount,
    required this.usersCount,
    required this.moduleIds,
    required this.permissions,
  });

  RoleModel copyWith({
    String? id,
    String? name,
    String? code,
    String? desc,
    String? status,
    int? modulesCount,
    int? usersCount,
    List<String>? moduleIds,
    List<String>? permissions,
  }) {
    return RoleModel(
      id: id ?? this.id,
      name: name ?? this.name,
      code: code ?? this.code,
      desc: desc ?? this.desc,
      status: status ?? this.status,
      modulesCount: modulesCount ?? this.modulesCount,
      usersCount: usersCount ?? this.usersCount,
      moduleIds: moduleIds ?? this.moduleIds,
      permissions: permissions ?? this.permissions,
    );
  }
}

