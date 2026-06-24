import { Employee, MOCK_EMPLOYEES, EmployeeAttendance, EmployeeLeave } from '../data/mock-employees';

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_EMPLOYEES];
  },

  async getEmployee(id: string): Promise<Employee | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_EMPLOYEES.find(emp => emp.id === id);
  },

  async getEmployeesByOrg(orgId: string): Promise<Employee[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_EMPLOYEES.filter(emp => emp.organizationId === orgId);
  },

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_EMPLOYEES.findIndex(emp => emp.id === id);
    if (idx !== -1) {
      MOCK_EMPLOYEES[idx] = {
        ...MOCK_EMPLOYEES[idx],
        ...updates
      };
      return MOCK_EMPLOYEES[idx];
    }
    return undefined;
  },

  async bulkAssignMentor(ids: string[], mentorId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const mentor = MOCK_EMPLOYEES.find(e => e.id === mentorId);
    const mentorName = mentor ? mentor.name : 'Unknown Mentor';
    
    MOCK_EMPLOYEES.forEach(emp => {
      if (ids.includes(emp.id)) {
        emp.mentorId = mentorId;
        emp.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Assigned Mentor',
          description: `Assigned mentorship connection to ${mentorName}.`,
          type: 'mentor'
        });
      }
    });
    return true;
  },

  async bulkChangeStatus(ids: string[], status: Employee['status']): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    MOCK_EMPLOYEES.forEach(emp => {
      if (ids.includes(emp.id)) {
        const oldStatus = emp.status;
        emp.status = status;
        emp.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Status Change',
          description: `Lifecycle status transitioned from ${oldStatus} to ${status}.`,
          type: 'status'
        });
      }
    });
    return true;
  },

  async bulkTransferDepartment(ids: string[], department: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    MOCK_EMPLOYEES.forEach(emp => {
      if (ids.includes(emp.id)) {
        const oldOrg = emp.organizationId;
        emp.organizationId = department; // organizationId serves as department in simp schema
        emp.timeline.unshift({
          date: new Date().toISOString().split('T')[0],
          title: 'Department Transfer',
          description: `Transferred to department: ${department} (previously in ${oldOrg}).`,
          type: 'transfer'
        });
      }
    });
    return true;
  },

  async createEmployee(employeeData: Omit<Employee, 'id' | 'joinDate' | 'timeline' | 'documents' | 'attendance' | 'leave'> & { 
    id?: string; 
    joinDate?: string; 
    attendance?: EmployeeAttendance; 
    leave?: EmployeeLeave 
  }): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const id = employeeData.id || `emp-${MOCK_EMPLOYEES.length + 1}`;
    const newEmp: Employee = {
      ...employeeData,
      id,
      joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0],
      attendance: employeeData.attendance || { presentDays: 0, absentDays: 0, lateArrivals: 0, totalHours: 0 },
      leave: employeeData.leave || { available: 12, used: 0, pending: 0, approved: 0 },
      documents: [
        { type: 'Offer Letter', name: `offer_letter_${employeeData.name.toLowerCase().replace(/\s+/g, '_')}.pdf`, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified', verifiedBy: 'System Admin', version: 'v1.0' }
      ],
      timeline: [
        { date: new Date().toISOString().split('T')[0], title: 'Joined Organization', description: `${employeeData.name} joined as ${employeeData.designation}.`, type: 'onboarding' }
      ]
    };
    MOCK_EMPLOYEES.push(newEmp);
    return newEmp;
  }
};
