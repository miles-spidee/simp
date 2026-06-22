import { Employee, MOCK_EMPLOYEES } from '../data/mock-employees';

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_EMPLOYEES;
  },

  async getEmployee(id: string): Promise<Employee | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_EMPLOYEES.find(emp => emp.id === id);
  },

  async getEmployeesByOrg(orgId: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_EMPLOYEES.filter(emp => emp.organizationId === orgId);
  }
};
