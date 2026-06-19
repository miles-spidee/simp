class PersonalInfo {
  final String firstName;
  final String lastName;
  final String email;
  final String mobileNumber;
  final String dateOfBirth;
  final String gender;
  final String city;
  final String state;

  PersonalInfo({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.mobileNumber,
    required this.dateOfBirth,
    required this.gender,
    required this.city,
    required this.state,
  });

  String get fullName => '$firstName $lastName';

  PersonalInfo copyWith({
    String? firstName,
    String? lastName,
    String? email,
    String? mobileNumber,
    String? dateOfBirth,
    String? gender,
    String? city,
    String? state,
  }) {
    return PersonalInfo(
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      mobileNumber: mobileNumber ?? this.mobileNumber,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      city: city ?? this.city,
      state: state ?? this.state,
    );
  }
}

class AcademicInfo {
  final String collegeName;
  final String department;
  final String degree;
  final String currentYear;
  final String cgpaPercentage;
  final String graduationYear;

  AcademicInfo({
    required this.collegeName,
    required this.department,
    required this.degree,
    required this.currentYear,
    required this.cgpaPercentage,
    required this.graduationYear,
  });

  AcademicInfo copyWith({
    String? collegeName,
    String? department,
    String? degree,
    String? currentYear,
    String? cgpaPercentage,
    String? graduationYear,
  }) {
    return AcademicInfo(
      collegeName: collegeName ?? this.collegeName,
      department: department ?? this.department,
      degree: degree ?? this.degree,
      currentYear: currentYear ?? this.currentYear,
      cgpaPercentage: cgpaPercentage ?? this.cgpaPercentage,
      graduationYear: graduationYear ?? this.graduationYear,
    );
  }
}

class ProfessionalInfo {
  final String skills;
  final String githubUrl;
  final String linkedinUrl;
  final String portfolioUrl;
  final String projectExperience;

  ProfessionalInfo({
    required this.skills,
    required this.githubUrl,
    required this.linkedinUrl,
    required this.portfolioUrl,
    required this.projectExperience,
  });

  ProfessionalInfo copyWith({
    String? skills,
    String? githubUrl,
    String? linkedinUrl,
    String? portfolioUrl,
    String? projectExperience,
  }) {
    return ProfessionalInfo(
      skills: skills ?? this.skills,
      githubUrl: githubUrl ?? this.githubUrl,
      linkedinUrl: linkedinUrl ?? this.linkedinUrl,
      portfolioUrl: portfolioUrl ?? this.portfolioUrl,
      projectExperience: projectExperience ?? this.projectExperience,
    );
  }
}

class InternshipInfo {
  final String internshipType; // 'Free' | 'Paid' | 'Stipend' etc.
  final String preferredTechStack;
  final String relevantExperience;

  InternshipInfo({
    required this.internshipType,
    required this.preferredTechStack,
    required this.relevantExperience,
  });

  InternshipInfo copyWith({
    String? internshipType,
    String? preferredTechStack,
    String? relevantExperience,
  }) {
    return InternshipInfo(
      internshipType: internshipType ?? this.internshipType,
      preferredTechStack: preferredTechStack ?? this.preferredTechStack,
      relevantExperience: relevantExperience ?? this.relevantExperience,
    );
  }
}

class UserProfile {
  final PersonalInfo personal;
  final AcademicInfo academic;
  final ProfessionalInfo professional;
  final InternshipInfo internship;
  final String? profilePicUrl;
  final String resumeName;

  UserProfile({
    required this.personal,
    required this.academic,
    required this.professional,
    required this.internship,
    this.profilePicUrl,
    required this.resumeName,
  });

  UserProfile copyWith({
    PersonalInfo? personal,
    AcademicInfo? academic,
    ProfessionalInfo? professional,
    InternshipInfo? internship,
    String? profilePicUrl,
    String? resumeName,
  }) {
    return UserProfile(
      personal: personal ?? this.personal,
      academic: academic ?? this.academic,
      professional: professional ?? this.professional,
      internship: internship ?? this.internship,
      profilePicUrl: profilePicUrl ?? this.profilePicUrl,
      resumeName: resumeName ?? this.resumeName,
    );
  }
}
