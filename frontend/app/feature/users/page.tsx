"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/feature/ui/Button';
import { Badge } from '@/components/feature/ui/Badge';
import { EnhancedTable } from '@/components/feature/ui/Table';
import { Plus, Eye, Edit, Trash, UserX, Users } from 'lucide-react';
import { CreateUserWizard } from '../../../components/feature/users/CreateUserWizard';
import { User } from '@/src/types/api/user.types';
import { userService } from '@/src/services/user.service';
import { employeeService, ExtendedEmployee } from '@/src/services/employee.service';
import { studentService, ExtendedStudent } from '@/src/services/student.service';
import { organizationService, ExtendedCollege } from '@/src/services/organization.service';
import { useRouter, useSearchParams } from 'next/navigation';
function UsersPageContent() {
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState(false);

  // Tab and Entity states
  const [activeTab, setActiveTab] = useState<'accounts' | 'employees' | 'students' | 'organizations'>('accounts');

  const [employees, setEmployees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [autofillData, setAutofillData] = useState<{ id?: string; name: string; email: string; phone: string } | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getUsers();
      setData(users);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const emps = await userService.getRegisteredEmployees();
      setEmployees(emps);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  };

  const loadStudents = async () => {
    try {
      const stus = await userService.getRegisteredStudents();
      setStudents(stus);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const loadOrganizations = async () => {
    try {
      const orgs = await userService.getRegisteredOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      console.error('Failed to load organizations', err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadEmployees();
    loadStudents();
    loadOrganizations();
  }, []);

  // Listen to autofill query params
  useEffect(() => {
    const isAutofill = searchParams.get('autofill');
    if (isAutofill) {
      const name = searchParams.get('name') || '';
      const email = searchParams.get('email') || '';
      const phone = searchParams.get('phone') || '';
      setAutofillData({ name, email, phone });
      setIsCreateWizardOpen(true);
    }
  }, [searchParams]);

  const handleUserCreated = () => {
    loadUsers();
    loadEmployees();
    loadStudents();
    loadOrganizations();
    if (autofillData) {
      // Clear autofill state and redirect back to application lifecycle overview or custom redirect url
      setAutofillData(null);
      const redirectUrl = searchParams.get('redirect') || '/feature/application';
      router.push(redirectUrl);
    }
  };

  const getLinkedUser = (email: string) => {
    return data.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  const handleCreateUserForEmployee = (employee: any) => {
    setAutofillData({
      id: `emp-${employee.id}`,
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleCreateUserForStudent = (student: any) => {
    setAutofillData({
      id: `stu-${student.id}`,
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleCreateUserForOrganization = (org: any) => {
    setAutofillData({
      id: `org-${org.id}`,
      name: org.name || '',
      email: org.email || '',
      phone: org.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };



  const handleView = (user: User) => {
    setSelectedUser(user);
    setViewMode(true);
    setIsCreateWizardOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await userService.updateUser(user.id, { status: newStatus });
      loadUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
      alert('Error updating user status.');
    }
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await userService.deleteUser(user.id);
        loadUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
        alert('Error deleting user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Users</h1>
          <p className="text-sm text-text-secondary mt-1">Manage system users, roles, and access.</p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null);
            setViewMode(false);
            setAutofillData(null);
            setIsCreateWizardOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      <div className="flex border-b border-border">
        {[
          { id: 'accounts', label: 'User Accounts', count: data.length },
          { id: 'employees', label: 'Registered Employees', count: employees.length },
          { id: 'students', label: 'Registered Students', count: students.length },
          { id: 'organizations', label: 'Registered Organizations', count: organizations.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === t.id
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-text-secondary hover:border-secondary hover:text-text-primary'
              }`}
          >
            <span>{t.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === t.id
              ? 'bg-blue-100 text-blue-600'
              : 'bg-slate-100 text-text-secondary'
              }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'accounts' && (
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <EnhancedTable<User>
            data={data}
            searchPlaceholder="Search users..."
            itemsPerPage={10}
            loading={loading}
            columns={[
              {
                key: 'name',
                label: 'User',
                render: (user) => (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                ),
              },
              {
                key: 'username',
                label: 'Username',
                render: (user) => <span className="text-text-secondary">{user.username}</span>,
              },
              {
                key: 'email',
                label: 'Email',
                render: (user) => <span className="text-text-secondary">{user.email}</span>,
              },
              {
                key: 'roleName',
                label: 'Role',
                render: (user) => (
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-text-secondary">
                    {user.roleName}
                  </span>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (user) => (
                  <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                    {user.status}
                  </Badge>
                ),
              },
              {
                key: 'date',
                label: 'Created Date',
                render: (user) => <span className="text-text-secondary">{user.date}</span>,
              },
              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (user) => {
                  const isUserActive = user.status === 'Active';
                  return (
                    <div className="flex items-center justify-end gap-2 text-text-secondary">
                      <button onClick={() => handleView(user)} className="p-1 hover:text-blue-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleEdit(user)} className="p-1 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleToggleStatus(user)} className={`p-1 transition-colors ${isUserActive ? 'hover:text-amber-600' : 'hover:text-emerald-600'}`} title={isUserActive ? "Deactivate" : "Activate"}>
                        <UserX className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-1 hover:text-red-600 transition-colors" title="Delete">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <EnhancedTable<ExtendedEmployee>
            data={employees}
            searchPlaceholder="Search registered employees..."
            itemsPerPage={10}
            columns={[
              {
                key: 'name',
                label: 'Employee',
                render: (emp) => {
                  const initials = emp.name
                    ? emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'EM';
                  return (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-text-primary">
                        {initials}
                      </div>
                      <span className="font-medium text-text-primary">{emp.name}</span>
                    </div>
                  );
                },
              },
              {
                key: 'designation',
                label: 'Designation',
                render: (emp) => <span className="text-text-secondary">{emp.designation}</span>,
              },
              {
                key: 'email',
                label: 'Email',
                render: (emp) => <span className="text-text-secondary">{emp.email || ''}</span>,
              },
              {
                key: 'phone',
                label: 'Phone',
                render: (emp) => <span className="text-text-secondary">{emp.phone || 'N/A'}</span>,
              },
              {
                key: 'account',
                label: 'User Account',
                render: (emp) => {
                  return emp.has_account ? (
                    <Badge variant="success">Linked: @{emp.username}</Badge>
                  ) : (
                    <Badge variant="secondary">No Account</Badge>
                  );
                },
              },
              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (emp) => {
                  return emp.has_account ? (
                    <button
                      onClick={() => handleView(getLinkedUser(emp.email) as any)}
                      className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                      title="View User Account"
                      disabled={!getLinkedUser(emp.email)}
                    >
                      <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                    </button>
                  ) : (
                    <Button size="sm" onClick={() => handleCreateUserForEmployee(emp)} className="inline-flex items-center">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                    </Button>
                  );
                },
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <EnhancedTable<ExtendedStudent>
            data={students}
            searchPlaceholder="Search registered students..."
            itemsPerPage={10}
            columns={[
              {
                key: 'name',
                label: 'Student',
                render: (stu) => {
                  const nameVal = stu.name || '';
                  const initials = nameVal
                    ? nameVal.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'ST';
                  return (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-text-primary">
                        {initials}
                      </div>
                      <span className="font-medium text-text-primary">{nameVal || stu.enrollment_number}</span>
                    </div>
                  );
                },
              },
              {
                key: 'college',
                label: 'Enrollment Number',
                render: (stu) => {
                  return <span className="text-text-secondary">{stu.enrollment_number}</span>;
                },
              },
              {
                key: 'email',
                label: 'Email',
                render: (stu) => <span className="text-text-secondary">{stu.email || ''}</span>,
              },
              {
                key: 'phone',
                label: 'Phone',
                render: (stu) => <span className="text-text-secondary">{stu.phone || 'N/A'}</span>,
              },
              {
                key: 'account',
                label: 'User Account',
                render: (stu) => {
                  return stu.has_account ? (
                    <Badge variant="success">Linked: @{stu.username}</Badge>
                  ) : (
                    <Badge variant="secondary">No Account</Badge>
                  );
                },
              },
              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (stu) => {
                  return stu.has_account ? (
                    <button
                      onClick={() => handleView(getLinkedUser(stu.email || '') as any)}
                      className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                      title="View User Account"
                      disabled={!getLinkedUser(stu.email || '')}
                    >
                      <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                    </button>
                  ) : (
                    <Button size="sm" onClick={() => handleCreateUserForStudent(stu)} className="inline-flex items-center">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                    </Button>
                  );
                },
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="bg-white border border-border rounded-xl shadow-xs overflow-hidden">
          <EnhancedTable<ExtendedCollege>
            data={organizations}
            searchPlaceholder="Search registered organizations..."
            itemsPerPage={10}
            columns={[
              {
                key: 'name',
                label: 'Organization',
                render: (org) => {
                  const nameVal = org.name || org.college_name || '';
                  const initials = nameVal
                    ? nameVal.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : 'OR';
                  return (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-text-primary">
                        {initials}
                      </div>
                      <span className="font-medium text-text-primary">{nameVal}</span>
                    </div>
                  );
                },
              },
              {
                key: 'code',
                label: 'Code',
                render: (org) => <span className="text-text-secondary">{org.code || ''}</span>,
              },
              {
                key: 'email',
                label: 'Email',
                render: (org) => <span className="text-text-secondary">{org.email || 'N/A'}</span>,
              },
              {
                key: 'phone',
                label: 'Phone',
                render: (org) => <span className="text-text-secondary">{org.phone || 'N/A'}</span>,
              },
              {
                key: 'account',
                label: 'User Account',
                render: (org) => {
                  return org.has_account ? (
                    <Badge variant="success">Linked: @{org.username}</Badge>
                  ) : (
                    <Badge variant="secondary">No Account</Badge>
                  );
                },
              },
              {
                key: 'actions',
                label: 'Actions',
                className: 'text-right',
                render: (org) => {
                  return org.has_account ? (
                    <button
                      onClick={() => handleView(getLinkedUser(org.email || '') as any)}
                      className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                      title="View User Account"
                      disabled={!getLinkedUser(org.email || '')}
                    >
                      <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                    </button>
                  ) : (
                    <Button size="sm" onClick={() => handleCreateUserForOrganization(org)} className="inline-flex items-center">
                      <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                    </Button>
                  );
                },
              },
            ]}
          />
        </div>
      )}

      <CreateUserWizard
        isOpen={isCreateWizardOpen}
        onClose={() => {
          setIsCreateWizardOpen(false);
          setSelectedUser(null);
          setViewMode(false);
          setAutofillData(null);
        }}
        onUserCreated={handleUserCreated}
        userToEdit={selectedUser}
        viewMode={viewMode}
        autofillData={autofillData}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-text-secondary">Loading Users Portal...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
