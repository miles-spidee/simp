import { employeeApi } from '../api/employee.api';
import { EmployeeCreate, EmployeeResponse } from '../types/api/employee.types';
import { Employee } from '../data/mock-employees';

export type ExtendedEmployee = EmployeeResponse & Employee;

export const employeeService = {
  mapToExtended(emp: EmployeeResponse): ExtendedEmployee {
    return {
      ...emp,
      id: emp.employee_id,
      userId: `usr-${emp.employee_id}`,
      organizationId: '',
      joinDate: new Date().toISOString(),
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.official_email,
      avatar: '',
      roleName: emp.designation,
      phone: '',
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
      return data.map(emp => this.mapToExtended(emp));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getEmployee(id: string): Promise<ExtendedEmployee | undefined> {
    const all = await this.getEmployees();
    return all.find(e => e.employee_id === id || e.id === id);
  },

  async createEmployee(data: EmployeeCreate): Promise<ExtendedEmployee> {
    const res = await employeeApi.createEmployee(data);
    return this.mapToExtended(res);
  },

  async getEmployeesByOrg(orgId: string): Promise<ExtendedEmployee[]> {
    const all = await this.getEmployees();
    return all.filter(e => e.organizationId === orgId);
  },
  
  async updateEmployee(id: string, updates: Partial<ExtendedEmployee>): Promise<ExtendedEmployee | undefined> {
    return undefined;
  },

  async bulkAssignMentor(ids: string[], mentorId: string): Promise<boolean> {
    return true;
  },

  async bulkChangeStatus(ids: string[], status: string): Promise<boolean> {
    return true;
  },

  async bulkTransferDepartment(ids: string[], department: string): Promise<boolean> {
    return true;
  }
};
