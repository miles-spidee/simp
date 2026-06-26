'use client';
import { useState, useEffect } from 'react';
import DocumentTable from './DocumentTable';
import { DocumentService } from '@/src/services/document.service';
import { FileText, FilePlus, Copy } from 'lucide-react';

export default function DocumentDashboard() {
  const [offerLetters, setOfferLetters] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const count = await DocumentService.getOfferLettersCount();
      setOfferLetters(count);
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Generation</h1>
          <p className="text-sm text-gray-500 mt-1">Generate dynamic PDFs from templates for offers, reports, and certificates.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm">
            <Copy className="h-4 w-4" /> Templates
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm">
            <FilePlus className="h-4 w-4" /> Generate Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Offer Letters</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{offerLetters}</p>
          </div>
          <FileText className="h-10 w-10 text-blue-100" />
        </div>
      </div>

      <DocumentTable />
    </div>
  );
}
