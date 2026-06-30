"use client";

import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/feature/ui/Drawer';
import { Stepper } from '@/components/feature/ui/Stepper';
import { Button } from '@/components/feature/ui/Button';
import { Card } from '@/components/feature/ui/Card';
import { ChevronRight, ChevronLeft, CreditCard, User, FileText, CheckCircle2 } from 'lucide-react';
import { paymentService } from '@/src/services/payment.service';
import { PaymentTransaction, PaymentMode, PaymentStatus } from '@/src/types/payment.types';

interface CreatePaymentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated?: () => void;
}

const STEPS = ['Student & Invoice', 'Payment Details', 'Review & Confirm'];

export function CreatePaymentWizard({ 
  isOpen, 
  onClose, 
  onPaymentCreated
}: CreatePaymentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [program, setProgram] = useState('');
  
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMode>('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setStudentId('');
      setStudentName('');
      setInvoiceNumber('');
      setProgram('');
      setAmount('');
      setPaymentMethod('UPI');
      setReferenceNumber('');
      setCurrentStep(0);
      setErrors({});
    }
  }, [isOpen]);

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!invoiceNumber.trim()) newErrors.invoiceNumber = 'Invoice Number is required';
    if (!program.trim()) newErrors.program = 'Program is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!referenceNumber.trim() && paymentMethod !== 'Cash') newErrors.referenceNumber = 'Reference number is required for online payments';
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

  const handleCreatePayment = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload: Partial<PaymentTransaction> = {
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        invoiceNumber: invoiceNumber.trim(),
        program: program.trim(),
        amount: Number(amount),
        netAmount: Number(amount), // Ignoring taxes/fines for simplicity in form
        gst: 0,
        discount: 0,
        fine: 0,
        paymentMethod,
        referenceNumber: referenceNumber.trim(),
        status: 'Pending', // Default status for new payment
        createdDate: new Date().toISOString(),
      };

      await paymentService.createPayment(payload);

      if (onPaymentCreated) {
        onPaymentCreated();
      }
      onClose();
    } catch (err) {
      console.error('Failed to create payment', err);
      alert('Failed to process payment entry.');
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
                <label className="text-sm font-bold text-label">Invoice Number *</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={e => {
                    setInvoiceNumber(e.target.value);
                    if (errors.invoiceNumber) setErrors(prev => ({ ...prev, invoiceNumber: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.invoiceNumber 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="e.g. INV-2024-001"
                />
                {errors.invoiceNumber && <p className="text-xs font-semibold text-red-500 mt-1">{errors.invoiceNumber}</p>}
              </div>

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
                  placeholder="e.g. B.Tech CS"
                />
                {errors.program && <p className="text-xs font-semibold text-red-500 mt-1">{errors.program}</p>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Amount (₹) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => {
                    setAmount(e.target.value);
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                  }}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.amount 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-border focus:border-primary focus:ring-primary'
                  }`}
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-xs font-semibold text-red-500 mt-1">{errors.amount}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-label">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMode)}
                  className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="NEFT">NEFT</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-label">Reference/Transaction ID {paymentMethod !== 'Cash' && '*'}</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={e => {
                  setReferenceNumber(e.target.value);
                  if (errors.referenceNumber) setErrors(prev => ({ ...prev, referenceNumber: '' }));
                }}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.referenceNumber 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : 'border-border focus:border-primary focus:ring-primary'
                }`}
                placeholder={paymentMethod === 'Cash' ? "Optional for Cash" : "Enter transaction ID"}
              />
              {errors.referenceNumber && <p className="text-xs font-semibold text-red-500 mt-1">{errors.referenceNumber}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-6 space-y-6">
            <Card>
              <div className="p-4 border-b border-border bg-slate-50/50 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider">Payment Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Student</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{studentName} ({studentId})</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Program</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{program}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Invoice Number</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Payment Method</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Amount</p>
                    <p className="text-sm font-semibold text-emerald-600 mt-1">₹{Number(amount).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">Ref / Txn ID</p>
                    <p className="text-sm font-semibold text-text-primary mt-1">{referenceNumber || 'N/A'}</p>
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
    <Drawer isOpen={isOpen} onClose={onClose} title="Record Payment">
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
            onClick={currentStep === STEPS.length - 1 ? handleCreatePayment : handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Processing...'
            ) : currentStep === STEPS.length - 1 ? (
              'Confirm Payment'
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
