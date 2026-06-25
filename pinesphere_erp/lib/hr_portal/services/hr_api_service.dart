import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/network/api_config.dart';
import 'package:pinesphere_erp/core/network/dio_client.dart';
import 'package:pinesphere_erp/shared/models/program_model.dart';
import 'package:pinesphere_erp/shared/models/student_model.dart';

/// HR API Service — mirrors student.api.ts and program.api.ts from frontend.
/// All requests use the Dio client which auto-attaches the JWT token.
class HrApiService {
  final Dio _dio;
  HrApiService(this._dio);

  // ── Students ─────────────────────────────────────────────────────────────

  /// GET /students/ — mirrors studentApi.getStudents()
  Future<List<StudentModel>> getStudents() async {
    final response = await _dio.get(ApiConfig.students);
    final data = response.data as List<dynamic>;
    return data
        .map((e) => StudentModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /students/{id} — mirrors studentApi.getStudent(id)
  Future<StudentModel?> getStudent(String id) async {
    final response = await _dio.get('${ApiConfig.students}$id');
    return StudentModel.fromJson(response.data as Map<String, dynamic>);
  }

  /// POST /students/ — mirrors studentApi.createStudent(data)
  Future<StudentModel> createStudent(Map<String, dynamic> data) async {
    final response = await _dio.post(ApiConfig.students, data: data);
    return StudentModel.fromJson(response.data as Map<String, dynamic>);
  }

  /// PUT /students/{id} — mirrors studentApi.updateStudent(id, data)
  Future<StudentModel> updateStudent(
      String id, Map<String, dynamic> data) async {
    final response =
        await _dio.put('${ApiConfig.students}$id', data: data);
    return StudentModel.fromJson(response.data as Map<String, dynamic>);
  }

  // ── Programs ──────────────────────────────────────────────────────────────

  /// GET /programs — mirrors programApi.getPrograms()
  Future<List<ProgramModel>> getPrograms() async {
    final response = await _dio.get(ApiConfig.programs);
    final data = response.data as List<dynamic>;
    return data
        .map((e) => ProgramModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  /// GET /programs/internship-types — mirrors programApi.getInternshipTypes()
  Future<List<InternshipTypeModel>> getInternshipTypes() async {
    final response = await _dio.get(ApiConfig.internshipTypes);
    final data = response.data as List<dynamic>;
    return data
        .map((e) => InternshipTypeModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

final hrApiServiceProvider = Provider<HrApiService>((ref) {
  return HrApiService(DioClient().dio);
});

// ── Students provider ─────────────────────────────────────────────────────────

final hrStudentsProvider =
    FutureProvider<List<StudentModel>>((ref) async {
  final service = ref.watch(hrApiServiceProvider);
  return service.getStudents();
});

// ── Programs provider ─────────────────────────────────────────────────────────

final hrProgramsProvider =
    FutureProvider<List<ProgramModel>>((ref) async {
  final service = ref.watch(hrApiServiceProvider);
  return service.getPrograms();
});

// ── Internship types provider ─────────────────────────────────────────────────

final hrInternshipTypesProvider =
    FutureProvider<List<InternshipTypeModel>>((ref) async {
  final service = ref.watch(hrApiServiceProvider);
  return service.getInternshipTypes();
});

// ── Dashboard stats derived from real data ────────────────────────────────────

class HrDashboardStats {
  final int totalStudents;
  final int totalPrograms;
  final int activeStudents;
  final int completedStudents;

  const HrDashboardStats({
    required this.totalStudents,
    required this.totalPrograms,
    required this.activeStudents,
    required this.completedStudents,
  });
}

final hrDashboardStatsProvider =
    FutureProvider<HrDashboardStats>((ref) async {
  final studentsAsync = ref.watch(hrStudentsProvider);
  final programsAsync = ref.watch(hrProgramsProvider);

  final students = studentsAsync.when(
    data: (d) => d,
    loading: () => <StudentModel>[],
    error: (_, __) => <StudentModel>[],
  );
  final programs = programsAsync.when(
    data: (d) => d,
    loading: () => <ProgramModel>[],
    error: (_, __) => <ProgramModel>[],
  );

  return HrDashboardStats(
    totalStudents: students.length,
    totalPrograms: programs.length,
    activeStudents:
        students.where((s) => s.studentStatus == 'Active').length,
    completedStudents:
        students.where((s) => s.studentStatus == 'Completed').length,
  );
});
