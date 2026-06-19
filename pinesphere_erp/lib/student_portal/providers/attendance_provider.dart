import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/student_portal/models/attendance_model.dart';

class AttendanceState {
  final bool isCheckedIn;
  final String? clockInTime;
  final List<AttendanceLog> logs;

  AttendanceState({
    required this.isCheckedIn,
    this.clockInTime,
    required this.logs,
  });

  AttendanceState copyWith({
    bool? isCheckedIn,
    String? clockInTime,
    List<AttendanceLog>? logs,
  }) {
    return AttendanceState(
      isCheckedIn: isCheckedIn ?? this.isCheckedIn,
      clockInTime: clockInTime ?? this.clockInTime,
      logs: logs ?? this.logs,
    );
  }
}

class AttendanceNotifier extends StateNotifier<AttendanceState> {
  AttendanceNotifier()
      : super(
          AttendanceState(
            isCheckedIn: true,
            clockInTime: '09:00 AM',
            logs: [
              AttendanceLog(date: '2026-06-16', clockIn: '09:00 AM', clockOut: 'Active', duration: '--', status: 'Checked In'),
              AttendanceLog(date: '2026-06-15', clockIn: '09:01 AM', clockOut: '05:48 PM', duration: '8h 47m', status: 'Present'),
              AttendanceLog(date: '2026-06-14', clockIn: '08:55 AM', clockOut: '06:02 PM', duration: '9h 07m', status: 'Present'),
              AttendanceLog(date: '2026-06-13', clockIn: '09:12 AM', clockOut: '05:30 PM', duration: '8h 18m', status: 'Present'),
              AttendanceLog(date: '2026-06-12', clockIn: '09:00 AM', clockOut: '05:50 PM', duration: '8h 50m', status: 'Present'),
              AttendanceLog(date: '2026-06-11', clockIn: '08:45 AM', clockOut: '06:15 PM', duration: '9h 30m', status: 'Present'),
            ],
          ),
        );

  void toggleCheckIn() {
    // Mirroring frontend behaviour: "Active session is managed automatically by the workstation."
    // But we can add a notification hook or keep it as is.
  }
}

final attendanceProvider = StateNotifierProvider<AttendanceNotifier, AttendanceState>((ref) {
  return AttendanceNotifier();
});
