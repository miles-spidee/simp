import { employeeApi } from '../api/employee.api';
import { EmployeeCreate, EmployeeResponse } from '../types/api/employee.types';
import { Employee, MOCK_EMPLOYEES } from '../data/mock-employees';

export type ExtendedEmployee = EmployeeResponse & Employee & {
  has_account?: boolean;
  username?: string;
};

export const employeeService = {
  mapToExtended(emp: EmployeeResponse): ExtendedEmployee {
    return {
      ...emp,
      id: emp.employee_id,
      organizationId: (emp as any).organization_code || (emp as any).organization_id || '',
      userId: `usr-${emp.employee_id}`,
      joinDate: (emp as any).joining_date || new Date().toISOString(),
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.official_email,
      avatar: '',
      roleName: emp.designation,
      phone: (emp as any).phone_number || (emp as any).phone || '',
      dob: '',
      gender: '',
      address: '',
      emergencyContact: {
        name: '',
        relation: '',
        phone: ''
      },
      location: '',
      experienceLevel: 'Junior',
      employmentType: 'Full-time',
      documents: [],
      salaryGrade: '',
      band: '',
      shift: '',
      attendance: { presentDays: 0, absentDays: 0, lateArrivals: 0, totalHours: 0 },
      leave: { available: 12, used: 0, pending: 0, approved: 0 },
      projects: [],
      timeline: []
    } as any;
  },

  async getEmployees(): Promise<ExtendedEmployee[]> {
    try {
      const data = await employeeApi.getEmployees();
      if (data && data.length > 0) {
        return data.map(emp => this.mapToExtended(emp));
      }
    } catch (e) {
      console.debug("Failed to load employees from API, falling back to mock data:", e);
    }
    return MOCK_EMPLOYEES.map((emp: any) => ({
      ...emp,
      employee_id: emp.id,
      official_email: emp.email,
      designation: emp.designation || emp.roleName || 'Employee'
    })) as ExtendedEmployee[];
  },

  async getEmployee(id: string): Promise<ExtendedEmployee | undefined> {
    const all = await this.getEmployees();
    return all.find(e => e.employee_id === id || e.id === id);
  },

  async createEmployee(data: EmployeeCreate): Promise<ExtendedEmployee> {
    const res = await employeeApi.createEmployee(data);
    return this.mapToExtended(res);
  },

  async updateEmployee(id: string, updates: Partial<ExtendedEmployee>): Promise<ExtendedEmployee | undefined> {
    try {
      const current = await this.getEmployee(id);
      const res = await employeeApi.updateEmployee(id, updates as any);
      const mapped = this.mapToExtended(res);
      return {
        ...(current || {} as ExtendedEmployee),
        ...mapped,
        ...updates,
      } as ExtendedEmployee;
    } catch (e) {
      console.debug('Failed to update employee via API:', e);
      return undefined;
    }
  },

  async getEmployeesByOrg(orgId: string): Promise<ExtendedEmployee[]> {
    const all = await this.getEmployees();
    return all.filter(e => e.organizationId === orgId);
  },

  async bulkAssignMentor(ids: string[], mentorId: string): Promise<boolean> {
    try {
      await employeeApi.bulkAssignMentor(ids, mentorId);
      return true;
    } catch (e) {
      console.debug('Failed bulk mentor update:', e);
      return false;
    }
  },

  async bulkChangeStatus(ids: string[], status: string): Promise<boolean> {
    try {
      await employeeApi.bulkChangeStatus(ids, status);
      return true;
    } catch (e) {
      console.debug('Failed bulk status update:', e);
      return false;
    }
  },

  async bulkTransferDepartment(ids: string[], department: string): Promise<boolean> {
    try {
      await employeeApi.bulkTransferDepartment(ids, department);
      return true;
    } catch (e) {
      console.debug('Failed bulk department update:', e);
      return false;
    }
  },

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      await employeeApi.deleteEmployee(id);
      return true;
    } catch (e) {
      console.error('Failed to delete employee:', e);
      return false;
    }
  }
};
