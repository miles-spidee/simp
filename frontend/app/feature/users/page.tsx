"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin/ui/Table';
import { Search, Filter, Plus, Eye, Edit, Trash, UserX } from 'lucide-react';
import { CreateUserWizard } from '../../../components/admin/users/CreateUserWizard';
import { User } from '@/src/data/mock-users';
import { userService } from '@/src/services/user.service';
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

  useEffect(() => {
    loadUsers();
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
    if (autofillData) {
      // Clear autofill state and redirect back to application lifecycle overview or custom redirect url
      setAutofillData(null);
      const redirectUrl = searchParams.get('redirect') || '/feature/application';
      router.push(redirectUrl);
    }
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
