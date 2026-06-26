'use client';
import { useState } from 'react';
import { VerificationService } from '@/src/services/verification.service';
import { VerificationResult } from '@/src/types/verification.types';
import { Search, ShieldCheck, CheckCircle, XCircle, AlertTriangle, User, Calendar, Building } from 'lucide-react';

export default function PublicVerificationPortal() {
  const [certNumber, setCertNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber.trim()) return;
    
    setLoading(true);
    try {
      const res = await VerificationService.verifyCertificate(certNumber);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gray-900 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-gray-800 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 bg-blue-900 rounded-full opacity-50 blur-3xl"></div>
          
          <ShieldCheck className="h-16 w-16 text-emerald-400 mx-auto mb-4 relative z-10" />
          <h1 className="text-3xl font-bold text-white relative z-10">Verify a Certificate</h1>
          <p className="text-gray-400 mt-2 max-w-md mx-auto relative z-10">
            Enter the certificate number to instantly verify its authenticity on the Pinesphere network.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleVerify} className="relative">
            <div className="relative flex items-center">
              <Search className="h-6 w-6 text-gray-400 absolute left-4" />
              <input 
                type="text" 
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="e.g. PS-CERT-2026-00001" 
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-14 pr-32 py-5 text-lg font-mono tracking-wider focus:outline-none focus:border-gray-900 focus:bg-white transition-all"
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-3 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {result.status === 'Valid' ? (
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                    <div>
                      <h3 className="text-xl font-bold text-emerald-900">Certificate is Authentic</h3>
                      <p className="text-sm text-emerald-700">Verified by Pinesphere Digital Trust</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-5 border border-emerald-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Issued To</p>
                        <p className="font-medium text-gray-900 text-lg">{result.studentName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Organization</p>
                          <p className="font-medium text-gray-900">{result.organization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Issue Date</p>
                          <p className="font-medium text-gray-900">{result.issueDate ? new Date(result.issueDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : result.status === 'Revoked' ? (
                <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-rose-900">Certificate Revoked</h3>
                  <p className="text-rose-700 mt-2">{result.message}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-gray-900">Invalid Certificate</h3>
                  <p className="text-gray-500 mt-2">{result.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Secured by Pinesphere ERP &bull; 2026</p>
      </div>
    </div>
  );
}
