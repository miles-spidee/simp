"use client";

import React, { useEffect, useState } from 'react';
import { IDCardService } from '@/src/services/idcard.service';
import { DigitalIDCard } from '@/src/types/idcard.types';
import { IdCard, Loader2, Download, Printer, QrCode } from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

export default function IDCardPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<DigitalIDCard | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await IDCardService.getMyIDCard(user.user_id);
      setCard(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission('idcard.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>You do not have permission to view ID cards.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p>No digital ID card found for your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IdCard className="w-6 h-6 text-blue-600" />
            Digital ID Card
          </h1>
          <p className="text-slate-500 text-sm mt-1">View, download, and print your enterprise ID.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission('idcard.print') && (
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
          )}
          {hasPermission('idcard.download') && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* ID Card Visual representation */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-sm overflow-hidden relative">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-t-3xl"></div>
          </div>
          
          <div className="px-6 pb-6 text-center relative -mt-16">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 mb-4">
              <img src={card.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{card.studentName}</h2>
            <p className="text-blue-600 font-medium text-sm mb-4">{card.program}</p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left bg-slate-50 p-4 rounded-xl mb-6">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID Number</div>
                <div className="text-sm font-medium text-slate-800">{card.cardNumber}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Blood Group</div>
                <div className="text-sm font-medium text-slate-800">{card.bloodGroup}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Department</div>
                <div className="text-sm font-medium text-slate-800">{card.department}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Valid Till</div>
                <div className="text-sm font-medium text-slate-800">{new Date(card.expiryDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex justify-center mb-2">
              <div className="w-32 h-32 bg-slate-100 p-2 rounded-lg flex items-center justify-center border border-slate-200">
                <QrCode className="w-full h-full text-slate-800 opacity-80" />
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Scan to verify identity</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Card Status</h3>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${card.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <span className="font-medium text-slate-700">{card.status}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
              Your digital ID card serves as an official proof of identity within the Pinesphere ecosystem. Keep it secure and do not share the QR code publicly.
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">Emergency Contact</h3>
            <div className="text-lg font-bold text-slate-900">{card.emergencyContact}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
