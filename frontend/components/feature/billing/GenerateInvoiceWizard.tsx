"use client";

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Card } from '@/components/feature/ui/Card';
import { ChevronRight, ChevronLeft, FileText, CheckCircle2 } from 'lucide-react';
import { billingService } from '@/src/services/billing.service';
import { Invoice } from '@/src/types/billing.types';

interface GenerateInvoiceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated?: () => void;
}

const STEPS = ['Student Info', 'Invoice Details', 'Review & Generate'];

export function GenerateInvoiceWizard({ 
  isOpen, 
  onClose, 
  onInvoiceCreated
}: GenerateInvoiceWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [subTotal, setSubTotal] = useState('');
  const [taxAmount, setTaxAmount] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setStudentId('');
      setStudentName('');
      setDueDate('');
      setSubTotal('');
      setTaxAmount('0');
      setCurrentStep(0);
      setErrors({});
    }
  }, [isOpen]);

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!dueDate.trim()) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!subTotal || isNaN(Number(subTotal)) || Number(subTotal) <= 0) newErrors.subTotal = 'Valid amount is required';
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

  const handleGenerateInvoice = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const st = Number(subTotal);
      const tax = Number(taxAmount || 0);
      
      const payload: Partial<Invoice> = {
        customerName: studentName.trim(),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate,
        items: [],
        discount: 0,
        subTotal: st,
        taxAmount: tax,
        grandTotal: st + tax,
        paymentStatus: 'Unpaid',
      };

      await billingService.generateInvoice(payload);

      if (onInvoiceCreated) {
        onInvoiceCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to generate invoice', err);
      alert('Failed to generate invoice.');
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
                <label className="text-sm font-bold text-label">Student ID *</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={e => {
                    setStudentId(e.target.value);
                    if (errors.studentId) setErrors(prev => ({ ...prev, studentId: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.studentId 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. STU12345"
                />
                {errors.studentId && <p className="text-xs font-semibold text-red-500 mt-1">{errors.studentId}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Student Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => {
                    setStudentName(e.target.value);
                    if (errors.studentName) setErrors(prev => ({ ...prev, studentName: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.studentName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. John Doe"
                />
                {errors.studentName && <p className="text-xs font-semibold text-red-500 mt-1">{errors.studentName}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Due Date *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => {
                    setDueDate(e.target.value);
                    if (errors.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.dueDate 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.dueDate && <p className="text-xs font-semibold text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Sub Total (₹) *</label>
                <input
                  type="number"
                  value={subTotal}
                  onChange={e => {
                    setSubTotal(e.target.value);
                    if (errors.subTotal) setErrors(prev => ({ ...prev, subTotal: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.subTotal 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="0.00"
                />
                {errors.subTotal && <p className="text-xs font-semibold text-red-500 mt-1">{errors.subTotal}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Tax Amount (₹)</label>
                <input
                  type="number"
                  value={taxAmount}
                  onChange={e => {
                    setTaxAmount(e.target.value);
                  }}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        const total = Number(subTotal || 0) + Number(taxAmount || 0);
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Invoice Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Student</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{studentName} ({studentId})</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Due Date</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{dueDate}</p>
                  </div>
                  <div className="col-span-2 border-t border-border mt-2 pt-4">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Amount Details</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Sub Total</span>
                        <span className="font-medium">₹{Number(subTotal || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Tax</span>
                        <span className="font-medium">₹{Number(taxAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                        <span className="text-text-primary">Grand Total</span>
                        <span className="text-blue-600">₹{total.toLocaleString('en-IN')}</span>
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
    <Drawer isOpen={isOpen} onClose={onClose} title="Generate Invoice">
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
            onClick={currentStep === STEPS.length - 1 ? handleGenerateInvoice : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Processing...'
            ) : currentStep === STEPS.length - 1 ? (
              'Generate Invoice'
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
