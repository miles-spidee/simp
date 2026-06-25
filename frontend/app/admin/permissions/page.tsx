"use client";

import React, { useEffect, useState } from 'react';
import { Shield, Search, Lock, ShieldAlert, Key, Plus, ChevronDown } from 'lucide-react';
import { permissionService } from '@/src/services/permission.service';
import { Permission } from '@/src/data/mock-permissions';
import { roleService } from '@/src/services/role.service';
import { Role } from '@/src/data/mock-roles';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [permData, roleData] = await Promise.all([
        permissionService.getPermissions(),
        roleService.getRoles()
      ]);
      setPermissions(permData);
      setRoles(roleData);
    } catch (err) {
      console.error('Failed to load permissions data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPermissions = permissions.filter(p => 
    p.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Identity</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-extrabold">Permissions</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Permissions Matrix</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage granular access controls across all system modules.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all">
          <Plus className="h-4 w-4" />
          <span>Add Permission</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">Permission</th>
                <th className="px-4 py-3 border-r border-slate-200">Module</th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center border-r border-slate-200 min-w-[120px]">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermissions.map(perm => (
                <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-200 shadow-[1px_0_0_0_#e2e8f0]">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{perm.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{perm.id}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 border-r border-slate-200">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">{perm.module}</span>
                  </td>
                  {roles.map(role => {
                    const hasPerm = role.permissions?.includes(perm.id);
                    return (
                      <td key={role.id} className="px-4 py-3 text-center border-r border-slate-200">
                        <input 
                          type="checkbox" 
                          checked={hasPerm}
                          readOnly
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
