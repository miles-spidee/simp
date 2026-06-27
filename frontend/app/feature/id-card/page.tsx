"use client";

import React, { useEffect, useState } from 'react';
import { IDCardService } from '@/src/services/idcard.service';
import { DigitalIDCard } from '@/src/types/idcard.types';
import { 
  IdCard, Loader2, Download, Printer, QrCode, RefreshCw, Palette, 
  Settings2, ShieldCheck, Check, Layout, HelpCircle, FileText, Zap
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';

interface IDTemplate {
  themeName: 'blue' | 'dark' | 'green' | 'pink' | 'custom';
  primaryColor: string;
  accentColor: string;
  showLogo: boolean;
  showQrCode: boolean;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  showBloodGroup: boolean;
  showDepartment: boolean;
  showExpiry: boolean;
  customBackText: string;
}

const DEFAULT_TEMPLATE: IDTemplate = {
  themeName: 'blue',
  primaryColor: '#2563eb', // blue-600
  accentColor: '#1d4ed8', // blue-700
  showLogo: true,
  showQrCode: true,
  fontFamily: 'font-sans',
  showBloodGroup: true,
  showDepartment: true,
  showExpiry: true,
  customBackText: 'This card is the official property of Pinesphere Enterprise. If found, please return to the nearest administration office or mail to HR Department.'
};

export default function IDCardPage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<DigitalIDCard | null>(null);
  
  // Tab states: 'mycard' or 'designer'
  const [activeTab, setActiveTab] = useState<'mycard' | 'designer'>('mycard');
  const [isFlipped, setIsFlipped] = useState(false);

  // Template Designer States
  const [template, setTemplate] = useState<IDTemplate>(DEFAULT_TEMPLATE);

  const generateFallbackCard = (activeUser: any): DigitalIDCard => {
    const savedPhoto = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_photo') : null;
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_name') : null;
    const savedProgram = typeof window !== 'undefined' ? localStorage.getItem('pinesphere_submitted_program') : null;

    const isStudent = activeUser.roleName === 'Student';
    const idVal = activeUser.user_id || '99';
    const cleanId = parseInt(idVal.replace(/\D/g, '')) || 99;
    return {
      id: `IDC-${idVal}`,
      cardNumber: `ID-2026-${1000 + cleanId}`,
      studentId: isStudent ? `STU-${100 + cleanId}` : `EMP-${500 + cleanId}`,
      studentName: savedName || activeUser.name,
      department: isStudent ? 'Engineering' : (activeUser.roleName === 'Super Admin' ? 'Management' : 'Operations'),
      program: savedProgram || (isStudent ? 'Intern' : `${activeUser.roleName} (Employee)`),
      batch: isStudent ? 'Class of 2026' : 'Staff',
      photoUrl: savedPhoto || `https://i.pravatar.cc/150?u=user${cleanId}`,
      qrCodeData: `https://pinesphere.com/verify/ID-2026-${1000 + cleanId}`,
      issueDate: new Date(Date.now() - 15552000000).toISOString(),
      expiryDate: new Date(Date.now() + 31536000000).toISOString(),
      status: 'Active',
      bloodGroup: 'B+',
      emergencyContact: '+1 (555) 019-9283'
    };
  };

  useEffect(() => {
    loadData();
    loadTemplate();
  }, [user]);

  const loadTemplate = () => {
    const saved = localStorage.getItem('pinesphere_id_template');
    if (saved) {
      try {
        setTemplate(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved ID template", e);
      }
    }
  };

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let data = await IDCardService.getMyIDCard(user.user_id);
      if (!data) {
        data = generateFallbackCard(user);
      } else {
        // Override with submitted application details if present in localStorage
        const savedPhoto = localStorage.getItem('pinesphere_submitted_photo');
        const savedName = localStorage.getItem('pinesphere_submitted_name');
        const savedProgram = localStorage.getItem('pinesphere_submitted_program');
        if (savedPhoto) data.photoUrl = savedPhoto;
        if (savedName) data.studentName = savedName;
        if (savedProgram) data.program = savedProgram;
      }
      setCard(data);
    } catch (e) {
      console.error(e);
      setCard(generateFallbackCard(user));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = (updated: IDTemplate) => {
    setTemplate(updated);
    localStorage.setItem('pinesphere_id_template', JSON.stringify(updated));
  };

  const handleApplyPresetTheme = (theme: 'blue' | 'dark' | 'green' | 'pink') => {
    let preset: Partial<IDTemplate> = {};
    if (theme === 'blue') {
      preset = { themeName: 'blue', primaryColor: '#2563eb', accentColor: '#1d4ed8' };
    } else if (theme === 'dark') {
      preset = { themeName: 'dark', primaryColor: '#1f2937', accentColor: '#111827' };
    } else if (theme === 'green') {
      preset = { themeName: 'green', primaryColor: '#059669', accentColor: '#047857' };
    } else if (theme === 'pink') {
      preset = { themeName: 'pink', primaryColor: '#db2777', accentColor: '#be185d' };
    }
    handleSaveTemplate({ ...template, ...preset });
  };

  const handleDownloadPDF = () => {
    alert("Digital ID Card PDF is being generated and compiled. Check your browser downloads!");
    const element = document.createElement("a");
    const file = new Blob(["Digital ID Card Data\n\nName: " + card?.studentName + "\nID: " + card?.studentId + "\nCard Number: " + card?.cardNumber], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${card?.studentName?.replace(/\s+/g, '_')}_ID_Card.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!hasPermission('idcard.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500 font-sans">
        <p className="font-semibold">You do not have permission to view ID cards.</p>
      </div>
    );
  }

  if (loading || !card) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const isEmployee = user?.roleName !== 'Student';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IdCard className="w-6 h-6 text-teal-605" />
            Digital Identity Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage, design, and access digital identity cards for interns & employees.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasPermission('idcard.print') && (
            <button 
              onClick={handlePrint}
              className="bg-white border border-slate-205 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Card
            </button>
          )}
          {hasPermission('idcard.download') && (
            <button 
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Info
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-150 gap-2">
        <button 
          onClick={() => setActiveTab('mycard')}
          className={`px-5 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'mycard' 
              ? 'border-teal-600 text-teal-650' 
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <IdCard className="w-4.5 h-4.5" />
          My Digital ID Card
        </button>
        <button 
          onClick={() => setActiveTab('designer')}
          className={`px-5 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'designer' 
              ? 'border-teal-600 text-teal-650' 
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Layout className="w-4.5 h-4.5" />
          ID Template Designer
        </button>
      </div>

      {activeTab === 'mycard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Card Side Column (3D Interactive ID Card Card) */}
          <div className="lg:col-span-5 flex flex-col items-center p-6 bg-slate-50/50 border border-slate-150 rounded-3xl">
            <div className="mb-4 text-center">
              <span className="text-xxs uppercase tracking-wider font-extrabold text-slate-450">3D Interactive Preview</span>
              <p className="text-xs text-slate-400 mt-1">Click the ID card to flip between front and back views.</p>
            </div>

            {/* Interactive Card Body Container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="[perspective:1000px] w-full max-w-[320px] h-[480px] cursor-pointer group"
            >
              <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}>
                
                {/* --- FRONT SIDE --- */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white flex flex-col justify-between ${template.fontFamily}`}>
                  {/* Top Color Banner */}
                  <div 
                    style={{ backgroundColor: template.primaryColor }}
                    className="h-28 p-4 relative flex flex-col justify-between text-white transition-colors duration-300"
                  >
                    <div className="flex justify-between items-start">
                      {template.showLogo && (
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4.5 h-4.5 text-yellow-405 fill-yellow-405" />
                          <span className="font-extrabold text-xs tracking-wider uppercase">PINESPHERE</span>
                        </div>
                      )}
                      <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest leading-none">
                        {isEmployee ? 'Staff' : 'Intern'}
                      </span>
                    </div>
                    <div className="text-[10px] opacity-80 uppercase tracking-widest font-black text-left">Enterprise Identity</div>
                  </div>

                  {/* Profile Picture Block */}
                  <div className="px-6 pb-6 text-center flex-grow flex flex-col justify-between relative">
                    <div className="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 -mt-14 z-10 relative">
                      <img src={card.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    <div className="mt-4 flex-grow flex flex-col justify-center">
                      <h2 className="text-xl font-black text-slate-850 tracking-tight leading-tight">{card.studentName}</h2>
                      <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide" style={{ color: template.primaryColor }}>
                        {card.program}
                      </p>
                    </div>

                    {/* Meta Fields Table */}
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-left bg-slate-50/75 border border-slate-100 p-3 rounded-2xl mb-2 mt-4">
                      <div>
                        <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">ID Number</div>
                        <div className="text-xs font-bold text-slate-750">{card.studentId}</div>
                      </div>
                      
                      {template.showDepartment && (
                        <div>
                          <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Department</div>
                          <div className="text-xs font-bold text-slate-750 truncate">{card.department}</div>
                        </div>
                      )}

                      {template.showBloodGroup && (
                        <div>
                          <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Blood Group</div>
                          <div className="text-xs font-bold text-slate-755">{card.bloodGroup}</div>
                        </div>
                      )}

                      {template.showExpiry && (
                        <div>
                          <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Valid Till</div>
                          <div className="text-xs font-bold text-slate-750">{new Date(card.expiryDate).toLocaleDateString()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- BACK SIDE --- */}
                <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-white flex flex-col justify-between p-6 ${template.fontFamily}`}>
                  <div className="space-y-4 flex-grow flex flex-col justify-between text-center">
                    <div className="flex justify-center items-center gap-1.5 pb-3 border-b border-slate-100">
                      <Zap className="w-5 h-5 text-teal-600 fill-teal-600" />
                      <span className="font-extrabold text-sm tracking-widest uppercase text-slate-800">PINESPHERE</span>
                    </div>

                    {/* QR Code */}
                    {template.showQrCode && (
                      <div className="flex flex-col items-center justify-center my-3">
                        <div className="w-28 h-28 bg-slate-50 p-2 rounded-xl flex items-center justify-center border border-slate-150 shadow-xs">
                          <QrCode className="w-full h-full text-slate-750 opacity-90" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">ID Verification QR</span>
                      </div>
                    )}

                    {/* Custom Terms Text */}
                    <div className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto text-center px-2">
                      {template.customBackText}
                    </div>

                    {/* Card Status Indicator */}
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-left">
                      <div>
                        <div className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Emergency Contact</div>
                        <div className="text-[11px] font-bold text-slate-750">{card.emergencyContact}</div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                        {card.status}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <button 
              onClick={() => setIsFlipped(!isFlipped)}
              className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Flip ID Card
            </button>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Identity Verified Badge */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 flex gap-4 items-start">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-50 border border-teal-150 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Identity Verification Status</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your digital ID card serves as an official proof of identity within the Pinesphere ecosystem. Keep it secure and do not share the verification QR code publicly.
                </p>
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 text-xxs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Card ID: {card.cardNumber}</span>
                  <span>Issued: {new Date(card.issueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Profile Information details sync */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Verification Metadata</h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-450 font-medium">Full Name</span>
                  <span className="font-bold text-slate-805">{card.studentName}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-450 font-medium">Enterprise Role</span>
                  <span className="font-bold text-slate-805">{card.program}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-450 font-medium">System Identifier</span>
                  <span className="font-bold text-slate-805">{card.studentId}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-450 font-medium">Emergency Line</span>
                  <span className="font-bold text-slate-805">{card.emergencyContact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'designer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Live Preview Side (Static side-by-side design) */}
          <div className="lg:col-span-5 flex flex-col items-center p-6 bg-slate-50/50 border border-slate-150 rounded-3xl gap-6">
            <div className="text-center">
              <span className="text-xxs uppercase tracking-wider font-extrabold text-slate-450">Template Real-Time Preview</span>
              <p className="text-xs text-slate-400 mt-1">Design changes apply dynamically to both sides below.</p>
            </div>

            {/* Front View Preview */}
            <div className={`w-full max-w-[280px] h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-205 bg-white flex flex-col justify-between ${template.fontFamily}`}>
              <div style={{ backgroundColor: template.primaryColor }} className="h-24 p-3 relative flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  {template.showLogo && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-405 fill-yellow-405" />
                      <span className="font-extrabold text-[10px] tracking-wider uppercase">PINESPHERE</span>
                    </div>
                  )}
                  <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Intern
                  </span>
                </div>
                <div className="text-[8px] opacity-80 uppercase tracking-widest font-bold">Enterprise Identity</div>
              </div>
              <div className="px-5 pb-5 text-center flex-grow flex flex-col justify-between relative">
                <div className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 -mt-10 z-10 relative">
                  <img src={card.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 flex-grow flex flex-col justify-center">
                  <h2 className="text-base font-extrabold text-slate-850 tracking-tight leading-tight">{card.studentName}</h2>
                  <p className="text-[10px] font-bold text-slate-450 mt-0.5 uppercase tracking-wide" style={{ color: template.primaryColor }}>
                    {card.program}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 text-left bg-slate-50 p-2.5 rounded-xl text-[10px]">
                  <div>
                    <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">ID Number</div>
                    <div className="font-bold text-slate-700">{card.studentId}</div>
                  </div>
                  {template.showDepartment && (
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Department</div>
                      <div className="font-bold text-slate-700 truncate">{card.department}</div>
                    </div>
                  )}
                  {template.showBloodGroup && (
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Blood Group</div>
                      <div className="font-bold text-slate-700">{card.bloodGroup}</div>
                    </div>
                  )}
                  {template.showExpiry && (
                    <div>
                      <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Valid Till</div>
                      <div className="font-bold text-slate-700">{new Date(card.expiryDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back View Preview */}
            <div className={`w-full max-w-[280px] h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-205 bg-white flex flex-col justify-between p-5 ${template.fontFamily}`}>
              <div className="space-y-3 flex-grow flex flex-col justify-between text-center">
                <div className="flex justify-center items-center gap-1 pb-2 border-b border-slate-100">
                  <Zap className="w-4 h-4 text-teal-600 fill-teal-600" />
                  <span className="font-extrabold text-xs tracking-widest uppercase text-slate-800">PINESPHERE</span>
                </div>
                {template.showQrCode && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 p-1.5 rounded-lg flex items-center justify-center border border-slate-150">
                      <QrCode className="w-full h-full text-slate-750 opacity-90" />
                    </div>
                  </div>
                )}
                <div className="text-[8px] text-slate-400 leading-relaxed max-w-xs mx-auto text-center px-1">
                  {template.customBackText}
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-left text-[10px]">
                  <div>
                    <div className="text-[6px] text-slate-400 font-bold uppercase tracking-wider">Emergency Contact</div>
                    <div className="font-bold text-slate-700">{card.emergencyContact}</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Designer Controls */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Palette className="w-5 h-5 text-teal-650" />
                Customize Template Layout
              </h3>
              <p className="text-xs text-slate-500 mt-1">Configure preset palettes, typography, and card-back texts.</p>
            </div>

            {/* Theme Presets */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Color Presets</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Corporate Blue', key: 'blue', primary: '#2563eb' },
                  { name: 'Midnight Dark', key: 'dark', primary: '#1f2937' },
                  { name: 'Emerald Forest', key: 'green', primary: '#059669' },
                  { name: 'Hot Pink', key: 'pink', primary: '#db2777' }
                ].map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleApplyPresetTheme(p.key as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left flex flex-col justify-between gap-3 hover:scale-[1.02] transition-all cursor-pointer ${
                      template.themeName === p.key ? 'border-teal-500 ring-2 ring-teal-200' : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <span className="text-slate-805">{p.name}</span>
                    <span className="w-5 h-5 rounded-full border border-white shadow-xs block" style={{ backgroundColor: p.primary }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Palette Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Primary Card Accent Color</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={template.primaryColor}
                    onChange={e => handleSaveTemplate({ ...template, themeName: 'custom', primaryColor: e.target.value })}
                    className="h-8 w-12 rounded border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-500">{template.primaryColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Font Style</label>
                <select
                  value={template.fontFamily}
                  onChange={e => handleSaveTemplate({ ...template, fontFamily: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none text-slate-800 bg-white"
                >
                  <option value="font-sans">Modern Sans-Serif</option>
                  <option value="font-serif">Elegant Serif</option>
                  <option value="font-mono">Techi Monospace</option>
                </select>
              </div>
            </div>

            {/* Fields Visibility Configuration */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Settings2 className="w-4 h-4" /> Field Visibility Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={template.showLogo}
                    onChange={e => handleSaveTemplate({ ...template, showLogo: e.target.checked })}
                    className="rounded border-slate-300 text-teal-650 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Pinesphere Logo</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Toggle organization branding</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={template.showQrCode}
                    onChange={e => handleSaveTemplate({ ...template, showQrCode: e.target.checked })}
                    className="rounded border-slate-300 text-teal-650 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Verification QR Code</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Toggle back identity verification</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={template.showBloodGroup}
                    onChange={e => handleSaveTemplate({ ...template, showBloodGroup: e.target.checked })}
                    className="rounded border-slate-300 text-teal-650 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Blood Group Field</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Show emergency health data</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox"
                    checked={template.showDepartment}
                    onChange={e => handleSaveTemplate({ ...template, showDepartment: e.target.checked })}
                    className="rounded border-slate-300 text-teal-650 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Department / Team</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Show department details</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer transition-colors sm:col-span-2">
                  <input 
                    type="checkbox"
                    checked={template.showExpiry}
                    onChange={e => handleSaveTemplate({ ...template, showExpiry: e.target.checked })}
                    className="rounded border-slate-300 text-teal-650 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Card Expiry Date</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Show valid-till authorization parameters</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Back Custom Terms and Instructions */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <FileText className="w-4 h-4 text-slate-400" /> Custom Back Terms / Policy Text
              </label>
              <textarea
                rows={3}
                value={template.customBackText}
                onChange={e => handleSaveTemplate({ ...template, customBackText: e.target.value })}
                className="w-full rounded-xl border border-slate-350 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none text-slate-800 bg-white placeholder-slate-400 font-medium"
                placeholder="E.g. If found, please return to..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  alert("Card template saved successfully!");
                  setActiveTab('mycard');
                }}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Template
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

