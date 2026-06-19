import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/profile_model.dart';
import 'package:pinesphere_erp/student_portal/providers/profile_provider.dart';
import 'package:pinesphere_erp/student_portal/portal_theme.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  String _activeTab = 'personal'; // 'personal' | 'academic' | 'professional' | 'internship'

  // Text controllers
  late TextEditingController _firstNameController;
  late TextEditingController _lastNameController;
  late TextEditingController _emailController;
  late TextEditingController _mobileController;
  late TextEditingController _dobController;
  late TextEditingController _genderController;
  late TextEditingController _cityController;
  late TextEditingController _stateController;

  late TextEditingController _collegeController;
  late TextEditingController _deptController;
  late TextEditingController _degreeController;
  late TextEditingController _yearController;
  late TextEditingController _cgpaController;
  late TextEditingController _gradYearController;

  late TextEditingController _skillsController;
  late TextEditingController _githubController;
  late TextEditingController _linkedinController;
  late TextEditingController _portfolioController;
  late TextEditingController _projectController;

  late TextEditingController _preferredStackController;
  late TextEditingController _internshipRelevantController;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(profileProvider);

    _firstNameController = TextEditingController(text: profile.personal.firstName);
    _lastNameController = TextEditingController(text: profile.personal.lastName);
    _emailController = TextEditingController(text: profile.personal.email);
    _mobileController = TextEditingController(text: profile.personal.mobileNumber);
    _dobController = TextEditingController(text: profile.personal.dateOfBirth);
    _genderController = TextEditingController(text: profile.personal.gender);
    _cityController = TextEditingController(text: profile.personal.city);
    _stateController = TextEditingController(text: profile.personal.state);

    _collegeController = TextEditingController(text: profile.academic.collegeName);
    _deptController = TextEditingController(text: profile.academic.department);
    _degreeController = TextEditingController(text: profile.academic.degree);
    _yearController = TextEditingController(text: profile.academic.currentYear);
    _cgpaController = TextEditingController(text: profile.academic.cgpaPercentage);
    _gradYearController = TextEditingController(text: profile.academic.graduationYear);

    _skillsController = TextEditingController(text: profile.professional.skills);
    _githubController = TextEditingController(text: profile.professional.githubUrl);
    _linkedinController = TextEditingController(text: profile.professional.linkedinUrl);
    _portfolioController = TextEditingController(text: profile.professional.portfolioUrl);
    _projectController = TextEditingController(text: profile.professional.projectExperience);

    _preferredStackController = TextEditingController(text: profile.internship.preferredTechStack);
    _internshipRelevantController = TextEditingController(text: profile.internship.relevantExperience);
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _mobileController.dispose();
    _dobController.dispose();
    _genderController.dispose();
    _cityController.dispose();
    _stateController.dispose();

    _collegeController.dispose();
    _deptController.dispose();
    _degreeController.dispose();
    _yearController.dispose();
    _cgpaController.dispose();
    _gradYearController.dispose();

    _skillsController.dispose();
    _githubController.dispose();
    _linkedinController.dispose();
    _portfolioController.dispose();
    _projectController.dispose();

    _preferredStackController.dispose();
    _internshipRelevantController.dispose();
    super.dispose();
  }

  void _saveChanges() {
    final notifier = ref.read(profileProvider.notifier);

    notifier.updatePersonalInfo(PersonalInfo(
      firstName: _firstNameController.text,
      lastName: _lastNameController.text,
      email: _emailController.text,
      mobileNumber: _mobileController.text,
      dateOfBirth: _dobController.text,
      gender: _genderController.text,
      city: _cityController.text,
      state: _stateController.text,
    ));

    notifier.updateAcademicInfo(AcademicInfo(
      collegeName: _collegeController.text,
      department: _deptController.text,
      degree: _degreeController.text,
      currentYear: _yearController.text,
      cgpaPercentage: _cgpaController.text,
      graduationYear: _gradYearController.text,
    ));

    notifier.updateProfessionalInfo(ProfessionalInfo(
      skills: _skillsController.text,
      githubUrl: _githubController.text,
      linkedinUrl: _linkedinController.text,
      portfolioUrl: _portfolioController.text,
      projectExperience: _projectController.text,
    ));

    notifier.updateInternshipInfo(InternshipInfo(
      internshipType: ref.read(profileProvider).internship.internshipType,
      preferredTechStack: _preferredStackController.text,
      relevantExperience: _internshipRelevantController.text,
    ));

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Profile settings saved successfully!")),
    );
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(profileProvider);
    final notifier = ref.read(profileProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: Text("My Profile"),
        actions: [
          IconButton(
            onPressed: _saveChanges,
            icon: Icon(Icons.save, color: PortalTheme.accentBlue(context)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Avatar Card Header
            Container(
              color: PortalTheme.cardSurface(context),
              padding: EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              width: double.infinity,
              child: Column(
                children: [
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 46,
                        backgroundColor: PortalTheme.primaryBlue(context),
                        backgroundImage: profile.profilePicUrl != null ? NetworkImage(profile.profilePicUrl!) : null,
                        child: profile.profilePicUrl == null
                            ? Text(
                                "${profile.personal.firstName[0]}${profile.personal.lastName[0]}",
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.onPrimary,
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                ),
                              )
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: InkWell(
                          onTap: () {
                            // Simulate profile photo pick
                            notifier.uploadProfilePicture("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80");
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text("Profile picture updated!")),
                            );
                          },
                          child: CircleAvatar(
                            radius: 16,
                            backgroundColor: PortalTheme.accentBlue(context),
                            child: Icon(
                              Icons.camera_alt,
                              color: Theme.of(context).colorScheme.onSecondary,
                              size: 14,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Text(
                    profile.personal.fullName,
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    "Intern Developer (${profile.internship.internshipType} Program)",
                    style: TextStyle(color: PortalTheme.accentBlue(context), fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (profile.profilePicUrl != null)
                        TextButton.icon(
                          onPressed: () => notifier.removeProfilePicture(),
                          icon: Icon(Icons.delete, size: 12, color: PortalTheme.errorRed(context)),
                          label: Text("Remove Photo", style: TextStyle(color: PortalTheme.errorRed(context), fontSize: 11)),
                        ),
                    ],
                  ),
                ],
              ),
            ),

            // Form Tab Bar selector
            SizedBox(
              height: 44,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                children: [
                  _buildFormTabButton("Personal", "personal"),
                  _buildFormTabButton("Academic", "academic"),
                  _buildFormTabButton("Professional", "professional"),
                  _buildFormTabButton("Internship", "internship"),
                ],
              ),
            ),
            Divider(color: PortalTheme.divider(context), height: 1),

            // Tab Content
            Padding(
              padding: EdgeInsets.all(16.0),
              child: Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: _buildFormContent(profile, notifier),
                ),
              ),
            ),

            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saveChanges,
                      child: Text("SAVE PROFILE CHANGES"),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildFormTabButton(String label, String value) {
    final isActive = _activeTab == value;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: ChoiceChip(
        label: Text(label),
        selected: isActive,
        selectedColor: PortalTheme.primaryBlue(context),
        backgroundColor: PortalTheme.cardSurface(context),
        labelStyle: TextStyle(
          color: isActive ? Theme.of(context).colorScheme.onPrimary : PortalTheme.textMuted(context),
          fontWeight: FontWeight.bold,
          fontSize: 11,
        ),
        onSelected: (selected) {
          if (selected) {
            setState(() {
              _activeTab = value;
            });
          }
        },
      ),
    );
  }

  Widget _buildFormContent(UserProfile profile, ProfileNotifier notifier) {
    if (_activeTab == 'personal') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildFieldTitle("FIRST NAME"),
          TextField(controller: _firstNameController),
          SizedBox(height: 12),
          _buildFieldTitle("LAST NAME"),
          TextField(controller: _lastNameController),
          SizedBox(height: 12),
          _buildFieldTitle("EMAIL ADDRESS"),
          TextField(controller: _emailController, keyboardType: TextInputType.emailAddress),
          SizedBox(height: 12),
          _buildFieldTitle("MOBILE NUMBER"),
          TextField(controller: _mobileController, keyboardType: TextInputType.phone),
          SizedBox(height: 12),
          _buildFieldTitle("DATE OF BIRTH"),
          TextField(controller: _dobController),
          SizedBox(height: 12),
          _buildFieldTitle("GENDER"),
          TextField(controller: _genderController),
          SizedBox(height: 12),
          _buildFieldTitle("CITY"),
          TextField(controller: _cityController),
          SizedBox(height: 12),
          _buildFieldTitle("STATE"),
          TextField(controller: _stateController),
        ],
      );
    } else if (_activeTab == 'academic') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildFieldTitle("COLLEGE NAME"),
          TextField(controller: _collegeController),
          SizedBox(height: 12),
          _buildFieldTitle("DEPARTMENT"),
          TextField(controller: _deptController),
          SizedBox(height: 12),
          _buildFieldTitle("DEGREE"),
          TextField(controller: _degreeController),
          SizedBox(height: 12),
          _buildFieldTitle("CURRENT YEAR of STUDY"),
          TextField(controller: _yearController),
          SizedBox(height: 12),
          _buildFieldTitle("CGPA"),
          TextField(controller: _cgpaController),
          SizedBox(height: 12),
          _buildFieldTitle("GRADUATION YEAR"),
          TextField(controller: _gradYearController),
        ],
      );
    } else if (_activeTab == 'professional') {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildFieldTitle("TECHNICAL SKILLS (comma-separated)"),
          TextField(controller: _skillsController),
          SizedBox(height: 12),
          _buildFieldTitle("GITHUB PROFILE LINK"),
          TextField(controller: _githubController, keyboardType: TextInputType.url),
          SizedBox(height: 12),
          _buildFieldTitle("LINKEDIN PROFILE LINK"),
          TextField(controller: _linkedinController, keyboardType: TextInputType.url),
          SizedBox(height: 12),
          _buildFieldTitle("PORTFOLIO LINK"),
          TextField(controller: _portfolioController, keyboardType: TextInputType.url),
          SizedBox(height: 12),
          _buildFieldTitle("PROJECT EXPERIENCES"),
          TextField(controller: _projectController, maxLines: 4),
          SizedBox(height: 16),
          Divider(color: PortalTheme.divider(context)),
          SizedBox(height: 12),
          _buildFieldTitle("SUBMITTED RESUME"),
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.04),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: PortalTheme.borderLight(context)),
            ),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                Icon(Icons.file_present, color: PortalTheme.accentBlue(context)),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    profile.resumeName,
                    style: TextStyle(
                      color: PortalTheme.textColor(context),
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // Simulate file pick for resume
                    notifier.uploadResume("Harini_Updated_Resume.pdf");
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("Resume PDF updated successfully!")),
                    );
                  },
                  child: Text("CHANGE"),
                ),
              ],
            ),
          ),
        ],
      );
    } else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildFieldTitle("INTERNSHIP PROGRAM TYPE"),
          TextField(
            controller: TextEditingController(text: profile.internship.internshipType),
            enabled: false,
            decoration: InputDecoration(
              fillColor: Theme.of(context).colorScheme.onSurface.withOpacity(0.06),
            ),
            style: TextStyle(color: PortalTheme.textMuted(context)),
          ),
          SizedBox(height: 12),
          _buildFieldTitle("PREFERRED TECH STACK"),
          TextField(controller: _preferredStackController),
          SizedBox(height: 12),
          _buildFieldTitle("RELEVANT EXPERIENCE STATEMENT"),
          TextField(controller: _internshipRelevantController, maxLines: 3),
        ],
      );
    }
  }

  Widget _buildFieldTitle(String label) {
    return Padding(
      padding: EdgeInsets.only(bottom: 6, left: 4),
      child: Text(
        label,
        style: TextStyle(
          color: PortalTheme.textMuted(context),
          fontSize: 9,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
