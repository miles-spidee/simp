"use client";

import React, { useEffect, useState } from 'react';
import { Network, Search, Filter, Plus, ChevronRight, Package, UsersRound, Calendar } from 'lucide-react';
import { allocationService } from '@/src/services/allocation.service';
import { Allocation } from '@/src/data/mock-allocations';
import { studentService } from '@/src/services/student.service';
import { Student } from '@/src/data/mock-students';
import { batchService } from '@/src/services/batch.service';
import { Batch } from '@/src/data/mock-batches';
import { userService } from '@/src/services/user.service';
import { User } from '@/src/data/mock-users';

interface AllocationDetailed extends Allocation {
  studentData?: Student;
  userData?: User;
  batchData?: Batch;
}

export default function AllocationPage() {
  const [allocations, setAllocations] = useState<AllocationDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const allocData = await allocationService.getAllocations();
        const stuData = await studentService.getStudents();
        const batchData = await batchService.getBatches();
        const usersData = await userService.getUsers();
        
        const mergedData = allocData.map(alloc => {
          const student = stuData.find(s => s.id === alloc.studentId);
          const user = usersData.find(u => u.id === student?.userId);
          const batch = batchData.find(b => b.id === alloc.batchId);
          
          return {
            ...alloc,
            studentData: student,
            userData: user,
            batchData: batch
          };
        });
        
        setAllocations(mergedData);
      } catch (err) {
        console.error('Failed to load allocations', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAllocations = allocations.filter(alloc => {
    const searchString = `${alloc.userData?.name || ''} ${alloc.batchData?.name || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const allocatedCount = allocations.filter(a => a.status === 'Allocated').length;
  const transferredCount = allocations.filter(a => a.status === 'Transferred').length;

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
            <span>Lifecycle</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-blue-600 font-extrabold">Allocations</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Batch Allocations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage student placement into learning cohorts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Allocate Students</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{allocations.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Total Records</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{allocatedCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Actively Allocated</div>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Network className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{transferredCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Transferred</div>
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
              placeholder="Search allocations..."
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
                <th className="px-6 py-3 font-semibold text-slate-600">Student</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Assigned Batch</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Allocation Date</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {alloc.userData?.avatar || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{alloc.userData?.name || 'Unknown Student'}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{alloc.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{alloc.batchData?.name || alloc.batchId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{alloc.allocationDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        alloc.status === 'Allocated' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : alloc.status === 'Transferred'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {alloc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm mr-4">Reassign</button>
                      <button className="text-slate-400 hover:text-slate-600 font-semibold text-sm">History</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Network className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-base font-medium text-slate-600">No allocations found</p>
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
