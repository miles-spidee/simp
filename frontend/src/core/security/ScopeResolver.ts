import { User } from '@/src/data/mock-users';

export interface ResolvedScope {
  isSuperAdmin: boolean;
  organizationIds: string[];
  collegeIds: string[];
  departmentIds: string[];
  programIds: string[];
  batchIds: string[];
  mentorId?: string; // If the user is a mentor, their own ID
}

export class ScopeResolver {
  /**
   * Evaluates the given User object to resolve the row-level data boundaries
   * they are permitted to access.
   */
  static resolve(user: User | null): ResolvedScope {
    const defaultScope: ResolvedScope = {
      isSuperAdmin: false,
      organizationIds: [],
      collegeIds: [],
      departmentIds: [],
      programIds: [],
      batchIds: [],
    };

    if (!user) {
      return defaultScope;
    }

    // Super Admin check
    if (user.roleName === 'Super Admin' || user.roleId === 'role-5') {
      return {
        ...defaultScope,
        isSuperAdmin: true,
      };
    }

    const scope = { ...defaultScope };

    // Map known HR/Management personas (In a real system, these would be arrays associated with the user record)
    if (user.roleName === 'HR') {
      // HR can view the organization they belong to
      scope.departmentIds = user.departmentId ? [user.departmentId] : [];
      // Usually HR views the whole org, we'd add org scopes here if available on the User model
    }

    // College Coordinator
    if ((user.roleName === 'College Coordinator' || user.roleId === 'role-4') && user.collegeId) {
      scope.collegeIds = [user.collegeId];
    }

    // Mentor
    if (user.roleName === 'Mentor' || user.roleId === 'role-2') {
      scope.mentorId = user.id;
      if (user.batchId) {
        scope.batchIds = [user.batchId];
      }
    }

    // Student
    if (user.roleName === 'Student' || user.roleId === 'role-1') {
      if (user.collegeId) scope.collegeIds = [user.collegeId];
      if (user.batchId) scope.batchIds = [user.batchId];
    }

    return scope;
  }
}
