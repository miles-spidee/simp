"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/feature/ui/Card';
import { Button } from '@/components/feature/ui/Button';
import { Search, Plus, Shield, Users, Edit, Trash, Eye } from 'lucide-react';
import { CreateRoleWizard } from '../../../components/feature/roles/CreateRoleWizard';
import { Role } from '@/src/data/mock-roles';
import { roleService } from '@/src/services/role.service';

export default function RolesPage() {
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState(false);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err) {
      console.error('Failed to load roles', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadRoles();
  }, []);

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setViewMode(true);
    setIsCreateWizardOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setViewMode(false);
    setIsCreateWizardOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await roleService.deleteRole(role.id);
        loadRoles();
      } catch (err) {
        console.error('Failed to delete role', err);
        alert('Error deleting role.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles</h1>
          <p className="text-sm text-slate-500 mt-1">Manage system roles, permissions, and module access.</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedRole(null);
            setViewMode(false);
            setIsCreateWizardOpen(true);
          }} 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Role
        </Button>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search roles..." 
            className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            Loading roles...
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            No roles found.
          </div>
        ) : (
          roles.map((role) => (
            <Card key={role.id} className="flex flex-col hover:shadow-md transition-shadow bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${role.bg}`}>
                    <Shield className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleView(role)} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-slate-50"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(role)} 
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-slate-50"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(role)} 
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-slate-50"
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">{role.name}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">{role.desc}</p>
              </CardHeader>
              <div className="flex-1"></div>
              <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Shield className="h-4 w-4 text-slate-400" />
                  {role.modulesCount} Modules
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  {role.usersCount} Users
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <CreateRoleWizard 
        isOpen={isCreateWizardOpen} 
        onClose={() => {
          setIsCreateWizardOpen(false);
          setSelectedRole(null);
          setViewMode(false);
        }} 
        onRoleCreated={loadRoles}
        roleToEdit={selectedRole}
        viewMode={viewMode}
      />
    </div>
  );
}
