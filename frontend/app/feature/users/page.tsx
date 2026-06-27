"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Card, CardContent } from '@/components/feature/ui/Card';
import { Button } from '@/components/feature/ui/Button';
import { Badge } from '@/components/feature/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/feature/ui/Table';
import { Search, Filter, Plus, Eye, Edit, Trash, UserX, Users } from 'lucide-react';
import { CreateUserWizard } from '../../../components/feature/users/CreateUserWizard';
import { User } from '@/src/data/mock-users';
import { userService } from '@/src/services/user.service';
import { employeeService, ExtendedEmployee } from '@/src/services/employee.service';
import { studentService, ExtendedStudent } from '@/src/services/student.service';
import { organizationService, ExtendedCollege } from '@/src/services/organization.service';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<User>();

function UsersPageContent() {
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState(false);

  // Tab and Entity states
  const [activeTab, setActiveTab] = useState<'accounts' | 'employees' | 'students' | 'organizations'>('accounts');
  
  const [employees, setEmployees] = useState<ExtendedEmployee[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [empPage, setEmpPage] = useState(0);
  
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [stuPage, setStuPage] = useState(0);
  
  const [organizations, setOrganizations] = useState<ExtendedCollege[]>([]);
  const [organizationSearch, setOrganizationSearch] = useState('');
  const [orgPage, setOrgPage] = useState(0);
  
  const empPageSize = 10;

  const searchParams = useSearchParams();
  const router = useRouter();
  const [autofillData, setAutofillData] = useState<{ name: string; email: string; phone: string } | null>(null);

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
      const emps = await employeeService.getEmployees();
      setEmployees(emps);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  };

  const loadStudents = async () => {
    try {
      const stus = await studentService.getStudents();
      setStudents(stus);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationService.getOrganizations();
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

  const handleCreateUserForEmployee = (employee: ExtendedEmployee) => {
    setAutofillData({
      name: employee.name,
      email: employee.email || employee.official_email,
      phone: employee.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleCreateUserForStudent = (student: ExtendedStudent) => {
    setAutofillData({
      name: student.name || student.personalInfo?.name || '',
      email: student.email || student.official_email || student.personalInfo?.email || '',
      phone: student.phone || student.personalInfo?.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleCreateUserForOrganization = (org: ExtendedCollege) => {
    setAutofillData({
      name: org.name || org.college_name || '',
      email: org.email || '',
      phone: org.phone || ''
    });
    setSelectedUser(null);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const search = employeeSearch.toLowerCase();
      const email = (emp.email || emp.official_email || '').toLowerCase();
      const designation = (emp.designation || emp.roleName || '').toLowerCase();
      return (
        emp.name.toLowerCase().includes(search) ||
        email.includes(search) ||
        (emp.phone && emp.phone.includes(search)) ||
        designation.includes(search)
      );
    });
  }, [employees, employeeSearch]);

  const paginatedEmployees = useMemo(() => {
    const start = empPage * empPageSize;
    return filteredEmployees.slice(start, start + empPageSize);
  }, [filteredEmployees, empPage]);

  const filteredStudents = useMemo(() => {
    return students.filter(stu => {
      const search = studentSearch.toLowerCase();
      const nameVal = stu.name || stu.personalInfo?.name || '';
      const emailVal = stu.email || stu.official_email || stu.personalInfo?.email || '';
      const phoneVal = stu.phone || stu.personalInfo?.phone || '';
      return (
        nameVal.toLowerCase().includes(search) ||
        emailVal.toLowerCase().includes(search) ||
        phoneVal.includes(search)
      );
    });
  }, [students, studentSearch]);

  const paginatedStudents = useMemo(() => {
    const start = stuPage * empPageSize;
    return filteredStudents.slice(start, start + empPageSize);
  }, [filteredStudents, stuPage]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const search = organizationSearch.toLowerCase();
      const nameVal = org.name || org.college_name || '';
      const emailVal = org.email || '';
      const phoneVal = org.phone || '';
      const codeVal = org.code || org.college_code || '';
      return (
        nameVal.toLowerCase().includes(search) ||
        emailVal.toLowerCase().includes(search) ||
        phoneVal.includes(search) ||
        codeVal.toLowerCase().includes(search)
      );
    });
  }, [organizations, organizationSearch]);

  const paginatedOrganizations = useMemo(() => {
    const start = orgPage * empPageSize;
    return filteredOrganizations.slice(start, start + empPageSize);
  }, [filteredOrganizations, orgPage]);

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

  const columns = [
    columnHelper.accessor('name', {
      header: 'User',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
            {info.row.original.avatar}
          </div>
          <span className="font-medium text-slate-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('username', {
      header: 'Username',
      cell: info => <span className="text-slate-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <span className="text-slate-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('roleName', {
      header: 'Role',
      cell: info => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge variant={info.getValue() === 'Active' ? 'success' : 'secondary'}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('date', {
      header: 'Created Date',
      cell: info => <span className="text-slate-500">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: info => {
        const user = info.row.original;
        const isUserActive = user.status === 'Active';
        return (
          <div className="flex items-center justify-end gap-2 text-slate-400">
            <button 
              onClick={() => handleView(user)} 
              className="p-1 hover:text-blue-600 transition-colors" 
              title="View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleEdit(user)} 
              className="p-1 hover:text-blue-600 transition-colors" 
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleToggleStatus(user)} 
              className={`p-1 transition-colors ${isUserActive ? 'hover:text-amber-600' : 'hover:text-emerald-600'}`} 
              title={isUserActive ? "Deactivate" : "Activate"}
            >
              <UserX className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleDelete(user)} 
              className="p-1 hover:text-red-600 transition-colors" 
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage system users, roles, and access.</p>
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

      <div className="flex border-b border-slate-200">
        {[
          { id: 'accounts', label: 'User Accounts', count: data.length },
          { id: 'employees', label: 'Registered Employees', count: employees.length },
          { id: 'students', label: 'Registered Students', count: students.length },
          { id: 'organizations', label: 'Registered Organizations', count: organizations.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === t.id 
                ? 'border-blue-600 text-blue-600 font-semibold' 
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <span>{t.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === t.id 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'accounts' && (
        <Card>
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search users..." 
                className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
                {table.getFilteredRowModel().rows.length} entries
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'employees' && (
        <Card>
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={employeeSearch}
                onChange={e => {
                  setEmployeeSearch(e.target.value);
                  setEmpPage(0);
                }}
                placeholder="Search registered employees..." 
                className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmployees.map(emp => {
                    const emailVal = emp.email || emp.official_email || '';
                    const linkedUser = getLinkedUser(emailVal);
                    const isLinked = !!linkedUser;
                    const initials = emp.name
                      ? emp.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'EM';

                    return (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700">
                              {initials}
                            </div>
                            <span className="font-medium text-slate-900">{emp.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{emp.designation || emp.roleName}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{emailVal}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{emp.phone || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {isLinked ? (
                            <Badge variant="success">
                              Linked: @{linkedUser.username}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              No Account
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isLinked ? (
                            <button
                              onClick={() => handleView(linkedUser)}
                              className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                              title="View User Account"
                            >
                              <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                            </button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleCreateUserForEmployee(emp)}
                              className="inline-flex items-center"
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filteredEmployees.length === 0 ? 0 : empPage * empPageSize + 1} to{' '}
                {Math.min((empPage + 1) * empPageSize, filteredEmployees.length)} of{' '}
                {filteredEmployees.length} entries
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEmpPage(prev => Math.max(0, prev - 1))}
                  disabled={empPage === 0}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEmpPage(prev => prev + 1)}
                  disabled={(empPage + 1) * empPageSize >= filteredEmployees.length}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'students' && (
        <Card>
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={studentSearch}
                onChange={e => {
                  setStudentSearch(e.target.value);
                  setStuPage(0);
                }}
                placeholder="Search registered students..." 
                className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>College / Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map(stu => {
                    const nameVal = stu.name || stu.personalInfo?.name || '';
                    const emailVal = stu.email || stu.official_email || stu.personalInfo?.email || '';
                    const phoneVal = stu.phone || stu.personalInfo?.phone || '';
                    const collegeVal = stu.academicInfo?.college || 'N/A';
                    const deptVal = stu.academicInfo?.department || '';
                    const linkedUser = getLinkedUser(emailVal);
                    const isLinked = !!linkedUser;
                    const initials = nameVal
                      ? nameVal
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'ST';

                    return (
                      <TableRow key={stu.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700">
                              {initials}
                            </div>
                            <span className="font-medium text-slate-900">{nameVal}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">
                            {collegeVal} {deptVal ? `(${deptVal})` : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{emailVal}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{phoneVal || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {isLinked ? (
                            <Badge variant="success">
                              Linked: @{linkedUser.username}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              No Account
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isLinked ? (
                            <button
                              onClick={() => handleView(linkedUser)}
                              className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                              title="View User Account"
                            >
                              <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                            </button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleCreateUserForStudent(stu)}
                              className="inline-flex items-center"
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filteredStudents.length === 0 ? 0 : stuPage * empPageSize + 1} to{' '}
                {Math.min((stuPage + 1) * empPageSize, filteredStudents.length)} of{' '}
                {filteredStudents.length} entries
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStuPage(prev => Math.max(0, prev - 1))}
                  disabled={stuPage === 0}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setStuPage(prev => prev + 1)}
                  disabled={(stuPage + 1) * empPageSize >= filteredStudents.length}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'organizations' && (
        <Card>
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                value={organizationSearch}
                onChange={e => {
                  setOrganizationSearch(e.target.value);
                  setOrgPage(0);
                }}
                placeholder="Search registered organizations..." 
                className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrganizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No organizations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrganizations.map(org => {
                    const nameVal = org.name || org.college_name || '';
                    const codeVal = org.code || org.college_code || '';
                    const emailVal = org.email || '';
                    const phoneVal = org.phone || '';
                    const linkedUser = getLinkedUser(emailVal);
                    const isLinked = !!linkedUser;
                    const initials = nameVal
                      ? nameVal
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'OR';

                    return (
                      <TableRow key={org.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700">
                              {initials}
                            </div>
                            <span className="font-medium text-slate-900">{nameVal}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-650">{codeVal}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{emailVal || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-600">{phoneVal || 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {isLinked ? (
                            <Badge variant="success">
                              Linked: @{linkedUser.username}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              No Account
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isLinked ? (
                            <button
                              onClick={() => handleView(linkedUser)}
                              className="p-1 hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                              title="View User Account"
                            >
                              <Eye className="h-4 w-4 text-slate-455 hover:text-blue-600" />
                            </button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleCreateUserForOrganization(org)}
                              className="inline-flex items-center"
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" /> Create User
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {filteredOrganizations.length === 0 ? 0 : orgPage * empPageSize + 1} to{' '}
                {Math.min((orgPage + 1) * empPageSize, filteredOrganizations.length)} of{' '}
                {filteredOrganizations.length} entries
              </span>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOrgPage(prev => Math.max(0, prev - 1))}
                  disabled={orgPage === 0}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOrgPage(prev => prev + 1)}
                  disabled={(orgPage + 1) * empPageSize >= filteredOrganizations.length}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading Users Portal...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
