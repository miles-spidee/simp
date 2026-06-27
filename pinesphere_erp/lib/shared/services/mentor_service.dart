import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/shared/models/mentor_profile_model.dart';

class MentorService {
  // Stateful in-memory mock databases to mirror mentor.service.ts
  static final List<MentorProfile> _profiles = [
    MentorProfile(
      mentorProfileId: 'men-1',
      employeeId: 'emp-2',
      employeeName: 'Bob Johnson',
      mentorBio: 'Senior Software Engineer specializing in frontend architectures and scalable system design.',
      mentorExpertise: ['React', 'Node.js', 'System Design'],
      yearsOfExperience: 8,
      maxStudentCapacity: 10,
      currentStudentCount: 3,
      isAvailable: true,
      createdAt: '2023-03-12T09:00:00Z',
      updatedAt: '2026-06-20T14:30:00Z',
    ),
    MentorProfile(
      mentorProfileId: 'men-2',
      employeeId: 'emp-3',
      employeeName: 'Diana Prince',
      mentorBio: 'Data operations specialist with expertise in machine learning mentorship and cohort facilitation.',
      mentorExpertise: ['Machine Learning', 'Data Science', 'Leadership'],
      yearsOfExperience: 10,
      maxStudentCapacity: 8,
      currentStudentCount: 1,
      isAvailable: true,
      createdAt: '2023-06-25T10:00:00Z',
      updatedAt: '2026-06-18T11:00:00Z',
    ),
  ];

  static final List<MentorAssignment> _assignments = [
    MentorAssignment(
      id: 'ma-1',
      mentorProfileId: 'men-1',
      mentorName: 'Bob Johnson',
      employeeId: 'emp-2',
      studentId: 'stu-1',
      studentName: 'Alice Freeman',
      internId: 'INT-2026-001',
      batchId: 'batch-1',
      batchName: 'Summer 2026 Engineering Cohort',
      assignedDate: '2026-05-02',
      status: 'Active',
      assignedBy: 'Charlie Davis (HR)',
    ),
    MentorAssignment(
      id: 'ma-2',
      mentorProfileId: 'men-1',
      mentorName: 'Bob Johnson',
      employeeId: 'emp-2',
      studentId: 'stu-4',
      studentName: 'Priya Patel',
      internId: 'INT-2026-004',
      batchId: 'batch-1',
      batchName: 'Summer 2026 Engineering Cohort',
      assignedDate: '2026-05-02',
      status: 'Active',
      assignedBy: 'Charlie Davis (HR)',
    ),
    MentorAssignment(
      id: 'ma-3',
      mentorProfileId: 'men-2',
      mentorName: 'Diana Prince',
      employeeId: 'emp-3',
      studentId: 'stu-2',
      studentName: 'Evan Wright',
      internId: 'INT-2026-002',
      batchId: 'batch-2',
      batchName: 'Winter 2026 AI Specialists',
      assignedDate: '2026-02-16',
      status: 'Completed',
      assignedBy: 'Charlie Davis (HR)',
    ),
    MentorAssignment(
      id: 'ma-4',
      mentorProfileId: 'men-1',
      mentorName: 'Bob Johnson',
      employeeId: 'emp-2',
      studentId: 'stu-3',
      studentName: 'Marcus Chen',
      internId: 'INT-2026-003',
      batchId: 'batch-1',
      batchName: 'Summer 2026 Engineering Cohort',
      assignedDate: '2026-05-10',
      status: 'Active',
      assignedBy: 'Charlie Davis (HR)',
    ),
  ];

  static final List<MentorBatchMapping> _mappings = [
    MentorBatchMapping(
      id: 'mbm-1',
      mentorProfileId: 'men-1',
      mentorName: 'Bob Johnson',
      employeeId: 'emp-2',
      batchId: 'batch-1',
      batchName: 'Summer 2026 Engineering Cohort',
      batchCode: 'SEC-2026-A',
      programName: 'Summer Software Engineering Internship',
      studentCount: 2,
      batchCapacity: 40,
      mappedDate: '2026-04-20',
      status: 'Active',
      mappedBy: 'Charlie Davis (HR)',
    ),
    MentorBatchMapping(
      id: 'mbm-2',
      mentorProfileId: 'men-1',
      mentorName: 'Bob Johnson',
      employeeId: 'emp-2',
      batchId: 'batch-2',
      batchName: 'Winter 2026 AI Specialists',
      batchCode: 'AIS-2026-W',
      programName: 'Data Science Boot Camp',
      studentCount: 1,
      batchCapacity: 20,
      mappedDate: '2026-01-15',
      status: 'Completed',
      mappedBy: 'Charlie Davis (HR)',
    ),
    MentorBatchMapping(
      id: 'mbm-3',
      mentorProfileId: 'men-2',
      mentorName: 'Diana Prince',
      employeeId: 'emp-3',
      batchId: 'batch-2',
      batchName: 'Winter 2026 AI Specialists',
      batchCode: 'AIS-2026-W',
      programName: 'Data Science Boot Camp',
      studentCount: 1,
      batchCapacity: 20,
      mappedDate: '2026-02-01',
      status: 'Completed',
      mappedBy: 'Charlie Davis (HR)',
    ),
    MentorBatchMapping(
      id: 'mbm-4',
      mentorProfileId: 'men-2',
      mentorName: 'Diana Prince',
      employeeId: 'emp-3',
      batchId: 'batch-3',
      batchName: 'Quantum Research Cohort',
      batchCode: 'QRC-2026-S',
      programName: 'Research Program (Quantum Theory)',
      studentCount: 0,
      batchCapacity: 15,
      mappedDate: '2026-06-01',
      status: 'Upcoming',
      mappedBy: 'Charlie Davis (HR)',
    ),
  ];

