'use client';
import { useState, useEffect } from 'react';
import { GeneratedDocument } from '@/src/types/document.types';
import { DocumentService } from '@/src/services/document.service';
import { FileText, Download, Eye, Send, MoreVertical, RefreshCw } from 'lucide-react';

export default function DocumentTable() {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        const data = await DocumentService.getGeneratedDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Generated': 'bg-blue-100 text-blue-700 border-blue-200',
      'Sent': 'bg-amber-100 text-amber-700 border-amber-200',
      'Signed': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${map[status] || map.Draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" /> Generated Documents
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Document Info</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading documents...</td>
              </tr>
            ) : (
              documents.slice(0, 20).map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{doc.type}</span>
                      <span className="text-xs text-gray-500 mt-1">Ver: {doc.version}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{new Date(doc.generatedDate).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{doc.studentName}</span>
                      <span className="text-xs text-gray-500">{doc.program}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <Eye className="h-4 w-4 hover:text-gray-900 cursor-pointer" />
                      <Download className="h-4 w-4 hover:text-blue-600 cursor-pointer" />
                      <Send className="h-4 w-4 hover:text-emerald-600 cursor-pointer" />
                      <MoreVertical className="h-4 w-4 hover:text-gray-900 cursor-pointer ml-2" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
