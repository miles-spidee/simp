'use client';
import { useState, useEffect } from 'react';
import DocumentTable from './DocumentTable';
import { DocumentService } from '@/src/services/document.service';
import { GeneratedDocument, DocumentTemplate } from '@/src/types/document.types';
import { FileText, FilePlus, Copy, Plus, Loader2 } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

export default function DocumentDashboard() {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerLettersCount, setOfferLettersCount] = useState(0);

  // Drawers
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  // Generate Doc Form
  const [docType, setDocType] = useState<'Offer Letter' | 'Joining Letter' | 'Internship Letter' | 'Completion Certificate' | 'Recommendation Letter'>('Offer Letter');
  const [studentName, setStudentName] = useState('');
  const [program, setProgram] = useState('Full Stack Web Development');
  const [stipend, setStipend] = useState('15000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const docs = await DocumentService.getGeneratedDocuments();
      const tpls = await DocumentService.getTemplates();
      setDocuments(docs);
      setTemplates(tpls);
      
      const count = docs.filter(d => d.type === 'Offer Letter').length;
      setOfferLettersCount(count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    setIsSubmitting(true);
    try {
      await DocumentService.createGeneratedDocument({
        studentName,
        program,
        type: docType,
        metadata: {
          generatedBy: 'Administrator Console',
          stipend: stipend
        }
      });

      setStudentName('');
      setProgram('Full Stack Web Development');
      setStipend('15000');
      setIsGenerateOpen(false);

      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-650" />
            Document Generation
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Generate dynamic PDFs from templates for offers, reports, and certificates.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTemplatesOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-text-primary rounded-xl hover:bg-slate-50 transition-all font-bold text-sm cursor-pointer"
          >
            <Copy className="h-4 w-4" /> Templates
          </button>
          <button 
            onClick={() => setIsGenerateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-bold text-sm shadow-lg shadow-slate-900/10 cursor-pointer"
          >
            <FilePlus className="h-4 w-4" /> Generate Document
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Generated Docs</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{documents.length}</p>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Active Offer Letters</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{offerLettersCount}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Copy className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Templates Available</p>
            <p className="text-3xl font-extrabold text-text-primary mt-1 font-mono">{templates.length}</p>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <FilePlus className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Document Table */}
      <DocumentTable 
        documents={documents} 
        loading={loading} 
        onUpdate={loadData} 
      />

      {/* --- DRAWERS --- */}

      {/* 1. Templates list Drawer */}
      <Drawer
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        title="Available Document Templates"
      >
        <div className="p-6 space-y-4 overflow-y-auto">
          {templates.map(tpl => (
            <div key={tpl.id} className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-850">{tpl.name}</h4>
                  <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-wide bg-indigo-50 px-2 py-0.5 rounded mt-1.5 inline-block">{tpl.type}</span>
                </div>
                <span className="text-xs font-bold text-text-secondary bg-white border border-border px-2.5 py-0.5 rounded-lg">{tpl.version}</span>
              </div>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">{tpl.description}</p>
              
              <div className="pt-2">
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Dynamic Variables:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(() => {
                    const vars = tpl.variables as any;
                    if (Array.isArray(vars)) {
                      return vars.map(v => (
                        <code key={v} className="bg-white border border-border px-2 py-0.5 rounded text-[10px] text-text-primary font-mono">{v}</code>
                      ));
                    }
                    if (typeof vars === 'object' && vars !== null) {
                      return Object.keys(vars).map(v => (
                        <code key={v} className="bg-white border border-border px-2 py-0.5 rounded text-[10px] text-text-primary font-mono">{v}</code>
                      ));
                    }
                    if (typeof vars === 'string' && vars.trim() !== '') {
                      const list = vars.startsWith('[') ? JSON.parse(vars) : vars.split(',');
                      return list.map((v: string) => v.trim()).map((v: string) => (
                        <code key={v} className="bg-white border border-border px-2 py-0.5 rounded text-[10px] text-text-primary font-mono">{v}</code>
                      ));
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      {/* 2. Generate Document Drawer */}
      <Drawer
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate New Dynamic PDF"
      >
        <form onSubmit={handleGenerateDocument} className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Student Name</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g., Harin Nair"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary placeholder-slate-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Document Type / Template</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary cursor-pointer"
            >
              <option value="Offer Letter">Offer Letter</option>
              <option value="Joining Letter">Joining Letter</option>
              <option value="Internship Letter">Internship Letter</option>
              <option value="Completion Certificate">Completion Certificate</option>
              <option value="Recommendation Letter">Recommendation Letter</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Training Program</label>
            <input
              type="text"
              required
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g., Full Stack Web Development"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium text-text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Stipend Amount (per month)</label>
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="e.g., 15000"
              className="w-full bg-slate-50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-mono font-bold text-text-primary"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="flex-1 py-3 border border-border text-text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-900/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate PDF'
              )}
            </button>
          </div>
        </form>
      </Drawer>

    </div>
  );
}
