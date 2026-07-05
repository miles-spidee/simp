"use client";

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Card } from '@/components/feature/ui/Card';
import { ChevronRight, ChevronLeft, Briefcase, Calendar, MapPin, Users, Info, DollarSign } from 'lucide-react';
import { opportunitiesService } from '@/src/services/opportunities.service';
import { programService } from '@/src/services/program.service';
import { Opportunity } from '@/src/types/opportunities.types';

interface CreateOpportunityWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunityCreated?: () => void;
  opportunityToView?: Opportunity | null;
  viewMode?: boolean;
}

const STEPS = ['Opportunity Details', 'Review & Post'];

const COLOR_THEMES = [
  { name: 'Blue (Tech)', value: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400' },
  { name: 'Purple (Design)', value: 'from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400' },
  { name: 'Emerald (Analytics)', value: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400' }
];

export function CreateOpportunityWizard({ 
  isOpen, 
  onClose, 
  onOpportunityCreated, 
  opportunityToView, 
  viewMode = false 
}: CreateOpportunityWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [type, setType] = useState('Tech');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('6 Months');
  const [mode, setMode] = useState('Remote');
  const [seats, setSeats] = useState('5 Openings');
  const [eligibility, setEligibility] = useState('B.Tech CS/IT (3rd or 4th Year)');
  const [startDate, setStartDate] = useState('Starts Jan 2024');
  const [color, setColor] = useState('from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400');
  const [internshipType, setInternshipType] = useState<"free" | "paid" | "stipend" | "industrial" | "corporate" | "research" >('free');
  const [amount, setAmount] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (opportunityToView) {
        setTitle(opportunityToView.title || '');
        setType(opportunityToView.type || 'Tech');
        setDescription(opportunityToView.description || '');
        setDuration(opportunityToView.duration || '6 Months');
        setMode(opportunityToView.mode || 'Remote');
        setSeats(opportunityToView.seats || '5 Openings');
        setEligibility(opportunityToView.eligibility || '');
        setStartDate(opportunityToView.startDate || '');
        setColor(opportunityToView.color || 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400');
        setInternshipType(opportunityToView.internshipType || 'free');
        setAmount(opportunityToView.amount || '');
        
        if (viewMode) {
          setCurrentStep(1);
        } else {
          setCurrentStep(0);
        }
      } else {
        // Reset form fields
        setTitle('');
        setType('Tech');
        setDescription('');
        setDuration('6 Months');
        setMode('Remote');
        setSeats('5 Openings');
        setEligibility('B.Tech CS/IT (3rd or 4th Year)');
        setStartDate('Starts Jan 2024');
        setColor('from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400');
        setInternshipType('free');
        setAmount('');
        setCurrentStep(0);
      }
      setErrors({});
    }
    // load programs for title suggestions
    (async () => {
      try {
        const data = await programService.getPrograms();
        setPrograms(data);
        if (opportunityToView && (opportunityToView as any).programId) {
          const match = data.find((p: any) => p.program_id === (opportunityToView as any).programId || p.id === (opportunityToView as any).programId);
          if (match) setSelectedProgram(match);
        }
      } catch (err) {
        console.debug('Failed to load programs for title suggestions', err);
      }
    })();
  }, [isOpen, opportunityToView, viewMode]);

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!type.trim()) newErrors.type = 'Type is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!duration.trim()) newErrors.duration = 'Duration is required';
    if (!mode.trim()) newErrors.mode = 'Mode is required';
    if (!seats.trim()) newErrors.seats = 'Seats is required';
    if (!eligibility.trim()) newErrors.eligibility = 'Eligibility is required';
    if (!startDate.trim()) newErrors.startDate = 'Start date is required';
    if ((internshipType === 'paid' || internshipType === 'stipend') && !amount.trim()) {
      newErrors.amount = 'Amount is required for paid/stipend positions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && validateStep0()) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePostOpportunity = async () => {
    if (!validateStep0()) {
      setCurrentStep(0);
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, '')) || 0;
      const payload: any = {
        role_name: title.trim(),
        role_description: description.trim(),
        project_title: title.trim(),
        duration_weeks: parseInt(duration.replace(/\D/g, '')) * 4 || 24,
        stipend: internshipType === 'stipend' ? parsedAmount : 0,
        fee: internshipType === 'paid' ? parsedAmount : 0,
        total_openings: parseInt(seats.replace(/\D/g, '')) || 10,
        application_deadline: startDate.trim(),
        opening_status: 'Active',
      };
      if (selectedProgram) payload.program_id = selectedProgram.program_id || selectedProgram.id || selectedProgram.programId;

      await opportunitiesService.createOpportunity(payload as any);

      if (onOpportunityCreated) {
        onOpportunityCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to post opportunity', err);
      alert('Failed to post opportunity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDrawerTitle = () => {
    if (viewMode) return "View Opportunity Details";
    return "Post New Opportunity";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-label">Opportunity Title *</label>
              <div>
                <input
                  type="text"
                  list="programs-list"
                  value={title}
                  onChange={e => {
                    const v = e.target.value;
                    setTitle(v);
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));

                    // check for exact program name match and autofill
                    const match = programs.find((p: any) => String(p.program_name || p.title || p.name).trim() === v.trim());
                    if (match) {
                      setSelectedProgram(match);
                      setType((match as any).type || (match as any).program_type || 'Tech');
                      const weeks = (match as any).duration_weeks || (match as any).durationWeeks || ((match as any).duration_months ? (match as any).duration_months * 4 : 0);
                      setDuration(weeks ? `${Math.round(weeks / 4)} Months` : '6 Months');
                      setSeats((match as any).capacity ? String((match as any).capacity) : ((match as any).seats ? String((match as any).seats) : '5 Openings'));
                      setEligibility((match as any).eligibility || (match as any).description || 'Any Degree');
                      setStartDate((match as any).startDate || (match as any).start_date || '');
                      setDescription((match as any).description || (match as any).program_description || '');
                    } else {
                      setSelectedProgram(null);
                    }
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.title 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Choose program or type a custom title"
                />
                <datalist id="programs-list">
                  {programs.map(p => (
                    <option key={p.program_id} value={p.program_name} />
                  ))}
                </datalist>
              </div>
              {errors.title && <p className="text-xs font-semibold text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Type (Tech/Design/etc) *</label>
                <input
                  type="text"
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.type 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. Tech"
                />
                {errors.type && <p className="text-xs font-semibold text-red-500 mt-1">{errors.type}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Mode (Remote/Hybrid) *</label>
                <input
                  type="text"
                  value={mode}
                  onChange={e => {
                    setMode(e.target.value);
                    if (errors.mode) setErrors(prev => ({ ...prev, mode: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.mode 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. Remote"
                />
                {errors.mode && <p className="text-xs font-semibold text-red-500 mt-1">{errors.mode}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Seats/Openings *</label>
                <input
                  type="text"
                  value={seats}
                  onChange={e => {
                    setSeats(e.target.value);
                    if (errors.seats) setErrors(prev => ({ ...prev, seats: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.seats 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. 5 Openings"
                />
                {errors.seats && <p className="text-xs font-semibold text-red-500 mt-1">{errors.seats}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Internship Type</label>
                <select
                  value={internshipType}
                  onChange={e => {
                    setInternshipType(e.target.value as any);
                  }}
                  className="w-full rounded-lg border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="stipend">Stipend</option>
                  <option value="industrial">Industrial</option>
                  <option value="corporate">Corporate</option>
                  <option value="research">Research</option>
                </select>
              </div>

              {(internshipType === 'paid' || internshipType === 'stipend') && (
                <div className="space-y-2 animate-slide-in">
                  <label className="text-sm font-bold text-label">{internshipType === 'paid' ? 'Fee Amount *' : 'Stipend Amount *'}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <input
                      type="text"
                      value={amount}
                      onChange={e => {
                        setAmount(e.target.value);
                        if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                      }}
                      className={`w-full rounded-lg border pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.amount 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-border focus:border-primary focus:ring-primary'
                      }`}
                      placeholder={internshipType === 'stipend' ? 'e.g. 500/Month' : 'e.g. 2500'}
                    />
                  </div>
                  {errors.amount && <p className="text-xs font-semibold text-red-500 mt-1">{errors.amount}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Duration *</label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => {
                    setDuration(e.target.value);
                    if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all ${
                    errors.duration 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. 6 Months"
                />
                {errors.duration && <p className="text-[10px] font-semibold text-red-500 mt-0.5">{errors.duration}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-label">Start Date *</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={e => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all ${
                    errors.startDate 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. Starts Jan 2024"
                />
                {errors.startDate && <p className="text-[10px] font-semibold text-red-500 mt-0.5">{errors.startDate}</p>}
              </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-label">Eligibility Criteria *</label>
              <input
                type="text"
                value={eligibility}
                onChange={e => {
                  setEligibility(e.target.value);
                  if (errors.eligibility) setErrors(prev => ({ ...prev, eligibility: '' }));
                }}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.eligibility 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder="e.g. B.Tech CS/IT (3rd or 4th Year)"
              />
              {errors.eligibility && <p className="text-xs font-semibold text-red-500 mt-1">{errors.eligibility}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-label">Card Color Theme *</label>
              <select
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white"
              >
                {COLOR_THEMES.map(theme => (
                  <option key={theme.value} value={theme.value}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

              {/* Row 4: Job Description (spans all columns) */}
              <div className="space-y-1.5 md:col-span-3 xl:col-span-4">
                <label className="text-xs font-bold text-label">Job Description *</label>
                <textarea
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  rows={2}
                  className={`w-full rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-1 transition-all ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="Describe roles, responsibilities, and team context..."
                />
                {errors.description && <p className="text-[10px] font-semibold text-red-500 mt-0.5">{errors.description}</p>}
              </div>

            </div>
          </div>
        );
      case 1:
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Opportunity Overview</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Opportunity Title</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{title}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Type</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{type}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-text-secondary" /> Seats / Openings
                    </p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{seats}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-text-secondary" /> Mode
                    </p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{mode}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Internship Type</p>
                    <p className="text-sm font-semibold text-text-primary mt-1 capitalize">{internshipType}</p>
                  </div>
                  {(internshipType === 'paid' || internshipType === 'stipend') && (
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Amount</p>
                      <p className="text-sm font-semibold text-text-primary mt-1">{amount}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{duration}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Start Date</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Eligibility</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{eligibility}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Theme Color</p>
                    <p className="text-xs font-semibold mt-1 text-text-secondary truncate max-w-xs">{COLOR_THEMES.find(t => t.value === color)?.name || 'Custom'}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-2">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Description</p>
                  <p className="text-sm text-text-primary mt-1.5 whitespace-pre-line leading-relaxed">{description}</p>
                </div>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={getDrawerTitle()}>
      <div className="flex flex-col h-full min-h-0">
        {!viewMode && <Stepper steps={STEPS} currentStep={currentStep} />}
        
        <div className="flex-1 overflow-y-auto bg-white">
          {renderStepContent()}
        </div>
        
        <div className="shrink-0 border-t border-border p-4 bg-slate-50 flex items-center justify-between">
          {viewMode ? (
            <div className="w-full flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={currentStep === 0 ? onClose : handleBack}
                disabled={isSubmitting}
              >
                {currentStep === 0 ? 'Cancel' : (
                  <>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </>
                )}
              </Button>
              
              <Button 
                onClick={currentStep === STEPS.length - 1 ? handlePostOpportunity : handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Posting...'
                ) : currentStep === STEPS.length - 1 ? (
                  'Post Opportunity'
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
