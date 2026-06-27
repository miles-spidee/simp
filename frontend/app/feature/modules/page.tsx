"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/feature/ui/Card';
import { Button } from '@/components/feature/ui/Button';
import { Badge } from '@/components/feature/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/feature/ui/Table';
import { Search, Plus, Settings, Eye, Edit, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { moduleService } from '@/src/services/module.service';
import { Module } from '@/src/data/mock-modules';

export default function ModuleRegistryPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields for new module
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
      // Optimistic update
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

  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const search = searchTerm.toLowerCase();
      const nameVal = m.name.toLowerCase();
      const codeVal = m.code.toLowerCase();
      const routeVal = m.route.toLowerCase();
      const idVal = m.id.toLowerCase();
      return nameVal.includes(search) || codeVal.includes(search) || routeVal.includes(search) || idVal.includes(search);
    });
  }, [modules, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>Identity</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-extrabold">Module Registry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">Module Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and register system modules and feature directories.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Register Module
        </Button>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search modules..." 
            className="w-full rounded-md border border-slate-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Name</TableHead>
                <TableHead>Module ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Route Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Loading modules registry...
                  </TableCell>
                </TableRow>
              ) : filteredModules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No modules registered.
                  </TableCell>
                </TableRow>
              ) : (
                filteredModules.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block">{m.name}</span>
                          <span className="text-[11px] text-slate-500 block max-w-[200px] truncate">{m.desc || 'No description provided.'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-700">{m.id}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{m.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-slate-500">{m.route}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.active ? "success" : "secondary"}>
                        {m.active ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleToggleStatus(m)}
                        className={`p-1 transition-colors inline-flex items-center justify-center ${m.active ? 'text-emerald-600 hover:text-red-500' : 'text-slate-400 hover:text-emerald-500'}`}
                        title={m.active ? "Disable Module" : "Enable Module"}
                      >
                        {m.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Register Module Drawer/Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-slide-in">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600 animate-spin" /> Register New Module
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">×</button>
            </div>
            
            <form onSubmit={handleCreateModule}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Module ID (Unique) *</label>
                    <input 
                      type="text" 
                      value={modId}
                      onChange={e => setModId(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="e.g. settings"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">Module Code *</label>
                    <input 
                      type="text" 
                      value={modCode}
                      onChange={e => setModCode(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                      placeholder="e.g. SETTINGS"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Module Name *</label>
                  <input 
                    type="text" 
                    value={modName}
                    onChange={e => setModName(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="e.g. System Settings"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Route Path *</label>
                  <input 
                    type="text" 
                    value={modRoute}
                    onChange={e => setModRoute(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    placeholder="e.g. /feature/settings"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Description</label>
                  <textarea 
                    value={modDesc}
                    onChange={e => setModDesc(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    rows={3}
                    placeholder="Brief description of the module's target scope..."
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
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
