import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/profile_model.dart';

class ProfileNotifier extends StateNotifier<UserProfile> {
  ProfileNotifier()
      : super(
          UserProfile(
            personal: PersonalInfo(
              firstName: "Harini",
              lastName: "S",
              email: "harini@pinesphere.com",
              mobileNumber: "9876543210",
              dateOfBirth: "2004-05-15",
              gender: "Female",
              city: "Chennai",
              state: "Tamil Nadu",
            ),
            academic: AcademicInfo(
              collegeName: "Anna University",
              department: "Computer Science and Engineering",
              degree: "B.E",
              currentYear: "Final Year",
              cgpaPercentage: "8.9",
              graduationYear: "2026",
            ),
            professional: ProfessionalInfo(
              skills: "React, Next.js, TypeScript, TailwindCSS, Node.js, Python, Git",
              githubUrl: "https://github.com/harini",
              linkedinUrl: "https://linkedin.com/in/harini",
              portfolioUrl: "https://harini.dev",
              projectExperience: "Designed and built an AI-powered enterprise ERP portal integration system during the capstone phase.",
            ),
            internship: InternshipInfo(
              internshipType: "Free",
              preferredTechStack: "Next.js & TypeScript Architecture",
              relevantExperience: "Previous front-end projects with serverless frameworks.",
            ),
            resumeName: "Harini_Resume.pdf",
            profilePicUrl: null,
          ),
        );

  void updatePersonalInfo(PersonalInfo info) {
    state = state.copyWith(personal: info);
  }

  void updateAcademicInfo(AcademicInfo info) {
    state = state.copyWith(academic: info);
  }

  void updateProfessionalInfo(ProfessionalInfo info) {
    state = state.copyWith(professional: info);
  }

  void updateInternshipInfo(InternshipInfo info) {
    state = state.copyWith(internship: info);
  }

  void uploadProfilePicture(String mockPath) {
    state = state.copyWith(profilePicUrl: mockPath);
  }

  void removeProfilePicture() {
    state = state.copyWith(profilePicUrl: null);
  }

  void uploadResume(String fileName) {
    state = state.copyWith(resumeName: fileName);
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, UserProfile>((ref) {
  return ProfileNotifier();
});
