"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/feature/ui/Button';
import { Badge } from '@/components/feature/ui/Badge';
import { EnhancedTable } from '@/components/feature/ui/Table';
import { Plus, Settings, ToggleLeft, ToggleRight } from 'lucide-react';
import { moduleService } from '@/src/services/module.service';
import { Module } from '@/src/data/mock-modules';
import { FEATURE_REGISTRY } from '@/src/core/features/feature-registry';

export default function ModuleRegistryPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modId, setModId] = useState('');
  const [modCode, setModCode] = useState('');
  const [modName, setModName] = useState('');
  const [modRoute, setModRoute] = useState('');
  const [modDesc, setModDesc] = useState('');

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.getModules();
      setModules([...data]);
    } catch (err) {
      console.error('Failed to load modules list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleToggleStatus = async (module: Module) => {
    const newStatus = !module.active;
    try {
      setModules(prev => prev.map(m => m.id === module.id ? { ...m, active: newStatus } : m));
      await moduleService.updateModule(module.id, { active: newStatus });
    } catch (err) {
      console.error('Failed to toggle active state', err);
      alert('Failed to update module state.');
      loadModules();
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modId.trim() || !modCode.trim() || !modName.trim() || !modRoute.trim()) {
      alert('Please fill in Module ID, Code, Name, and Route.');
      return;
    }

    try {
      const exists = modules.some(m => m.id.toLowerCase() === modId.trim().toLowerCase());
      if (exists) {
        alert('A module with this ID already exists.');
        return;
      }

      await moduleService.createModule({
        id: modId.trim(),
        code: modCode.trim().toUpperCase(),
        name: modName.trim(),
        route: modRoute.trim(),
        desc: modDesc.trim()
      });

      setModId('');
      setModCode('');
      setModName('');
      setModRoute('');
      setModDesc('');
      setIsModalOpen(false);
      loadModules();
    } catch (err) {
      console.error('Failed to create module', err);
      alert('Failed to create new module.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
            <span>Identity</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-extrabold">Module Registry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-2">Module Registry</h1>
          <p className="text-sm text-text-secondary mt-1">Manage and register system modules and feature directories.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Register Module
        </Button>
      </div>

      <EnhancedTable<Module>
        data={modules}
        searchPlaceholder="Search modules..."
        loading={loading}
        emptyMessage="No modules registered."
        columns={[
          {
            key: 'name',
            label: 'Module Name',
            render: (m) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center font-bold text-text-primary">
                  {(() => {
                    const feature = FEATURE_REGISTRY.find(f => f.moduleId === m.id);
                    if (feature && feature.icon) {
                      const Icon = feature.icon;
                      return <Icon className="h-4 w-4 text-primary" />;
                    }
                    return m.name.slice(0, 2).toUpperCase();
                  })()}
                </div>
                <div>
                  <span className="font-semibold text-text-primary block">{m.name}</span>
                  <span className="text-[11px] text-text-secondary block max-w-[200px] truncate">{m.desc || 'No description provided.'}</span>
                </div>
              </div>
            )
          },
          { key: 'id', label: 'Module ID', render: (m) => <span className="font-mono text-xs text-text-primary">{m.id}</span> },
          { key: 'code', label: 'Code', render: (m) => <Badge variant="secondary">{m.code}</Badge> },
          { key: 'route', label: 'Route Path', render: (m) => <span className="font-mono text-xs text-text-secondary">{m.route}</span> },
          {
            key: 'active',
            label: 'Status',
            render: (m) => <Badge variant={m.active ? "success" : "secondary"}>{m.active ? "Enabled" : "Disabled"}</Badge>
          },
          {
            key: 'actions',
            label: 'Actions',
            className: 'text-right',
            render: (m) => (
              <button
                onClick={() => handleToggleStatus(m)}
                className={`p-1 transition-colors inline-flex items-center justify-center ${m.active ? 'text-emerald-600 hover:text-red-500' : 'text-text-secondary hover:text-emerald-500'}`}
                title={m.active ? "Disable Module" : "Enable Module"}
              >
                {m.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            )
          },
        ]}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-border overflow-hidden animate-slide-in">
            <div className="px-6 py-4 bg-slate-50 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600 animate-spin" /> Register New Module
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text-primary font-bold text-xl">×</button>
            </div>
            
            <form onSubmit={handleCreateModule}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-label">Module ID (Unique) *</label>
                    <input 
                      type="text" 
                      value={modId}
                      onChange={e => setModId(e.target.value)}
                      className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                      placeholder="e.g. settings"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-label">Module Code *</label>
                    <input 
                      type="text" 
                      value={modCode}
                      onChange={e => setModCode(e.target.value)}
                      className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                      placeholder="e.g. SETTINGS"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-label">Module Name *</label>
                  <input 
                    type="text" 
                    value={modName}
                    onChange={e => setModName(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="e.g. System Settings"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-label">Route Path *</label>
                  <input 
                    type="text" 
                    value={modRoute}
                    onChange={e => setModRoute(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="e.g. /feature/settings"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-label">Description</label>
                  <textarea 
                    value={modDesc}
                    onChange={e => setModDesc(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                    rows={3}
                    placeholder="Brief description of the module's target scope..."
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Registration</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
