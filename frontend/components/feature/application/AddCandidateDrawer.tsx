"use client";

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Button } from '@/components/feature/ui/Button';
import { Briefcase, User, Mail, Phone } from 'lucide-react';
import { applicationService } from '@/src/services/application.service';
import { Opportunity } from '@/src/data/mock-opportunities';

interface AddCandidateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded: () => void;
  opportunities: Opportunity[];
  onShowNotification?: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export function AddCandidateDrawer({
  isOpen,
  onClose,
  onCandidateAdded,
  opportunities,
  onShowNotification
}: AddCandidateDrawerProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [opportunityId, setOpportunityId] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Interview' | 'Accepted' | 'Rejected'>('Pending');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when drawer opens
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setName('');
          setEmail('');
          setPhone('');
          setOpportunityId('');
          setStatus('Pending');
          setErrors({});
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Candidate name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!opportunityId) {
      newErrors.opportunityId = 'Please link this candidate to an opportunity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await applicationService.createApplication({
        first_name: name.trim().split(' ')[0] || '',
        last_name: name.trim().split(' ').slice(1).join(' ') || '',
        email: email.trim(),
        mobile_number: phone.trim(),
        opening_id: opportunityId,
        resume_url: 'https://example.com/resume.pdf' // Fake resume for now
      } as any);
      if (onShowNotification) {
        onShowNotification(
          'Candidate Added',
          `${name.trim()} has been successfully added to the candidate pipeline.`,
          'success'
        );
      }
      onCandidateAdded();
      onClose();
    } catch (err) {
      console.error('Failed to create candidate application', err);
      if (onShowNotification) {
        onShowNotification('Error', 'Failed to add candidate. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Add Candidate">
      <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-65px)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          <p className="text-xs text-slate-500">
            Fill in the information below to add a new candidate to the pipeline.
          </p>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" />
              <span>Full Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. John Doe"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.name && <p className="text-xs font-semibold text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>Email Address *</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="e.g. john.doe@example.com"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.email && <p className="text-xs font-semibold text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>Phone Number *</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              placeholder="e.g. +1 (555) 019-2834"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.phone && <p className="text-xs font-semibold text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Opportunity Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-slate-400" />
              <span>Applied Opportunity *</span>
            </label>
            <select
              value={opportunityId}
              onChange={(e) => {
                setOpportunityId(e.target.value);
                if (errors.opportunityId) setErrors((prev) => ({ ...prev, opportunityId: '' }));
              }}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-white ${
                errors.opportunityId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="">Select Opportunity</option>
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.mode})
                </option>
              ))}
            </select>
            {errors.opportunityId && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.opportunityId}</p>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Initial Pipeline Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Pending' | 'Interview' | 'Accepted' | 'Rejected')}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="Pending">Pending Review</option>
              <option value="Interview">Interviewing</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Candidate'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
