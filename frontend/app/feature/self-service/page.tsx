"use client";

import React, { useEffect, useState } from 'react';
import { SelfServiceService } from '@/src/services/selfservice.service';
import { NotificationService } from '@/src/services/notification.service';
import { UserProfile, DocumentRequest } from '@/src/types/selfservice.types';
import { Notification } from '@/src/types/notification.types';
import { 
  UserCircle, Loader2, FileText, UserCog, Settings, Bell, 
  ChevronRight, Download, Save, Mail, Phone, MapPin, 
  Calendar, Check, Shield, FileDown, CheckSquare, Eye, Award, Lock
} from 'lucide-react';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useAuth } from '@/src/context/AuthContext';
import ViewNotificationModal from '@/components/feature/notification/ViewNotificationModal';
import { CertificateService } from '@/src/services/certificate.service';
import { Certificate } from '@/src/types/certificate.types';

export default function SelfServicePage() {
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'certificates' | 'notifications'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentRequests, setRecentRequests] = useState<DocumentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [myCertificates, setMyCertificates] = useState<Certificate[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  
  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadNotifications();
    };
    window.addEventListener('notifications-updated', handleUpdate);
    return () => window.removeEventListener('notifications-updated', handleUpdate);
  }, [user]);

  const loadNotifications = async () => {
    try {
      const allNotifs = await NotificationService.getNotifications();
      if (user && user.roleName !== 'Super Admin') {
        const filtered = allNotifs.filter(n => {
          const recipientLower = n.recipient.toLowerCase();
          const emailLower = user.email.toLowerCase();
          const roleLower = n.role.toLowerCase();
          const userRoleLower = user.roleName.toLowerCase();
          
          return (
            recipientLower === 'all' || 
            recipientLower === emailLower || 
            roleLower === userRoleLower || 
            roleLower === 'all'
          );
        });
        setNotifications(filtered);
      } else {
        setNotifications(allNotifs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await SelfServiceService.getDashboard();
      
      // Override profile details with currently logged in user if available
      const mergedProfile = user ? {
        ...data.profile,
        name: user.name,
        email: user.email,
        role: user.roleName
      } : data.profile;
      
      setProfile(mergedProfile);
      setEditForm(mergedProfile);
      setRecentRequests(data.recentRequests);

      const allCerts = await CertificateService.getCertificates();
      const myCerts = allCerts.filter(c => c.studentName === mergedProfile?.name && c.status === 'Issued');
      setMyCertificates(myCerts);

      await loadNotifications();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setIsSavingProfile(true);
    try {
      const updated = await SelfServiceService.updateProfile(editForm);
      setProfile(updated);
      setIsEditing(false);
      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Error saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDownload = (fileName: string, typeLabel: string) => {
    const textContent = `Pinesphere ERP Portal Generated Document\n======================================\nDocument: ${fileName}\nType: ${typeLabel}\nGenerated Date: ${new Date().toLocaleString()}\nVerification Code: PS-${Math.floor(100000 + Math.random() * 900000)}\n\nThis is a certified mock document generated for verification purposes.`;
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getUnreadNotifCount = () => {
    return notifications.filter(n => !n.readStatus).length;
  };

  if (!hasPermission('selfservice.view')) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500">
        <p className="font-semibold">You do not have permission to view the self-service portal.</p>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Submitted documents mock
  const submittedDocs = [
    { name: 'Candidate_Resume.pdf', type: 'Resume', date: '2026-06-01', size: '1.2 MB' },
    { name: 'Bank_Passbook.pdf', type: 'Bank Passbook', date: '2026-06-01', size: '2.4 MB' },
    { name: 'Passport_Size_Photo.png', type: 'Passport Photo', date: '2026-06-27', size: '0.8 MB' }
  ];

  // Portal provided documents mock
  const providedDocs = [
    { name: 'Internship_Offer_Letter.pdf', type: 'Offer Letter', date: '2026-06-05', size: '0.5 MB' },
    { name: 'Internship_Joining_Letter.pdf', type: 'Joining Letter', date: '2026-06-10', size: '1.1 MB' },
    { name: 'Pinesphere_Intern_Agreement.pdf', type: 'Internship Agreement', date: '2026-06-02', size: '1.8 MB' },
    { name: 'Pinesphere_ERP_User_Guide.pdf', type: 'System User Guide', date: '2026-05-15', size: '3.2 MB' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-teal-600" />
            Self-Service Portal
          </h1>
          <p className="text-slate-550 text-sm mt-1">Manage your profile, documents, and notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
              <div className="w-20 h-20 mx-auto bg-slate-200 border border-white shadow-md rounded-full flex items-center justify-center mb-4 text-slate-500 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}&backgroundColor=0d9488,14b8a6,0f172a`} 
                  alt={profile.name} 
                  className="h-full w-full object-cover" 
                />
              </div>
              <h2 className="font-extrabold text-slate-800 tracking-tight leading-tight">{profile.name}</h2>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 border border-teal-150 text-teal-700">
                {profile.role}
              </span>
            </div>

            <div className="p-4 space-y-1.5">
              <button 
                onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'profile' 
                    ? 'text-teal-700 bg-teal-50/70 shadow-sm' 
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <span className="flex items-center gap-2.5"><UserCog className="w-4.5 h-4.5" /> My Profile</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('documents')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'documents' 
                    ? 'text-teal-700 bg-teal-50/70 shadow-sm' 
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <span className="flex items-center gap-2.5"><FileText className="w-4.5 h-4.5" /> Documents</span>
              </button>

              <button 
                onClick={() => setActiveTab('certificates')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'certificates' 
                    ? 'text-teal-700 bg-teal-50/70 shadow-sm' 
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <span className="flex items-center gap-2.5"><Award className="w-4.5 h-4.5" /> Certificates</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  activeTab === 'notifications' 
                    ? 'text-teal-700 bg-teal-50/70 shadow-sm' 
                    : 'text-slate-550 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <span className="flex items-center gap-2.5"><Bell className="w-4.5 h-4.5" /> Notifications</span>
                {getUnreadNotifCount() > 0 && (
                  <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-xxs font-black leading-none">
                    {getUnreadNotifCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-3 space-y-6">
          {profileMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
              <Check className="w-5 h-5 text-emerald-600" />
              {profileMessage}
            </div>
          )}

          {/* TAB 1: PROFILE VIEW / EDIT */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Personal Profile</h3>
                  <p className="text-xs text-slate-400">View and update your personal contact coordinates.</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => { setIsEditing(true); setEditForm(profile); }}
                    className="bg-white border border-slate-350 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input 
                        type="text"
                        required
                        value={editForm.name || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input 
                        type="email"
                        required
                        value={editForm.email || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                      <input 
                        type="text"
                        required
                        value={editForm.phone || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Join Date (Read-Only)</label>
                      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                        {new Date(profile.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Address *</label>
                      <input 
                        type="text"
                        required
                        value={editForm.address || ''}
                        onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex gap-3 items-center">
                    <UserCircle className="w-8 h-8 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Full Name</span>
                      <span className="font-semibold text-slate-800 text-sm">{profile.name}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Mail className="w-8 h-8 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email Address</span>
                      <span className="font-semibold text-slate-800 text-sm">{profile.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Phone className="w-8 h-8 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</span>
                      <span className="font-semibold text-slate-800 text-sm">{profile.phone}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Calendar className="w-8 h-8 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Join Date</span>
                      <span className="font-semibold text-slate-800 text-sm">{new Date(profile.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center md:col-span-2">
                    <MapPin className="w-8 h-8 text-slate-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Address</span>
                      <span className="font-semibold text-slate-800 text-sm">{profile.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Requests Section */}
              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-800 text-base mb-4">Verification & Document Requests</h4>
                <div className="bg-white rounded-xl border border-slate-150 overflow-hidden">
                  <div className="divide-y divide-slate-150">
                    {recentRequests.map(req => (
                      <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-750 text-sm">{req.type}</div>
                          <div className="text-xxs text-slate-400 mt-1">Requested on {new Date(req.requestDate).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider ${
                            req.status === 'Ready' ? 'bg-emerald-105 text-emerald-800 border border-emerald-150 bg-emerald-50' :
                            req.status === 'Pending' ? 'bg-amber-105 text-amber-805 border border-amber-150 bg-amber-50' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'Ready' ? (
                            <button 
                              onClick={() => handleDownload(`${req.type.replace(/\s+/g, '_')}.pdf`, req.type)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4.5 h-4.5" />
                            </button>
                          ) : (
                            <ChevronRight className="w-4.5 h-4.5 text-slate-350" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS LIST */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Submitted documents card */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Submitted Documents</h3>
                  <p className="text-xs text-slate-455">Files uploaded by you during application or onboarding.</p>
                </div>

                <div className="overflow-hidden border border-slate-150 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 text-xs font-bold uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Document Name</th>
                        <th className="px-5 py-3 font-semibold">Type</th>
                        <th className="px-5 py-3 font-semibold">Upload Date</th>
                        <th className="px-5 py-3 font-semibold">Size</th>
                        <th className="px-5 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {submittedDocs.map(doc => (
                        <tr key={doc.name} className="hover:bg-slate-50/50 transition-all font-medium text-slate-800">
                          <td className="px-5 py-4 font-bold text-slate-800">{doc.name}</td>
                          <td className="px-5 py-4"><span className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded text-xs">{doc.type}</span></td>
                          <td className="px-5 py-4 text-xs text-slate-400">{new Date(doc.date).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-xs text-slate-450 font-semibold">{doc.size}</td>
                          <td className="px-5 py-4 text-right">
                            <button 
                              onClick={() => handleDownload(doc.name, doc.type)}
                              className="text-teal-600 hover:text-teal-800 hover:bg-teal-50/70 p-1.5 rounded-lg inline-flex items-center gap-1 text-xs font-bold border border-teal-100 shadow-xxs transition-all"
                            >
                              <FileDown className="w-4 h-4" /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Portal Provided documents card */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Portal Provided Documents</h3>
                  <p className="text-xs text-slate-450">Official offers, certifications, policy guidelines, and training catalogs.</p>
                </div>

                <div className="overflow-hidden border border-slate-150 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 text-xs font-bold uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Document Name</th>
                        <th className="px-5 py-3 font-semibold">Type</th>
                        <th className="px-5 py-3 font-semibold">Available Date</th>
                        <th className="px-5 py-3 font-semibold">Size</th>
                        <th className="px-5 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {providedDocs.map(doc => (
                        <tr key={doc.name} className="hover:bg-slate-50/50 transition-all font-medium text-slate-800">
                          <td className="px-5 py-4 font-bold text-slate-800">{doc.name}</td>
                          <td className="px-5 py-4"><span className="bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded text-xs font-semibold">{doc.type}</span></td>
                          <td className="px-5 py-4 text-xs text-slate-400">{new Date(doc.date).toLocaleDateString()}</td>
                          <td className="px-5 py-4 text-xs text-slate-450 font-semibold">{doc.size}</td>
                          <td className="px-5 py-4 text-right">
                            <button 
                              onClick={() => handleDownload(doc.name, doc.type)}
                              className="text-teal-600 hover:text-teal-800 hover:bg-teal-50/70 p-1.5 rounded-lg inline-flex items-center gap-1 text-xs font-bold border border-teal-100 shadow-xxs transition-all"
                            >
                              <FileDown className="w-4 h-4" /> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES LIST */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">My Certificates</h3>
                  <p className="text-xs text-slate-455">View and download your official program certificates.</p>
                </div>

                {myCertificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myCertificates.map(cert => (
                      <div key={cert.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-6 h-6 text-teal-600" />
                            <h4 className="font-bold text-slate-800">{cert.type}</h4>
                          </div>
                          <span className="text-xxs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">{cert.certificateNumber}</span>
                        </div>
                        <div className="text-sm text-slate-600 mb-4">
                          <p><strong>Program:</strong> {cert.program}</p>
                          <p><strong>Issued On:</strong> {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <button 
                          onClick={() => handleDownload(`${cert.type.replace(/\s+/g, '_')}.pdf`, cert.type)}
                          className="w-full py-2 bg-teal-50 text-teal-700 font-bold text-sm rounded-lg hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" /> Download Certificate
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-slate-300" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-lg">No Certificates Issued Yet</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">Your certificates will appear here once they have been approved and issued by the administration.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-800 text-lg">In-Portal Notifications</h3>
                <p className="text-xs text-slate-400">View corporate memos, batch announcements, and alerts matching your profile.</p>
              </div>

              {notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-slate-50 border border-slate-150 border-dashed rounded-xl">
                  <Bell className="w-10 h-10 mx-auto text-slate-350 mb-3" />
                  <p className="text-sm font-semibold">No active notifications found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-150 border border-slate-150 rounded-2xl overflow-hidden bg-white">
                  {notifications.slice(0, 30).map((n) => (
                    <div 
                      key={n.id}
                      onClick={async () => {
                        setSelectedNotif(n);
                        setIsNotifModalOpen(true);
                        if (!n.readStatus) {
                          try {
                            await NotificationService.markAsRead(n.id);
                            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, readStatus: true } : item));
                            window.dispatchEvent(new Event('notifications-updated'));
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                      className={`p-5 flex items-start gap-4 hover:bg-slate-50/60 transition-all cursor-pointer ${
                        !n.readStatus ? 'bg-teal-50/15' : ''
                      }`}
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${
                        !n.readStatus 
                          ? 'bg-teal-50 text-teal-600 border-teal-150' 
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        <Bell className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-sm font-bold truncate leading-tight ${
                            !n.readStatus ? 'text-slate-900 font-extrabold' : 'text-slate-650'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase whitespace-nowrap leading-none shrink-0">
                            {new Date(n.createdTime).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 truncate max-w-2xl font-medium">
                          {n.message}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded leading-none uppercase ${
                            n.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                            n.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-105 text-blue-700'
                          }`}>
                            {n.priority}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold leading-none">
                            {n.module}
                          </span>
                          {!n.readStatus && (
                            <span className="h-2 w-2 bg-teal-500 rounded-full shrink-0" title="Unread notification" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shared Detail Modals */}
      <ViewNotificationModal 
        isOpen={isNotifModalOpen}
        onClose={() => {
          setIsNotifModalOpen(false);
          setSelectedNotif(null);
        }}
        data={selectedNotif}
      />
    </div>
  );
}

