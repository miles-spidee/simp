"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Search, CheckCircle2, ChevronRight, ChevronLeft, Shield, Upload, Users, Sparkles, Key } from 'lucide-react';
import { Card } from '@/components/feature/ui/Card';
import { Role } from '@/src/types/api/role.types';
import { Module } from '@/src/types/modules.types';
import { roleService } from '@/src/services/role.service';
import { moduleService } from '@/src/services/module.service';
import { userService } from '@/src/services/user.service';
import { organizationService, ExtendedCollege } from '@/src/services/organization.service';
import { User } from '@/src/types/api/user.types';

interface CreateUserWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated?: () => void;
  userToEdit?: User | null;
  viewMode?: boolean;
  autofillData?: {
    id?: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}

const STEPS = ['Basic Information', 'Role Assignment', 'Module Override', 'Review & Create'];

interface AutofillEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Employee' | 'Student' | 'Organization';
  detail: string;
}

export function CreateUserWizard({ isOpen, onClose, onUserCreated, userToEdit, viewMode, autofillData }: CreateUserWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [assignedModules, setAssignedModules] = useState<string[]>([]);
  
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [unlinkedEntities, setUnlinkedEntities] = useState<AutofillEntity[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [existingUsers, setExistingUsers] = useState<User[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [accountValidationPeriod, setAccountValidationPeriod] = useState('');
  const [moduleSearch, setModuleSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedRoles, loadedModules, loadedEmployees, loadedStudents, loadedOrganizations, loadedUsers] = await Promise.all([
          roleService.getRoles(),
          moduleService.getModules(),
          userService.getRegisteredEmployees(),
          userService.getRegisteredStudents(),
          userService.getRegisteredOrganizations(),
          userService.getUsers()
        ]);
        
        const entities: AutofillEntity[] = [];

        loadedEmployees.forEach(emp => {
          if (!emp.has_account) {
            entities.push({
              id: `emp-${emp.id}`,
              name: emp.name || '',
              email: emp.email || '',
              phone: emp.phone || '',
              type: 'Employee',
              detail: emp.designation || ''
            });
          }
        });

        loadedStudents.forEach(stu => {
          if (!stu.has_account) {
            entities.push({
              id: `stu-${stu.id}`,
              name: stu.name || '',
              email: stu.email || '',
              phone: stu.phone || '',
              type: 'Student',
              detail: stu.enrollment_number || ''
            });
          }
        });

        loadedOrganizations.forEach(org => {
          if (!org.has_account) {
            entities.push({
              id: `org-${org.id}`,
              name: org.name || '',
              email: org.email || '',
              phone: org.phone || '',
              type: 'Organization',
              detail: org.code || ''
            });
          }
        });

        setRoles(loadedRoles);
        setModules(loadedModules as any);
        setUnlinkedEntities(entities);
        setExistingUsers(loadedUsers);
      } catch (err) {
        console.error('Failed to load user wizard data', err);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Pre-populate fields if in Edit/View mode
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      Promise.resolve().then(() => {
        if (!isMounted) return;
        
        // Reset selected entity when opening
        setSelectedEntityId('');

        if (userToEdit) {
          setFullName(userToEdit.name);
          setUsername(userToEdit.username);
          setEmail(userToEdit.email);
          setPhone('');
          setPassword('••••••••');
          setConfirmPassword('••••••••');
          setSelectedRole(userToEdit.roleId);
          
          const loadAssigned = async () => {
            const uMods = await userService.getUserModules(userToEdit.id);
            if (isMounted) {
              setAssignedModules(uMods.map(m => m.id));
            }
          };
          loadAssigned();
          
          setAvatar(typeof userToEdit.avatar === 'string' && userToEdit.avatar.length > 2 ? userToEdit.avatar : null);
          setAvatarName(null);
          
          if (viewMode) {
            setCurrentStep(3);
          } else {
            setCurrentStep(0);
          }
        } else if (autofillData) {
          if (autofillData.id) {
            setSelectedEntityId(autofillData.id);
          }
          setFullName(autofillData.name);
          setUsername('');
          setEmail(autofillData.email);
          setPhone(autofillData.phone);
          setPassword('');
          setConfirmPassword('');
          setSelectedRole(null);
          setAssignedModules([]);
          setAvatar(null);
          setAvatarName(null);
          setCurrentStep(0);
        } else {
          setFullName('');
          setUsername('');
          setEmail('');
          setPhone('');
          setPassword('');
          setConfirmPassword('');
          setSelectedRole(null);
          setAssignedModules([]);
          setAvatar(null);
          setAvatarName(null);
          setAccountValidationPeriod('');
          setCurrentStep(0);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, userToEdit, viewMode, autofillData]);

  const handleEntitySelect = (entityId: string) => {
    setSelectedEntityId(entityId);
    if (!entityId) {
      setFullName('');
      setEmail('');
      setPhone('');
      return;
    }

    const entity = unlinkedEntities.find(e => e.id === entityId);
    if (entity) {
      setFullName(entity.name);
      setEmail(entity.email);
      setPhone(entity.phone);
    }
  };

  const generateUsername = () => {
    if (!fullName.trim()) {
      alert("Please enter a Full Name first to generate a username.");
      return;
    }
    
    // Get first word of full name and clean it to alphanumeric only
    const base = fullName.trim().split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
    const cleanBase = base || 'User';
    
    let counter = 1;
    let candidate = '';
    let isUnique = false;
    
    while (!isUnique) {
      const suffix = String(counter).padStart(3, '0'); // '001', '002', etc.
      candidate = `${cleanBase}${suffix}`;
      
      // Check if username already exists
      const match = existingUsers.some(u => u.username.toLowerCase() === candidate.toLowerCase());
      if (!match) {
        isUnique = true;
      } else {
        counter++;
      }
    }
    
    setUsername(candidate);
  };

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + symbols;
    
    let pass = '';
    // Ensure at least one of each category for strong password
    pass += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    pass += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pass += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    for (let i = 0; i < 8; i++) {
      pass += all.charAt(Math.floor(Math.random() * all.length));
    }
    
    // Shuffle the generated characters
    const shuffled = pass.split('').sort(() => 0.5 - Math.random()).join('');
    
    setPassword(shuffled);
    setConfirmPassword(shuffled);
  };

  // When role changes, update assigned modules to match the role's default modules
  useEffect(() => {
    let isMounted = true;
    // Only auto-update default modules for NEW users, not during edit mode initialization
    if (!userToEdit && selectedRole && modules.length > 0) {
      const roleObj = roles.find(r => r.id === selectedRole);
      if (roleObj && roleObj.moduleIds) {
        Promise.resolve().then(() => {
          if (isMounted) {
            setAssignedModules(roleObj.moduleIds);
          }
        });
      }
    }
    return () => {
      isMounted = false;
    };
  }, [selectedRole, modules, roles, userToEdit]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
        alert('Please fill in Name, Username, Email, and Password.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
    }
    if (currentStep === 1 && !selectedRole) {
      alert('Please select a role.');
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

  const triggerFileUpload = () => {
    if (viewMode) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !selectedRole) {
      alert('Please fill in Name, Username, Email, and select a Role.');
      return;
    }
    try {
      setIsSubmitting(true);
      const roleObj = roles.find(r => r.id === selectedRole);
      const roleName = roleObj ? roleObj.name : 'User';
      
      let entityType = undefined;
      let entityId = undefined;
      if (selectedEntityId) {
        const parts = selectedEntityId.split('-');
        const typeMap: Record<string, string> = {
          'emp': 'employee',
          'stu': 'student',
          'org': 'organization'
        };
        entityType = typeMap[parts[0]];
        entityId = parts.slice(1).join('-');
      }

      const userData = {
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password,
        roleId: selectedRole,
        roleName: roleName,
        status: userToEdit ? userToEdit.status : ('Active' as const),
        moduleOverrides: assignedModules.filter(id => {
          const defaultModuleIds = roleObj?.moduleIds || [];
          return !defaultModuleIds.includes(id);
        }),
        avatar: avatar || fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        sendEmail: sendEmail,
        entityType: entityType,
        entityId: entityId,
        forcePasswordChange: forcePasswordChange,
        accountValidationPeriod: accountValidationPeriod ? parseInt(accountValidationPeriod, 10) : undefined
      };
      
      if (userToEdit) {
        await userService.updateUser(userToEdit.id, userData as any);
      } else {
        await userService.createUser(userData as any);
      }
      
      if (onUserCreated) {
        onUserCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to save user', err);
      alert('Error saving user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const getDrawerTitle = () => {
    if (viewMode) return "View User Details";
    if (userToEdit) return "Edit User";
    return "Create New User";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 p-6">
            {!userToEdit && !autofillData && unlinkedEntities.length > 0 && (
              <div className="bg-slate-50 border border-border rounded-lg p-4 space-y-2">
                <label className="text-sm font-semibold text-label flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Link to Registered Entity (Autofill)
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedEntityId}
                    onChange={e => handleEntitySelect(e.target.value)}
                    className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Select an unlinked employee/student/org to autofill --</option>
                    {['Employee', 'Student', 'Organization'].map(t => {
                      const groupEntities = unlinkedEntities.filter(e => e.type === t);
                      if (groupEntities.length === 0) return null;
                      return (
                        <optgroup key={t} label={`${t}s`}>
                          {groupEntities.map(ent => (
                            <option key={ent.id} value={ent.id}>
                              [{t}] {ent.name} ({ent.detail}) - {ent.email}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  {selectedEntityId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEntitySelect('')}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-text-secondary">
                  Select an employee, student, or organization registered in the database to autofill Name, Email, and Phone.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Full Name *</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-label">Username *</label>
                  {!viewMode && (
                    <button
                      type="button"
                      onClick={generateUsername}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 focus:outline-none"
                    >
                      <Sparkles className="h-3 w-3" /> Generate Unique
                    </button>
                  )}
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="johndoe001" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-label">Password *</label>
                  {!viewMode && (
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 focus:outline-none"
                    >
                      <Key className="h-3 w-3" /> Generate Password
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="••••••••" 
                />
                {password && password !== '••••••••' && !viewMode && (
                  <p className="text-[11px] font-mono text-text-secondary bg-slate-100 px-2 py-1 rounded border border-dashed border-border">
                    Generated: <span className="font-bold text-text-primary select-all">{password}</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-label">Confirm Password *</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={viewMode}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-705 text-label">Profile Picture</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={triggerFileUpload}
                  className="mt-1 flex justify-center rounded-md border-2 border-dashed border-border px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="space-y-1 text-center">
                    {avatar ? (
                      <div className="flex flex-col items-center gap-1">
                        <img src={avatar} alt="Avatar Preview" className="h-12 w-12 rounded-full object-cover border border-border" />
                        <p className="text-[10px] font-semibold text-emerald-650 truncate max-w-[150px]">Selected: {avatarName || 'User Avatar'}</p>
                        {!viewMode && <span className="text-[9px] text-text-secondary">Click to change</span>}
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-6 w-6 text-text-secondary" />
                        <div className="flex text-xs text-text-secondary justify-center font-medium">
                          <span className="text-blue-650 hover:text-blue-500">Upload photo</span>
                        </div>
                        <p className="text-[9px] text-text-secondary">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Login Preferences */}
              <div className="space-y-3 md:pt-8">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={sendEmail}
                    onChange={e => setSendEmail(e.target.checked)}
                    disabled={viewMode}
                    className="h-4 w-4 rounded border-border text-blue-600 focus:ring-primary disabled:opacity-50" 
                  />
                  <span className="text-sm text-text-primary">Send Credentials By Email</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={forcePasswordChange}
                    onChange={e => setForcePasswordChange(e.target.checked)}
                    disabled={viewMode}
                    className="h-4 w-4 rounded border-border text-blue-600 focus:ring-primary disabled:opacity-50" 
                  />
                  <span className="text-sm text-text-primary">Force Password Change on Login</span>
                </label>
                <div className="pt-2">
                  <label className="text-sm font-medium text-label block mb-1">Account Validation Period (Days)</label>
                  <input 
                    type="number" 
                    value={accountValidationPeriod}
                    onChange={e => setAccountValidationPeriod(e.target.value)}
                    disabled={viewMode}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                    placeholder="e.g. 365 (Leave empty for unlimited)" 
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex h-full p-6 gap-6">
            <div className="flex-1 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Select Role</h3>
              <div className="grid gap-3">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    onClick={() => {
                      if (!viewMode) setSelectedRole(role.id);
                    }}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedRole === role.id 
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                        : 'border-border hover:border-secondary hover:bg-slate-50'
                    } ${viewMode ? 'pointer-events-none' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${selectedRole === role.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-text-secondary'}`}>
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${selectedRole === role.id ? 'text-blue-900' : 'text-text-primary'}`}>{role.name}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{role.desc}</p>
                        </div>
                      </div>
                      {selectedRole === role.id && (
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="w-1/3 shrink-0">
              <div className="sticky top-0 rounded-lg border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Modules Inherited</h3>
                {selectedRole ? (
                  <ul className="space-y-2">
                    {assignedModules.map(id => {
                      const mod = modules.find(m => m.id === id);
                      return mod ? (
                        <li key={id} className="flex items-center gap-2 text-sm text-text-secondary">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {mod.name}
                        </li>
                      ) : null;
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-text-secondary italic">Select a role to preview modules.</p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex h-full p-6 gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Available Modules</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input 
                    type="text" 
                    value={moduleSearch}
                    onChange={e => setModuleSearch(e.target.value)}
                    disabled={viewMode}
                    placeholder="Search..." 
                    className="w-48 rounded-md border border-border pl-8 pr-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {filteredModules.map((module) => {
                  const isAssigned = assignedModules.includes(module.id);
                  return (
                    <div 
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all ${
                        isAssigned ? 'border-blue-200 bg-blue-50/30' : 'border-border hover:bg-slate-50'
                      } ${viewMode ? 'pointer-events-none' : ''}`}
                    >
                      <span className="text-sm font-medium text-text-primary">{module.name}</span>
                      <div className={`flex h-5 w-5 items-center justify-center rounded border ${isAssigned ? 'border-blue-600 bg-blue-600 text-white' : 'border-border bg-white'}`}>
                        {isAssigned && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="w-1/3 shrink-0">
              <div className="sticky top-0 rounded-lg border border-border bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Final Access</h3>
                <ul className="space-y-2">
                  {assignedModules.map(id => {
                    const mod = modules.find(m => m.id === id);
                    return mod ? (
                      <li key={id} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {mod.name}
                      </li>
                    ) : null;
                  })}
                  {assignedModules.length === 0 && (
                    <p className="text-sm text-text-secondary italic">No modules assigned.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50">
                <h3 className="font-semibold text-text-primary">User Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {avatar && (
                    <div className="col-span-2 flex items-center gap-3">
                      <img src={avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-border" />
                      <div>
                        <p className="text-xs text-text-secondary">Avatar Image</p>
                        <p className="text-sm font-semibold text-text-primary">Custom Profile Picture</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-secondary">Full Name</p>
                    <p className="text-sm font-medium text-text-primary">{fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Email</p>
                    <p className="text-sm font-medium text-text-primary">{email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Username</p>
                    <p className="text-sm font-medium text-text-primary">{username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Selected Role</p>
                    <p className="text-sm font-medium text-text-primary">
                      {selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'None'}
                    </p>
                  </div>
                  {!viewMode && (
                    <div>
                      <p className="text-xs text-text-secondary">Credentials</p>
                      <p className="text-sm font-medium text-text-primary">
                        {sendEmail ? 'Send via Email' : 'Do not send'}
                      </p>
                    </div>
                  )}
                  {userToEdit && (
                    <div>
                      <p className="text-xs text-text-secondary">User Status</p>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold mt-1 border ${
                        userToEdit.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-250' 
                          : 'bg-slate-100 text-text-primary border-slate-250'
                      }`}>
                        {userToEdit.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50">
                <h3 className="font-semibold text-text-primary">Assigned Modules</h3>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {assignedModules.map(id => {
                  const mod = modules.find(m => m.id === id);
                  return mod ? (
                    <span key={id} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {mod.name}
                    </span>
                  ) : null;
                })}
                {assignedModules.length === 0 && (
                  <span className="text-xs text-text-secondary italic">No modules assigned</span>
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
                onClick={currentStep === STEPS.length - 1 ? handleCreateUser : handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Saving...'
                ) : currentStep === STEPS.length - 1 ? (
                  userToEdit ? 'Save Changes' : 'Create User'
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
