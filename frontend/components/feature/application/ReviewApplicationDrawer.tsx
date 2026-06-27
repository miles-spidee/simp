"use client";

import React, { useState } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Application, ApplicationStatus } from '@/src/data/mock-applications';
import { Opportunity } from '@/src/data/mock-opportunities';
import { applicationService } from '@/src/services/application.service';
import { Mail, Phone, Calendar as CalendarIcon, Briefcase, User, CheckCircle2, XCircle, Clock, FileText, Activity, Download, ExternalLink } from 'lucide-react';

export interface ApplicationWithOpp extends Application {
  opportunityData?: Opportunity;
}

interface ReviewApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationWithOpp | null;
  onApplicationUpdated: () => void;
}

type TabType = 'profile' | 'documents' | 'review' | 'timeline';

export function ReviewApplicationDrawer({ isOpen, onClose, application, onApplicationUpdated }: ReviewApplicationDrawerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  if (!application) return null;

  const handleStatusUpdate = async (status: ApplicationStatus) => {
    try {
      setIsUpdating(true);
      await applicationService.updateApplicationStatus(application.id, status);
      onApplicationUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update application status', err);
      alert('Error updating application status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'review', label: 'Review', icon: Briefcase },
    { id: 'timeline', label: 'Timeline', icon: Activity },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending':
      case 'New':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Interview':
      case 'Under Review':
      case 'Shortlisted':
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WITHDRAWN':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'DRAFT':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg" title="Review Application">
      <div className="flex flex-col h-full min-h-0 bg-slate-50">
        
        {/* Tabs Header */}
        <div className="flex overflow-x-auto border-b border-slate-200 px-6 bg-white shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Candidate Details</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black shrink-0">
                    {application.candidateName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{application.candidateName}</div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" /> {application.email}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {application.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {['Resume', 'ID Proof', 'Certificates'].map((doc, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{doc}</div>
                      <div className="text-xs text-slate-500">PDF • Uploaded {application.appliedDate}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Application Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Applied For</p>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      {application.opportunityData?.title || application.opportunityId}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date Applied</p>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-slate-800">
                      <CalendarIcon className="h-4 w-4 text-slate-400" />
                      {application.appliedDate}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Status</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent animate-in fade-in duration-300">
              {[
                { title: 'Application Submitted', date: application.appliedDate, desc: 'Candidate submitted the application.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                { title: 'Under Review', date: application.appliedDate, desc: 'Application is being reviewed by HR.', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
                { title: 'Status Updated', date: application.appliedDate, desc: `Application status changed to ${application.status}.`, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-100' },
              ].map((event, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <event.icon className={`h-4 w-4 ${event.color}`} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm text-slate-900">{event.title}</div>
                    </div>
                    <div className="text-xs text-slate-500">{event.desc}</div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Action Footer */}
        {activeTab === 'review' && (
          <div className="shrink-0 border-t border-slate-200 p-6 bg-white flex flex-col gap-4 animate-in slide-in-from-bottom-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Update Application Status</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button 
                onClick={() => handleStatusUpdate('Selected')}
                disabled={isUpdating || application.status === 'Selected'}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-bold">Select</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('Interview')}
                disabled={isUpdating || application.status === 'Interview'}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Clock className="h-5 w-5" />
                <span className="text-xs font-bold">Interview</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={isUpdating || application.status === 'Rejected'}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <XCircle className="h-5 w-5" />
                <span className="text-xs font-bold">Reject</span>
              </button>
              <button 
                onClick={() => handleStatusUpdate('Under Review')}
                disabled={isUpdating || application.status === 'Under Review'}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-bold">Review</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
