"use client";

import React from 'react';
import { Download, GraduationCap, Upload, X } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function DocumentsPage() {
  const {
    vaultFiles,
    activeCertificate,
    setActiveCertificate,
    certificatesCatalog,
    uploadedFileName,
    setUploadedFileName,
    uploadCategory,
    setUploadCategory,
    handleUploadDocument,
    showToastNotification,
    username
  } = useDashboard();

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Verified Documents & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vaultFiles.map((file) => (
                <div key={file.id} className="bg-slate-50 border border-slate-150 p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-blue-650 uppercase tracking-widest">{file.category}</span>
                    <h4 className="font-bold text-xs text-slate-805 truncate">{file.name}</h4>
                    <span className="text-[10px] text-slate-400 block">{file.size} • {file.date}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                    <span className={`font-bold ${file.verified ? 'text-emerald-600' : 'text-amber-605'}`}>
                      {file.verified ? 'Verified ✓' : 'Pending Verification'}
                    </span>
                    {file.downloadable && (
                      <button
                        type="button"
                        onClick={() => showToastNotification(`Downloading ${file.name}...`)}
                        className="h-7 w-7 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-805 flex items-center justify-center border border-slate-200 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awarded Digital Certificates */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Awarded Digital Certificates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certificatesCatalog.map((cert) => (
                <div key={cert.id} className="border border-blue-100 bg-gradient-to-br from-blue-50/20 to-indigo-50/10 p-5 flex flex-col justify-between hover:border-blue-300 transition-all duration-200 shadow-sm relative overflow-hidden group">
                  {/* Decorative badge watermark */}
                  <div className="absolute -right-6 -bottom-6 opacity-5 text-blue-900 pointer-events-none group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-24 w-24" />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <span className="text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 uppercase tracking-widest inline-block">
                      {cert.type}
                    </span>
                    <h4 className="font-bold text-xs text-slate-850 line-clamp-1">{cert.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{cert.description}</p>
                    <div className="text-[9px] text-slate-400 font-medium">Issue Date: {cert.issueDate}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCertificate(cert)}
                    className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors z-10 cursor-pointer"
                  >
                    View Certificate Document
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            Upload Document Files
          </h3>

          <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Document Filename</label>
              <input
                type="text"
                required
                placeholder="e.g. Identity_Proof"
                value={uploadedFileName}
                onChange={(e) => setUploadedFileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Academics">Academics / NOC</option>
                <option value="Personal">Personal / ID</option>
                <option value="External Certificates">External Certs</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Push to Vault</span>
            </button>
          </form>
        </div>
      </div>

      {/* Certificate Overlay Modal */}
      {activeCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-8 border-double border-amber-600 shadow-2xl p-8 w-full max-w-2xl animate-scale-up relative text-center text-slate-800 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.02)_0%,transparent_100%)]">
            <button
              type="button"
              onClick={() => setActiveCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold border border-slate-200 bg-white p-1 rounded-none shadow-sm flex items-center justify-center cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Pinesphere Academy Header */}
            <div className="space-y-1.5 border-b border-slate-200 pb-4 mb-6">
              <img src="/logo.png" alt="Pinesphere Logo" className="h-10 mx-auto" />
              <h4 className="font-serif text-[11px] font-black text-amber-700 uppercase tracking-widest">
                Academy of Advanced Software Engineering
              </h4>
            </div>

            {/* Certificate Main Title */}
            <div className="space-y-4">
              <h3 className="font-serif text-3xl font-bold text-slate-900 tracking-wide italic">
                Certificate of Accomplishment
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                This credential certifies that
              </p>
              <h2 className="text-3xl font-black text-slate-800 underline decoration-amber-600 decoration-double underline-offset-8 py-2">
                {username}
              </h2>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                has successfully completed the curriculum requirements and demonstrated outstanding mastery in the pathway of <strong>{activeCertificate.title}</strong>, showcasing advanced competencies in architectural patterns, clean coding styles, and staging integrations.
              </p>
            </div>

            {/* Seals & Signatures */}
            <div className="grid grid-cols-3 gap-6 items-center mt-10 border-t border-slate-200/80 pt-6">
              <div className="text-center text-xs">
                <div className="font-serif italic font-bold text-slate-800">Anand Jayavel</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 border-t border-slate-100 pt-1 font-sans">Senior Architect</div>
              </div>
              
              {/* Official Seal SVG */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-double border-amber-600 bg-amber-50 flex items-center justify-center relative shadow-sm">
                  <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                  </svg>
                  <div className="absolute text-[6px] font-black text-amber-700 tracking-wider rotate-12 font-sans">VERIFIED</div>
                </div>
              </div>

              <div className="text-center text-xs">
                <div className="font-serif italic font-bold text-slate-800">{activeCertificate.issueDate}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 border-t border-slate-100 pt-1 font-sans">Date of Issuance</div>
              </div>
            </div>

            {/* Validation ID */}
            <div className="mt-6 text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 border border-slate-200 py-1.5 px-4 inline-block">
              CREDENTIAL ID: {activeCertificate.validationId}
            </div>

            <div className="mt-6 flex gap-3 justify-center text-xs">
              <button
                type="button"
                onClick={() => showToastNotification(`Downloading ${activeCertificate.title} PDF...`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Download PDF Cert
              </button>
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
