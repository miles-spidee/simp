/// Represents the authenticated user decoded from the JWT payload.
///
/// The backend JWT payload may include fields like sub, role, username, email.
/// This model provides safe defaults for any missing claims.
class UserModel {
  final String userId;
  final String username;
  final String email;
  final String role;     // e.g. ROLE_STUDENT, ROLE_HR, ROLE_SUPER_ADMIN
  final String displayName;

  const UserModel({
    required this.userId,
    required this.username,
    required this.email,
    required this.role,
    required this.displayName,
  });

  factory UserModel.fromJwtPayload(Map<String, dynamic> payload) {
    final userId = (payload['sub'] ?? payload['user_id'] ?? '').toString();
    final username = (payload['username'] ?? payload['name'] ?? payload['sub'] ?? '').toString();
    final email = (payload['email'] ?? '').toString();

    // Backend may use 'role', 'roles' (list), or 'role_name'
    String role = '';
    if (payload['role'] != null) {
      role = payload['role'].toString();
    } else if (payload['roles'] is List && (payload['roles'] as List).isNotEmpty) {
      role = (payload['roles'] as List).first.toString();
    } else if (payload['role_name'] != null) {
      role = payload['role_name'].toString();
    }

    final displayName = (payload['name'] ?? payload['username'] ?? username).toString();

    return UserModel(
      userId: userId,
      username: username,
      email: email,
      role: role.toUpperCase(),
      displayName: displayName.isNotEmpty ? displayName : username,
    );
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['user_id'] as String? ?? '',
      username: json['username'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: (json['role'] as String? ?? '').toUpperCase(),
      displayName: json['display_name'] as String? ?? json['username'] as String? ?? '',
    );
  }

  // ── Role helpers ──────────────────────────────────────────────────────────

  bool get isStudent =>
      role.contains('STUDENT');

  bool get isHR =>
      role.contains('HR') && !role.contains('ADMIN');

  bool get isSuperAdmin =>
      role.contains('SUPER_ADMIN') ||
      role.contains('ADMIN') ||
      role == 'ROLE_ADMIN';

  bool get isMentor => role.contains('MENTOR');

  bool get isCoordinator => role.contains('CC') || role.contains('COORDINATOR');

  /// Maps role to one of three portal keys used for routing.
  String get portalKey {
    if (isStudent) return 'student';
    if (isSuperAdmin) return 'admin';
    return 'hr'; // HR, mentor, coordinator all land in HR portal
  }

  @override
  String toString() =>
      'UserModel(userId: $userId, username: $username, role: $role)';
}
