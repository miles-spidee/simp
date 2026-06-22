"use client";

import React, { useEffect, useState } from 'react';
import { UsersIcon, Search, Filter, Plus, ChevronRight, FileDown, MoreVertical } from 'lucide-react';
import { employeeService } from '@/src/services/employee.service';
import { Employee } from '@/src/data/mock-employees';
import { userService } from '@/src/services/user.service';
import { User } from '@/src/data/mock-users';
import { useAuth } from '@/src/context/AuthContext';

interface EmployeeWithUser extends Employee {
  userData?: User;
}

export default function EmployeePage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<EmployeeWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const empData = await employeeService.getEmployees();
        const usersData = await userService.getUsers();
        
        const mergedData = empData.map(emp => ({
          ...emp,
          userData: usersData.find(u => u.id === emp.userId)
        }));
        
        setEmployees(mergedData);
      } catch (err) {
        console.error('Failed to load employees', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const searchString = `${emp.userData?.name || ''} ${emp.designation} ${emp.userData?.email || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Enterprise</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Employees</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your workforce, view designations, and track active statuses.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-blue-600 hover:text-blue-600 bg-white rounded-lg text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 cursor-pointer">
            <FileDown className="h-3.5 w-3.5" />
            <span>Export Roster</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{employees.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Workforce</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{activeEmployees}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Active Employees</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{onLeaveEmployees}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">On Leave</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600">Employee</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Designation</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Department/Org ID</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Join Date</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {emp.userData?.avatar || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{emp.userData?.name || 'Unknown User'}</div>
                          <div className="text-xs text-slate-500">{emp.userData?.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{emp.designation}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                        {emp.organizationId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{emp.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        emp.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : emp.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <UsersIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-slate-600">No employees found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