  // API Client Methods (simulating delays matching mentor.service.ts)
  Future<List<MentorProfile>> getMentorProfiles() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_profiles);
  }

  Future<MentorProfile?> getMentorProfile(String id) async {
    await Future.delayed(const Duration(milliseconds: 200));
    try {
      return _profiles.firstWhere((m) => m.mentorProfileId == id);
    } catch (_) {
      return null;
    }
  }

  Future<MentorProfile?> updateMentorProfile(
      String id, Map<String, dynamic> updates) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final idx = _profiles.indexWhere((m) => m.mentorProfileId == id);
    if (idx == -1) return null;

    final existing = _profiles[idx];
    final updated = existing.copyWith(
      isAvailable: updates['is_available'] as bool?,
      mentorBio: updates['mentor_bio'] as String?,
      mentorExpertise: updates['mentor_expertise'] as List<String>?,
      yearsOfExperience: updates['years_of_experience'] as int?,
      maxStudentCapacity: updates['max_student_capacity'] as int?,
      updatedAt: DateTime.now().toUtc().toIso8601String(),
    );
    _profiles[idx] = updated;
    return updated;
  }

  Future<List<MentorAssignment>> getAssignments() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_assignments);
  }

  Future<MentorAssignment> createAssignment(
      Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final newAssignment = MentorAssignment(
      id: 'ma-${_assignments.length + 1}',
      mentorProfileId: data['mentorProfileId'] as String,
      mentorName: data['mentorName'] as String,
      employeeId: data['employeeId'] as String,
      studentId: data['studentId'] as String,
      studentName: data['studentName'] as String,
      internId: data['internId'] as String,
      batchId: data['batchId'] as String,
      batchName: data['batchName'] as String,
      assignedDate: data['assignedDate'] as String,
      status: data['status'] as String? ?? 'Active',
      assignedBy: data['assignedBy'] as String? ?? 'Admin',
    );
    _assignments.add(newAssignment);

    // Increment current student count in profile
    final mentorIdx = _profiles.indexWhere((m) => m.mentorProfileId == newAssignment.mentorProfileId);
    if (mentorIdx != -1) {
      final p = _profiles[mentorIdx];
      _profiles[mentorIdx] = p.copyWith(
        currentStudentCount: p.currentStudentCount + 1,
      );
    }

    return newAssignment;
  }

  Future<List<MentorBatchMapping>> getBatchMappings() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_mappings);
  }

  Future<MentorBatchMapping> createBatchMapping(
      Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final newMapping = MentorBatchMapping(
      id: 'mbm-${_mappings.length + 1}',
      mentorProfileId: data['mentorProfileId'] as String,
      mentorName: data['mentorName'] as String,
      employeeId: data['employeeId'] as String,
      batchId: data['batchId'] as String,
      batchName: data['batchName'] as String,
      batchCode: data['batchCode'] as String,
      programName: data['programName'] as String,
      studentCount: data['studentCount'] as int? ?? 0,
      batchCapacity: data['batchCapacity'] as int? ?? 20,
      mappedDate: data['mappedDate'] as String,
      status: data['status'] as String? ?? 'Active',
      mappedBy: data['mappedBy'] as String? ?? 'Admin',
    );
    _mappings.add(newMapping);
    return newMapping;
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

final mentorServiceProvider = Provider<MentorService>((ref) {
  return MentorService();
});

class MentorProfilesNotifier extends StateNotifier<AsyncValue<List<MentorProfile>>> {
  final MentorService _service;
  MentorProfilesNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getMentorProfiles();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> toggleAvailability(String profileId, bool currentVal) async {
    // Optimistic update
    if (state.hasValue) {
      final currentList = state.value!;
      state = AsyncValue.data(currentList.map((m) {
        if (m.mentorProfileId == profileId) {
          return m.copyWith(isAvailable: !currentVal);
        }
        return m;
      }).toList());
    }

    try {
      final updated = await _service.updateMentorProfile(profileId, {'is_available': !currentVal});
      if (updated != null && state.hasValue) {
        final list = state.value!;
        state = AsyncValue.data(list.map((m) => m.mentorProfileId == profileId ? updated : m).toList());
      }
    } catch (e, st) {
      // Revert if error
      load();
    }
  }
}

final mentorProfilesProvider = StateNotifierProvider.autoDispose<MentorProfilesNotifier, AsyncValue<List<MentorProfile>>>((ref) {
  return MentorProfilesNotifier(ref.watch(mentorServiceProvider));
});

class MentorAssignmentsNotifier extends StateNotifier<AsyncValue<List<MentorAssignment>>> {
  final MentorService _service;
  MentorAssignmentsNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getAssignments();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addAssignment(Map<String, dynamic> data) async {
    try {
      await _service.createAssignment(data);
      load();
    } catch (e, st) {
      // error
    }
  }
}

final mentorAssignmentsProvider = StateNotifierProvider.autoDispose<MentorAssignmentsNotifier, AsyncValue<List<MentorAssignment>>>((ref) {
  return MentorAssignmentsNotifier(ref.watch(mentorServiceProvider));
});

class MentorMappingsNotifier extends StateNotifier<AsyncValue<List<MentorBatchMapping>>> {
  final MentorService _service;
  MentorMappingsNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getBatchMappings();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addMapping(Map<String, dynamic> data) async {
    try {
      await _service.createBatchMapping(data);
      load();
    } catch (e, st) {
      // error
    }
  }
}

final mentorMappingsProvider = StateNotifierProvider.autoDispose<MentorMappingsNotifier, AsyncValue<List<MentorBatchMapping>>>((ref) {
  return MentorMappingsNotifier(ref.watch(mentorServiceProvider));
});
