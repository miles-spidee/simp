'use client';
import { useState, useEffect } from 'react';
import { Certificate } from '@/src/types/certificate.types';
import { CertificateService } from '@/src/services/certificate.service';
import { Award, CheckCircle, Clock, XCircle, Search, Filter, MoreVertical, QrCode } from 'lucide-react';

export default function CertificateTable() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      setLoading(true);
      try {
        const data = await CertificateService.getCertificates();
        setCertificates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'Pending Approval': 'bg-amber-100 text-amber-700 border-amber-200',
      'Approved': 'bg-blue-100 text-blue-700 border-blue-200',
      'Issued': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Revoked': 'bg-rose-100 text-rose-700 border-rose-200'
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
          <Award className="h-5 w-5 text-emerald-600" /> Certificate Repository
        </h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              className="bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Certificate Info</th>
              <th className="px-6 py-4 font-medium">Student Details</th>
              <th className="px-6 py-4 font-medium">Status & Approvals</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading certificates...</td>
              </tr>
            ) : (
              certificates.slice(0, 20).map(cert => (
                <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{cert.type}</span>
                      <span className="text-xs text-gray-500 mt-1 font-mono">{cert.certificateNumber}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Generated: {new Date(cert.createdTime).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{cert.studentName}</span>
                      <span className="text-xs text-gray-500">{cert.program}</span>
                      <span className="text-xs text-blue-600 font-medium">{cert.batch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      {getStatusBadge(cert.status)}
                      {cert.approvedBy && (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500" /> Appr: {cert.approvedBy}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      {cert.status === 'Issued' && <QrCode className="h-4 w-4 hover:text-gray-900 cursor-pointer" />}
                      <MoreVertical className="h-4 w-4 hover:text-gray-900 cursor-pointer" />
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
