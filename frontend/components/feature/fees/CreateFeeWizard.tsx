"use client";

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Card } from '@/components/feature/ui/Card';
import { ChevronRight, ChevronLeft, FileText, CheckCircle2 } from 'lucide-react';
import { feeService } from '@/src/services/fee.service';
import { FeeStructure } from '@/src/types/fee.types';

interface CreateFeeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFeeCreated?: () => void;
}

const STEPS = ['Fee Details', 'Amounts', 'Review & Confirm'];

export function CreateFeeWizard({ 
  isOpen, 
  onClose, 
  onFeeCreated
}: CreateFeeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [program, setProgram] = useState('');
  const [batch, setBatch] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  
  const [tuitionFee, setTuitionFee] = useState('');
  const [hostelFee, setHostelFee] = useState('');
  const [transportFee, setTransportFee] = useState('');
  const [otherFees, setOtherFees] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setProgram('');
      setBatch('');
      setAcademicYear('');
      setTuitionFee('');
      setHostelFee('');
      setTransportFee('');
      setOtherFees('');
      setCurrentStep(0);
      setErrors({});
    }
  }, [isOpen]);

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!program.trim()) newErrors.program = 'Program is required';
    if (!batch.trim()) newErrors.batch = 'Batch is required';
    if (!academicYear.trim()) newErrors.academicYear = 'Academic Year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!tuitionFee || isNaN(Number(tuitionFee)) || Number(tuitionFee) < 0) newErrors.tuitionFee = 'Valid tuition fee is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && validateStep0()) {
      setCurrentStep(1);
    } else if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCreateFee = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload: Partial<FeeStructure> = {
        feeName: `${program.trim()} - ${academicYear.trim()}`,
        feeType: 'Training',
        program: program.trim(),
        department: academicYear.trim(),
        applicableBatch: batch.trim(),
        amount: Number(tuitionFee) + Number(hostelFee || 0) + Number(transportFee || 0) + Number(otherFees || 0),
        status: 'Active',
        installments: 1,
        duration: '1 Year'
      };

      await feeService.createFee(payload);

      if (onFeeCreated) {
        onFeeCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to create fee structure', err);
      alert('Failed to process fee structure entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Program *</label>
                <input
                  type="text"
                  value={program}
                  onChange={e => {
                    setProgram(e.target.value);
                    if (errors.program) setErrors(prev => ({ ...prev, program: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.program 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. B.Tech Computer Science"
                />
                {errors.program && <p className="text-xs font-semibold text-red-500 mt-1">{errors.program}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Batch *</label>
                <input
                  type="text"
                  value={batch}
                  onChange={e => {
                    setBatch(e.target.value);
                    if (errors.batch) setErrors(prev => ({ ...prev, batch: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.batch 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. 2024-2028"
                />
                {errors.batch && <p className="text-xs font-semibold text-red-500 mt-1">{errors.batch}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Academic Year *</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={e => {
                    setAcademicYear(e.target.value);
                    if (errors.academicYear) setErrors(prev => ({ ...prev, academicYear: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.academicYear 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. 2024-25"
                />
                {errors.academicYear && <p className="text-xs font-semibold text-red-500 mt-1">{errors.academicYear}</p>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Tuition Fee (₹) *</label>
                <input
                  type="number"
                  value={tuitionFee}
                  onChange={e => {
                    setTuitionFee(e.target.value);
                    if (errors.tuitionFee) setErrors(prev => ({ ...prev, tuitionFee: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.tuitionFee 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="0.00"
                />
                {errors.tuitionFee && <p className="text-xs font-semibold text-red-500 mt-1">{errors.tuitionFee}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Hostel Fee (₹)</label>
                <input
                  type="number"
                  value={hostelFee}
                  onChange={e => {
                    setHostelFee(e.target.value);
                  }}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Transport Fee (₹)</label>
                <input
                  type="number"
                  value={transportFee}
                  onChange={e => {
                    setTransportFee(e.target.value);
                  }}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Other Fees (₹)</label>
                <input
                  type="number"
                  value={otherFees}
                  onChange={e => {
                    setOtherFees(e.target.value);
                  }}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        const totalFee = Number(tuitionFee || 0) + Number(hostelFee || 0) + Number(transportFee || 0) + Number(otherFees || 0);
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Fee Structure Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Program</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{program}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Batch</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{batch}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Academic Year</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{academicYear}</p>
                  </div>
                  <div className="col-span-2 border-t border-border mt-2 pt-4">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Fee Breakdown</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Tuition Fee</span>
                        <span className="font-medium">₹{Number(tuitionFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Hostel Fee</span>
                        <span className="font-medium">₹{Number(hostelFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Transport Fee</span>
                        <span className="font-medium">₹{Number(transportFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Other Fees</span>
                        <span className="font-medium">₹{Number(otherFees || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                        <span className="text-text-primary">Total Applicable</span>
                        <span className="text-blue-600">₹{totalFee.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
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
    <Drawer isOpen={isOpen} onClose={onClose} title="Create Fee Structure">
      <div className="flex flex-col h-full min-h-0">
        <Stepper steps={STEPS} currentStep={currentStep} />
        
        <div className="flex-1 overflow-y-auto bg-white">
          {renderStepContent()}
        </div>
        
        <div className="shrink-0 border-t border-border p-4 bg-slate-50 flex items-center justify-between">
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
            onClick={currentStep === STEPS.length - 1 ? handleCreateFee : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Processing...'
            ) : currentStep === STEPS.length - 1 ? (
              'Create Fee Structure'
            ) : (
              <>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
