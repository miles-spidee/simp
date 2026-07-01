"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Search, ChevronRight, ChevronLeft, Upload, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/feature/ui/Card';
import { Module } from '@/src/types/modules.types';
import { moduleService } from '@/src/services/module.service';
import { permissionService } from '@/src/services/permission.service';
import { roleService } from '@/src/services/role.service';
import { Role } from '@/src/types/api/role.types';

interface CreateRoleWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated?: () => void;
  roleToEdit?: Role | null;
  viewMode?: boolean;
}

const STEPS = ['Role Details', 'Module Registry', 'Review & Create'];

export function CreateRoleWizard({ isOpen, onClose, onRoleCreated, roleToEdit, viewMode }: CreateRoleWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assignedModules, setAssignedModules] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [description, setDescription] = useState('');
  const [roleStatus, setRoleStatus] = useState<'Active' | 'Inactive'>('Active');
  const [moduleSearch, setModuleSearch] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});

  // Icon upload state
  const [iconFile, setIconFile] = useState<string | null>(null);
  const [iconFileName, setIconFileName] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Track previously assigned modules to default-assign 'View' ONLY when newly checked
  const prevAssignedRef = useRef<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const mods = await moduleService.getModules();
        setModules(mods as any);
      } catch (err) {
        console.error('Failed to load modules', err);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchPermissions() {
      const newMap: Record<string, string[]> = {};
      for (const modId of assignedModules) {
        if (!permissionsMap[modId]) {
          newMap[modId] = await permissionService.getPermissionsForModule(modId);
        }
      }
      if (Object.keys(newMap).length > 0) {
        setPermissionsMap(prev => ({...prev, ...newMap}));
      }
    }
    fetchPermissions();
  }, [assignedModules, permissionsMap]);

  // Handle edit vs create loading and cleanup
  useEffect(() => {
    if (isOpen) {
      if (roleToEdit) {
        setRoleName(roleToEdit.name);
        setRoleCode(roleToEdit.code);
        setDescription(roleToEdit.desc);
        setRoleStatus(roleToEdit.status);
        setAssignedModules(roleToEdit.moduleIds || []);
        
        // Parse permissions mapping from role permissions list (format is "moduleId:permissionName")
        const parsedPerms: Record<string, string[]> = {};
        if (roleToEdit.permissions) {
          roleToEdit.permissions.forEach((permStr: any) => {
            const parts = permStr.split(':');
            if (parts.length === 2) {
              const [modId, action] = parts;
              const formattedAction = action.charAt(0).toUpperCase() + action.slice(1);
              if (!parsedPerms[modId]) {
                parsedPerms[modId] = [];
              }
              parsedPerms[modId].push(formattedAction);
            }
          });
        }
        setSelectedPermissions(parsedPerms);
        setIconFile(null);
        setIconFileName(null);
        
        if (viewMode) {
          setCurrentStep(2);
        } else {
          setCurrentStep(0);
        }
      } else {
        setRoleName('');
        setRoleCode('');
        setDescription('');
        setRoleStatus('Active');
        setAssignedModules([]);
        setSelectedPermissions({});
        setIconFile(null);
        setIconFileName(null);
        setCurrentStep(0);
      }
    }
  }, [isOpen, roleToEdit, viewMode]);

  // Set default View permission for newly assigned modules only
  useEffect(() => {
    // Only auto-assign for NEW modules in creation, not edit initialization
    if (!roleToEdit) {
      setSelectedPermissions(prev => {
        const updated = { ...prev };
        assignedModules.forEach(modId => {
          if (!prevAssignedRef.current.includes(modId) && !updated[modId]) {
            updated[modId] = ['View'];
          }
        });
        return updated;
      });
    }
    prevAssignedRef.current = assignedModules;
  }, [assignedModules, roleToEdit]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!roleName.trim() || !roleCode.trim()) {
        alert('Please fill in Role Name and Role Code.');
        return;
      }
    }
    if (currentStep === 1 && assignedModules.length === 0) {
      alert('Please assign at least one module.');
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleModule = (id: string) => {
    if (viewMode) return;
    setAssignedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const togglePermission = (moduleId: string, perm: string) => {
    if (viewMode) return;
    setSelectedPermissions(prev => {
      const current = prev[moduleId] || [];
      const updated = current.includes(perm)
        ? current.filter(p => p !== perm)
        : [...current, perm];
      return { ...prev, [moduleId]: updated };
    });
  };

  const triggerIconUpload = () => {
    if (viewMode) return;
    iconInputRef.current?.click();
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setIconFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRole = async () => {
    if (!roleName.trim() || !roleCode.trim()) {
      alert('Please fill in Role Name and Role Code.');
      return;
    }
    try {
      setIsSubmitting(true);
      const flatPermissions: string[] = [];
      assignedModules.forEach(moduleId => {
        flatPermissions.push(`${moduleId}:view`);
      });

      const roleData = {
        name: (roleName || '').trim(),
        code: (roleCode || '').trim(),
        desc: (description || '').trim(),
        status: roleStatus,
        moduleIds: assignedModules,
        permissions: flatPermissions,
      };

      if (roleToEdit) {
        await roleService.updateRole(roleToEdit.id, roleData);
      } else {
        await roleService.createRole(roleData);
      }

      if (onRoleCreated) {
        onRoleCreated();
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to save role', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Unknown error';
      alert(`Error saving role: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredModules = modules.filter(m =>
    m.name.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const getDrawerTitle = () => {
    if (viewMode) return "View Role Details";
    if (roleToEdit) return "Edit Role";
    return "Create New Role";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Role Name *</label>
                <input 
                  type="text" 
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="e.g. Student" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Role Code *</label>
                <input 
                  type="text" 
                  value={roleCode}
                  onChange={e => setRoleCode(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="e.g. ROLE_STUDENT" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-label">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  rows={3} 
                  placeholder="Brief description of this role's responsibilities" 
                />
              </div>
            </div>
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Role Icon Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Role Icon</label>
                <input 
                  type="file" 
                  ref={iconInputRef} 
                  onChange={handleIconChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={triggerIconUpload}
                  className="mt-1 flex justify-center rounded-md border-2 border-dashed border-border px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="space-y-1 text-center">
                    {iconFile ? (
                      <div className="flex flex-col items-center gap-1">
                        <img src={iconFile} alt="Icon Preview" className="h-10 w-10 object-contain border border-border" />
                        <p className="text-[10px] font-semibold text-emerald-650 truncate max-w-[150px]">Selected: {iconFileName}</p>
                        {!viewMode && <span className="text-[9px] text-text-secondary">Click to change</span>}
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-6 w-6 text-text-secondary" />
                        <div className="flex text-xs text-text-secondary justify-center font-medium">
                          <span className="text-blue-650 hover:text-blue-500">Upload Icon</span>
                        </div>
                        <p className="text-[9px] text-text-secondary">SVG, PNG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div className="space-y-3 md:pt-4">
                <label className="text-sm font-medium text-label">Status</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="roleStatus" 
                      checked={roleStatus === 'Active'}
                      onChange={() => {
                        if (!viewMode) setRoleStatus('Active');
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-primary" 
                    />
                    <span className="text-sm font-medium text-text-primary">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="radio" 
                      name="roleStatus" 
                      checked={roleStatus === 'Inactive'}
                      onChange={() => {
                        if (!viewMode) setRoleStatus('Inactive');
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-primary" 
                    />
                    <span className="text-sm font-medium text-text-primary">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Select Modules</h3>
                <p className="text-xs text-text-secondary">Choose the modules this role will have access to.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input 
                  type="text" 
                  value={moduleSearch}
                  onChange={e => setModuleSearch(e.target.value)}
                  disabled={viewMode}
                  placeholder="Search modules..." 
                  className="w-56 rounded-md border border-border pl-8 pr-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredModules.map((module) => {
                const isSelected = assignedModules.includes(module.id);
                return (
                  <div 
                    key={module.id}
                    onClick={() => toggleModule(module.id)}
                    className={`relative rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                        : 'border-border hover:border-secondary hover:bg-slate-50'
                    } ${viewMode ? 'pointer-events-none' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-border bg-white'}`}>
                        {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-text-primary'}`}>{module.name}</p>
                        <p className="text-xs text-helper mt-1">{(module as any).description || (module as any).desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50">
                <h3 className="font-semibold text-text-primary">Role Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary">Role Name</p>
                    <p className="text-sm font-medium text-text-primary">{roleName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Role Code</p>
                    <p className="text-sm font-medium text-text-primary">{roleCode}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-text-secondary">Description</p>
                    <p className="text-sm font-medium text-text-primary">{description || 'No description provided.'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Status</p>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 mt-1 text-xs font-medium border ${
                      roleStatus === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : 'bg-slate-100 text-text-primary border-border'
                    }`}>
                      {roleStatus}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50">
                <h3 className="font-semibold text-text-primary">Assigned Modules</h3>
              </div>
              <div className="p-4 space-y-2">
                {assignedModules.map(moduleId => {
                  const module = modules.find(m => m.id === moduleId);
                  if (!module) return null;
                  return (
                    <div key={moduleId} className="flex flex-col gap-1 py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        <span className="text-sm font-medium text-text-primary">{module.name}</span>
                        <span className="text-[10px] font-mono text-text-secondary">({module.code})</span>
                      </div>
                      <div className="pl-4 flex flex-wrap gap-1 mt-1">
                        {(selectedPermissions[moduleId] || []).map(perm => (
                          <span key={perm} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {assignedModules.length === 0 && (
                  <p className="text-xs text-text-secondary italic">No modules assigned</p>
                )}
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={getDrawerTitle()}>
      <div className="flex flex-col h-full min-h-0">
        {!viewMode && <Stepper steps={STEPS} currentStep={currentStep} />}
        
        <div className="flex-1 overflow-y-auto bg-white">
          {renderStepContent()}
        </div>
        
        <div className="shrink-0 border-t border-border p-4 bg-slate-50 flex items-center justify-between">
          {viewMode ? (
            <div className="w-full flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={currentStep === 0 ? onClose : handleBack}
                disabled={isSubmitting}
              >
                {currentStep === 0 ? 'Cancel' : (
                  <>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </>
                )}
              </Button>
              
              <Button 
                onClick={currentStep === STEPS.length - 1 ? handleCreateRole : handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Saving...'
                ) : currentStep === STEPS.length - 1 ? (
                  roleToEdit ? 'Save Changes' : 'Create Role'
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
