class AttendanceLog {
  final String date;
  final String clockIn;
  final String clockOut;
  final String duration;
  final String status; // 'Present' | 'Checked In' | 'Absent'

  AttendanceLog({
    required this.date,
    required this.clockIn,
    required this.clockOut,
    required this.duration,
    required this.status,
  });

  AttendanceLog copyWith({
    String? date,
    String? clockIn,
    String? clockOut,
    String? duration,
    String? status,
  }) {
    return AttendanceLog(
      date: date ?? this.date,
      clockIn: clockIn ?? this.clockIn,
      clockOut: clockOut ?? this.clockOut,
      duration: duration ?? this.duration,
      status: status ?? this.status,
    );
  }
}
