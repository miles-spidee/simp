"use client";

import React, { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// SVG Icon Sub-components for professional visual representation
const UserIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AcademicIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const ProfessionalIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SpecificIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DocumentIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MotivationIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const ReviewIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const WarningIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CorporateIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const SuccessCheckIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowBackIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const getStepIcon = (index: number, className = "h-4 w-4") => {
  switch (index) {
    case 0: return <UserIcon className={className} />;
    case 1: return <AcademicIcon className={className} />;
    case 2: return <ProfessionalIcon className={className} />;
    case 3: return <SpecificIcon className={className} />;
    case 4: return <DocumentIcon className={className} />;
    case 5: return <MotivationIcon className={className} />;
    case 6: return <ReviewIcon className={className} />;
    default: return null;
  }
};

// Data Model Interface matching the requested structure
interface FileData {
  name: string;
  size: number;
  type: string;
  base64: string;
}

interface ApplicationState {
  personalInformation: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    state: string;
  };
  academicInformation: {
    collegeName: string;
    department: string;
    degree: string;
    currentYear: string;
    cgpaPercentage: string;
    graduationYear: string;
  };
  professionalInformation: {
    skills: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    projectExperience: string;
  };
  internshipSpecificData: {
    feeAcceptance: boolean;
    paymentMode: string;
    transactionId: string;
    paymentScreenshot: FileData | null;
    relevantExperience: string;
    preferredTechStack: string;
    relevantTechnicalExperience: string;
    researchAreaOfInterest: string;
    researchInterestStatement: string;
    publicationsAvailable: "Yes" | "No";
    publicationLinks: string;
  };
  documents: {
    resume: FileData | null;
  };
  motivation: {
    whyInternship: string;
  };
}

const initialFormState: ApplicationState = {
  personalInformation: {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
  },
  academicInformation: {
    collegeName: "",
    department: "",
    degree: "",
    currentYear: "",
    cgpaPercentage: "",
    graduationYear: "",
  },
  professionalInformation: {
    skills: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    projectExperience: "",
  },
  internshipSpecificData: {
    feeAcceptance: false,
    paymentMode: "",
    transactionId: "",
    paymentScreenshot: null,
    relevantExperience: "",
    preferredTechStack: "",
    relevantTechnicalExperience: "",
    researchAreaOfInterest: "",
    researchInterestStatement: "",
    publicationsAvailable: "No",
    publicationLinks: "",
  },
  documents: {
    resume: null,
  },
  motivation: {
    whyInternship: "",
  },
};

const steps = [
  { id: 1, label: "Personal Information" },
  { id: 2, label: "Academic Information" },
  { id: 3, label: "Professional Information" },
  { id: 4, label: "Internship Specific" },
  { id: 5, label: "Documents" },
  { id: 6, label: "Motivation" },
  { id: 7, label: "Review & Submit" }
];

function ApplicationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || "free";
  
  // Available types matching listing values
  const validTypes = ["free", "paid", "stipend", "industrial", "corporate", "research"];
  const internshipType = validTypes.includes(typeParam) ? typeParam : "free";

  const [currentStep, setCurrentStep] = useState(0);
  const [formState, setFormState] = useState<ApplicationState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dragRefResume = useRef<HTMLDivElement>(null);
  const dragRefScreenshot = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Load draft from localStorage on mount/type change
  useEffect(() => {
    const savedDraft = localStorage.getItem(`pinesphere_internship_draft_${internshipType}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormState((prev) => ({
          ...prev,
          personalInformation: { ...prev.personalInformation, ...parsed.personalInformation },
          academicInformation: { ...prev.academicInformation, ...parsed.academicInformation },
          professionalInformation: { ...prev.professionalInformation, ...parsed.professionalInformation },
          internshipSpecificData: { ...prev.internshipSpecificData, ...parsed.internshipSpecificData },
          documents: { ...prev.documents, ...parsed.documents },
          motivation: { ...prev.motivation, ...parsed.motivation }
        }));
      } catch (err) {
        console.error("Failed to parse saved draft", err);
      }
    }
  }, [internshipType]);

  // Save draft to localStorage on state change
  useEffect(() => {
    if (formState !== initialFormState) {
      localStorage.setItem(`pinesphere_internship_draft_${internshipType}`, JSON.stringify(formState));
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [formState, internshipType]);

  // Handle simple input modifications
  const handleInputChange = (section: keyof ApplicationState, field: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section] as object,
        [field]: value
      }
    }));
    
    // Clear error immediately on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const stepErrors = validateStepFields(currentStep);
    if (stepErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: stepErrors[field] }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Helper validation logic for current step fields
  const validateStepFields = (stepIdx: number): Record<string, string> => {
    const stepErrors: Record<string, string> = {};

    if (stepIdx === 0) {
      const { firstName, lastName, email, mobileNumber, city, state } = formState.personalInformation;
      if (!firstName || firstName.trim().length < 2) {
        stepErrors.firstName = "First name must be at least 2 characters.";
      }
      if (!lastName || lastName.trim().length < 2) {
        stepErrors.lastName = "Last name must be at least 2 characters.";
      }
      if (!email) {
        stepErrors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        stepErrors.email = "Please enter a valid email address.";
      }
      if (!mobileNumber) {
        stepErrors.mobileNumber = "Mobile number is required.";
      } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(mobileNumber)) {
        stepErrors.mobileNumber = "Please enter a valid mobile number (10-15 digits).";
      }
      if (!city || !city.trim()) {
        stepErrors.city = "City is required.";
      }
      if (!state || !state.trim()) {
        stepErrors.state = "State is required.";
      }
    }

    if (stepIdx === 1) {
      const { collegeName, department, degree, currentYear, cgpaPercentage, graduationYear } = formState.academicInformation;
      if (!collegeName || !collegeName.trim()) stepErrors.collegeName = "College name is required.";
      if (!department || !department.trim()) stepErrors.department = "Department is required.";
      if (!degree || !degree.trim()) stepErrors.degree = "Degree is required.";
      if (!currentYear) stepErrors.currentYear = "Please select your current year.";
      if (!cgpaPercentage) {
        stepErrors.cgpaPercentage = "CGPA or percentage is required.";
      } else {
        const val = parseFloat(cgpaPercentage);
        if (isNaN(val) || val < 0 || val > 100) {
          stepErrors.cgpaPercentage = "Please enter a valid CGPA (0-10) or Percentage (0-100).";
        }
      }
      if (!graduationYear) {
        stepErrors.graduationYear = "Graduation year is required.";
      } else {
        const year = parseInt(graduationYear);
        if (isNaN(year) || year < 2020 || year > 2040) {
          stepErrors.graduationYear = "Please enter a valid year (e.g. 2026).";
        }
      }
    }

    if (stepIdx === 2) {
      const { skills, githubUrl, linkedinUrl, portfolioUrl } = formState.professionalInformation;
      if (!skills || !skills.trim()) stepErrors.skills = "Please enter your technical skills.";
      
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
      if (githubUrl && !urlPattern.test(githubUrl)) stepErrors.githubUrl = "Please enter a valid GitHub URL.";
      if (linkedinUrl && !urlPattern.test(linkedinUrl)) stepErrors.linkedinUrl = "Please enter a valid LinkedIn URL.";
      if (portfolioUrl && !urlPattern.test(portfolioUrl)) stepErrors.portfolioUrl = "Please enter a valid portfolio URL.";
    }

    if (stepIdx === 3) {
      if (internshipType === "paid") {
        const { feeAcceptance, paymentMode, transactionId, paymentScreenshot } = formState.internshipSpecificData;
        if (!feeAcceptance) stepErrors.feeAcceptance = "You must accept the fee guidelines.";
        if (!paymentMode) stepErrors.paymentMode = "Please select a payment mode.";
        if (!transactionId || transactionId.trim().length < 6) {
          stepErrors.transactionId = "Transaction ID must be at least 6 characters.";
        }
        if (!paymentScreenshot) stepErrors.paymentScreenshot = "Please upload payment receipt screenshot.";
      } else if (internshipType === "stipend") {
        const { relevantExperience } = formState.internshipSpecificData;
        if (!relevantExperience || relevantExperience.trim().length < 15) {
          stepErrors.relevantExperience = "Please describe your relevant experience (minimum 15 characters).";
        }
      } else if (internshipType === "industrial") {
        const { preferredTechStack, relevantTechnicalExperience } = formState.internshipSpecificData;
        if (!preferredTechStack || !preferredTechStack.trim()) stepErrors.preferredTechStack = "Preferred Tech Stack is required.";
        if (!relevantTechnicalExperience || !relevantTechnicalExperience.trim()) stepErrors.relevantTechnicalExperience = "Relevant Technical Experience is required.";
      } else if (internshipType === "research") {
        const { researchAreaOfInterest, researchInterestStatement, publicationsAvailable, publicationLinks } = formState.internshipSpecificData;
        if (!researchAreaOfInterest || !researchAreaOfInterest.trim()) stepErrors.researchAreaOfInterest = "Research area is required.";
        if (!researchInterestStatement || researchInterestStatement.trim().length < 15) {
          stepErrors.researchInterestStatement = "Research statement must be at least 15 characters.";
        }
        if (publicationsAvailable === "Yes" && (!publicationLinks || !publicationLinks.trim())) {
          stepErrors.publicationLinks = "Please provide your publication links.";
        }
      }
    }

    if (stepIdx === 4) {
      const { resume } = formState.documents;
      if (!resume) stepErrors.resume = "Resume PDF file is required.";
    }

    if (stepIdx === 5) {
      const { whyInternship } = formState.motivation;
      if (!whyInternship || whyInternship.trim().length < 100) {
        stepErrors.whyInternship = `Please expand your motivation statement. Must be at least 100 characters (Current: ${whyInternship?.length || 0}/100).`;
      }
    }

    return stepErrors;
  };

  // Check if step fields are fully valid before moving on or jumping steps
  const isStepValid = (stepIdx: number): boolean => {
    const stepErrors = validateStepFields(stepIdx);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    const stepErrors = validateStepFields(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const newTouched: Record<string, boolean> = {};
      Object.keys(stepErrors).forEach((key) => {
        newTouched[key] = true;
      });
      setTouched((prev) => ({ ...prev, ...newTouched }));

      const firstErrorField = Object.keys(stepErrors)[0];
      const el = document.getElementsByName(firstErrorField)[0];
      if (el) el.focus();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Jump to step if previous steps are valid
  const handleStepJump = (index: number) => {
    for (let i = 0; i < index; i++) {
      if (!isStepValid(i)) {
        const stepErrors = validateStepFields(i);
        setErrors(stepErrors);
        setCurrentStep(i);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    setCurrentStep(index);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // File Upload Helper (converts to base64)
  const processFile = (file: File, type: "resume" | "screenshot") => {
    const maxResumeSize = 10 * 1024 * 1024; // 10MB
    const maxScreenshotSize = 5 * 1024 * 1024; // 5MB

    if (type === "resume") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, resume: "Only PDF format is accepted." }));
        return;
      }
      if (file.size > maxResumeSize) {
        setErrors((prev) => ({ ...prev, resume: "Resume size must be under 10MB." }));
        return;
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, paymentScreenshot: "Accepted files: JPEG, PNG, WEBP, or PDF." }));
        return;
      }
      if (file.size > maxScreenshotSize) {
        setErrors((prev) => ({ ...prev, paymentScreenshot: "Payment screenshot must be under 5MB." }));
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      const fileObj: FileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64: reader.result as string
      };

      if (type === "resume") {
        setFormState((prev) => ({
          ...prev,
          documents: { ...prev.documents, resume: fileObj }
        }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next.resume;
          return next;
        });
      } else {
        setFormState((prev) => ({
          ...prev,
          internshipSpecificData: { ...prev.internshipSpecificData, paymentScreenshot: fileObj }
        }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next.paymentScreenshot;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: "resume" | "screenshot") => {
    if (type === "resume") {
      setFormState((prev) => ({
        ...prev,
        documents: { ...prev.documents, resume: null }
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        internshipSpecificData: { ...prev.internshipSpecificData, paymentScreenshot: null }
      }));
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    for (let i = 0; i < steps.length - 1; i++) {
      if (!isStepValid(i)) {
        const stepErrors = validateStepFields(i);
        setErrors(stepErrors);
        setCurrentStep(i);
        setIsSubmitting(false);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    setTimeout(() => {
      localStorage.removeItem(`pinesphere_internship_draft_${internshipType}`);
      setIsSubmitting(false);
      router.push(`/success?type=${internshipType}`);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" ref={topRef}>
      
      {/* LEFT COLUMN: Sticky Step List (checking validation states natively) */}
      <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase">Application Sections</h2>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isSaved ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
            {isSaved ? "Saved" : "Auto-saved"}
          </div>
        </div>

        <nav aria-label="Step Progress">
          <ol className="space-y-4">
            {steps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isDone = idx < currentStep;
              
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => handleStepJump(idx)}
                    className="flex items-start gap-4 text-left w-full group transition-all"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center shrink-0 rounded-xl font-semibold text-xs border transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105" 
                        : isDone 
                          ? "bg-blue-50 text-blue-600 border-blue-150" 
                          : "bg-slate-50 text-slate-400 border-slate-200 group-hover:bg-slate-100"
                    }`}>
                      {isDone ? (
                        <SuccessCheckIcon className="h-4 w-4" />
                      ) : (
                        getStepIcon(idx, isActive ? "h-4 w-4 text-white" : "h-4 w-4 text-slate-400")
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold transition-all ${
                        isActive ? "text-slate-950 font-extrabold" : "text-slate-650"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {isActive ? "Currently viewing" : isDone ? "Complete" : "Pending fields"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>

      {/* RIGHT COLUMN: Interactive Form Content */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        {/* Mobile progress Indicator header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
            <h2 className="text-lg font-bold text-slate-900">{steps[currentStep].label}</h2>
          </div>
          <div className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? "bg-emerald-500" : "bg-slate-300"}`}></span>
            {isSaved ? "SAVING..." : "AUTO-SAVED"}
          </div>
        </div>

        {/* Global horizontal progress line on top of form */}
        <div className="hidden lg:block mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Application Progress</span>
            <span className="text-xs font-bold text-blue-600">{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-2 transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleFinalSubmit} noValidate>
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 0 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Personal Information</h3>
                <p className="text-xs text-slate-400">Please provide your contact and identification details as they appear on your government documents.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="E.g. John"
                    value={formState.personalInformation.firstName}
                    onBlur={() => handleBlur("firstName")}
                    onChange={(e) => handleInputChange("personalInformation", "firstName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.firstName && touched.firstName ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="E.g. Doe"
                    value={formState.personalInformation.lastName}
                    onBlur={() => handleBlur("lastName")}
                    onChange={(e) => handleInputChange("personalInformation", "lastName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.lastName && touched.lastName ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="E.g. john.doe@email.com"
                    value={formState.personalInformation.email}
                    onBlur={() => handleBlur("email")}
                    onChange={(e) => handleInputChange("personalInformation", "email", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.email && touched.email ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    required
                    placeholder="E.g. 9876543210"
                    value={formState.personalInformation.mobileNumber}
                    onBlur={() => handleBlur("mobileNumber")}
                    onChange={(e) => handleInputChange("personalInformation", "mobileNumber", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.mobileNumber && touched.mobileNumber ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.mobileNumber && touched.mobileNumber && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formState.personalInformation.dateOfBirth}
                    onChange={(e) => handleInputChange("personalInformation", "dateOfBirth", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formState.personalInformation.gender}
                    onChange={(e) => handleInputChange("personalInformation", "gender", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    placeholder="E.g. Chennai"
                    value={formState.personalInformation.city}
                    onBlur={() => handleBlur("city")}
                    onChange={(e) => handleInputChange("personalInformation", "city", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.city && touched.city ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.city && touched.city && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    placeholder="E.g. Tamil Nadu"
                    value={formState.personalInformation.state}
                    onBlur={() => handleBlur("state")}
                    onChange={(e) => handleInputChange("personalInformation", "state", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.state && touched.state ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.state && touched.state && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC INFORMATION */}
          {currentStep === 1 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Academic Profile</h3>
                <p className="text-xs text-slate-400">Share your current academic standings, department, and expected graduation timelines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="collegeName" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">College Name *</label>
                  <input
                    type="text"
                    id="collegeName"
                    name="collegeName"
                    required
                    placeholder="E.g. Pinesphere College of Technology"
                    value={formState.academicInformation.collegeName}
                    onBlur={() => handleBlur("collegeName")}
                    onChange={(e) => handleInputChange("academicInformation", "collegeName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.collegeName && touched.collegeName ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.collegeName && touched.collegeName && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.collegeName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Department *</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    required
                    placeholder="E.g. Computer Science"
                    value={formState.academicInformation.department}
                    onBlur={() => handleBlur("department")}
                    onChange={(e) => handleInputChange("academicInformation", "department", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.department && touched.department ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.department && touched.department && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="degree" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Degree *</label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    required
                    placeholder="E.g. B.E. / B.Tech"
                    value={formState.academicInformation.degree}
                    onBlur={() => handleBlur("degree")}
                    onChange={(e) => handleInputChange("academicInformation", "degree", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.degree && touched.degree ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.degree && touched.degree && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.degree}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="currentYear" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Current Year *</label>
                  <select
                    id="currentYear"
                    name="currentYear"
                    required
                    value={formState.academicInformation.currentYear}
                    onBlur={() => handleBlur("currentYear")}
                    onChange={(e) => handleInputChange("academicInformation", "currentYear", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all ${
                      errors.currentYear && touched.currentYear ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  >
                    <option value="">Select current year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year (Integrated)</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                  {errors.currentYear && touched.currentYear && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.currentYear}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="cgpaPercentage" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">CGPA / Percentage *</label>
                  <input
                    type="text"
                    id="cgpaPercentage"
                    name="cgpaPercentage"
                    required
                    placeholder="E.g. 8.5 or 85%"
                    value={formState.academicInformation.cgpaPercentage}
                    onBlur={() => handleBlur("cgpaPercentage")}
                    onChange={(e) => handleInputChange("academicInformation", "cgpaPercentage", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.cgpaPercentage && touched.cgpaPercentage ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.cgpaPercentage && touched.cgpaPercentage && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.cgpaPercentage}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Graduation Year *</label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    required
                    placeholder="E.g. 2027"
                    value={formState.academicInformation.graduationYear}
                    onBlur={() => handleBlur("graduationYear")}
                    onChange={(e) => handleInputChange("academicInformation", "graduationYear", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                      errors.graduationYear && touched.graduationYear ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.graduationYear && touched.graduationYear && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.graduationYear}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROFESSIONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Professional Portfolio</h3>
                <p className="text-xs text-slate-400">Share your skillsets, web profiles, portfolios, and previous building experiences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="skills" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Skills (Comma Separated) *</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    required
                    placeholder="E.g. React, Node.js, TypeScript, CSS, UI Design"
                    value={formState.professionalInformation.skills}
                    onBlur={() => handleBlur("skills")}
                    onChange={(e) => handleInputChange("professionalInformation", "skills", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.skills && touched.skills ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.skills && touched.skills && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.skills}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="githubUrl" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">GitHub Profile URL</label>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    placeholder="https://github.com/username"
                    value={formState.professionalInformation.githubUrl}
                    onBlur={() => handleBlur("githubUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "githubUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.githubUrl && touched.githubUrl ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.githubUrl && touched.githubUrl && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.githubUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="linkedinUrl" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={formState.professionalInformation.linkedinUrl}
                    onBlur={() => handleBlur("linkedinUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "linkedinUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-855 transition-all ${
                      errors.linkedinUrl && touched.linkedinUrl ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.linkedinUrl && touched.linkedinUrl && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-555 shrink-0" />
                      {errors.linkedinUrl}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="portfolioUrl" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Portfolio URL</label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    placeholder="https://myportfolio.com"
                    value={formState.professionalInformation.portfolioUrl}
                    onBlur={() => handleBlur("portfolioUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "portfolioUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.portfolioUrl && touched.portfolioUrl ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.portfolioUrl && touched.portfolioUrl && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.portfolioUrl}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="projectExperience" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Project Experience / Description</label>
                  <textarea
                    id="projectExperience"
                    name="projectExperience"
                    rows={4}
                    placeholder="Describe some key projects you've built, the tech stacks used, and details of your contributions."
                    value={formState.professionalInformation.projectExperience}
                    onChange={(e) => handleInputChange("professionalInformation", "projectExperience", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DYNAMIC INTERNSHIP SPECIFIC SECTION */}
          {currentStep === 3 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Internship Specific Details</h3>
                <p className="text-xs text-slate-400">Additional information tailored to the selected <strong className="text-blue-600 capitalize">{internshipType}</strong> internship program.</p>
              </div>

              {/* FREE INTERNSHIP */}
              {internshipType === "free" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-sm font-semibold text-slate-650 flex items-center justify-center gap-2">
                  <SpecificIcon className="h-5 w-5 text-blue-600" /> Free Internship requires no additional information.
                </div>
              )}

              {/* CORPORATE SPONSORED INTERNSHIP */}
              {internshipType === "corporate" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-sm font-semibold text-slate-650 flex items-center justify-center gap-2">
                  <CorporateIcon className="h-5 w-5 text-blue-600" /> Corporate Sponsored Internship requires no additional information.
                </div>
              )}

              {/* PAID INTERNSHIP */}
              {internshipType === "paid" && (
                <div className="space-y-6">
                  
                  {/* Fee Guidelines Alert */}
                  <div className="bg-blue-50 border border-blue-150 rounded-xl p-5 text-sm text-blue-800 space-y-2 flex items-start gap-3">
                    <WarningIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Payment Verification Required</p>
                      <p className="text-xs text-blue-650">This internship requires a fee. Please check details, pay through Pinesphere channels, and upload your transaction receipt here for validation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mt-4">
                    <input
                      type="checkbox"
                      id="feeAcceptance"
                      name="feeAcceptance"
                      checked={formState.internshipSpecificData.feeAcceptance}
                      onChange={(e) => handleInputChange("internshipSpecificData", "feeAcceptance", e.target.checked)}
                      className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-600 accent-blue-600 mt-0.5"
                    />
                    <div>
                      <label htmlFor="feeAcceptance" className="text-xs font-bold text-slate-750 uppercase tracking-wide">I accept the fee guidelines and confirm payments have been completed. *</label>
                      {errors.feeAcceptance && (
                        <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                          <WarningIcon className="h-3.5 w-3.5 text-rose-500" />
                          {errors.feeAcceptance}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label htmlFor="paymentMode" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Payment Mode *</label>
                      <select
                        id="paymentMode"
                        name="paymentMode"
                        required
                        value={formState.internshipSpecificData.paymentMode}
                        onBlur={() => handleBlur("paymentMode")}
                        onChange={(e) => handleInputChange("internshipSpecificData", "paymentMode", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all ${
                          errors.paymentMode && touched.paymentMode ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                        }`}
                      >
                        <option value="">Select Mode</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                      </select>
                      {errors.paymentMode && touched.paymentMode && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                          <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          {errors.paymentMode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="transactionId" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Transaction ID *</label>
                      <input
                        type="text"
                        id="transactionId"
                        name="transactionId"
                        required
                        placeholder="E.g. TXN987654321"
                        value={formState.internshipSpecificData.transactionId}
                        onBlur={() => handleBlur("transactionId")}
                        onChange={(e) => handleInputChange("internshipSpecificData", "transactionId", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                          errors.transactionId && touched.transactionId ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                        }`}
                      />
                      {errors.transactionId && touched.transactionId && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                          <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          {errors.transactionId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Payment Screenshot Receipt *</span>
                    
                    {!formState.internshipSpecificData.paymentScreenshot ? (
                      <div
                        ref={dragRefScreenshot}
                        onClick={() => document.getElementById('screenshot-input')?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          dragRefScreenshot.current?.classList.add("border-blue-500", "bg-blue-50/30");
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          dragRefScreenshot.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          dragRefScreenshot.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                          const file = e.dataTransfer.files?.[0];
                          if (file) processFile(file, "screenshot");
                        }}
                        className={`border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-all ${
                          errors.paymentScreenshot ? "border-rose-450 bg-rose-50/10" : ""
                        }`}
                      >
                        <input
                          id="screenshot-input"
                          name="paymentScreenshot"
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) processFile(file, "screenshot");
                          }}
                        />
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                          <DocumentIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Drag & Drop or Click to upload receipt</p>
                        <p className="text-xs text-slate-400 mt-1">Accepts images & PDF (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="h-12 w-12 bg-white border border-slate-150 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {formState.internshipSpecificData.paymentScreenshot.type.includes("pdf") ? "PDF" : "IMG"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 truncate">{formState.internshipSpecificData.paymentScreenshot.name}</p>
                          <p className="text-xs text-slate-400 font-semibold">{(formState.internshipSpecificData.paymentScreenshot.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("screenshot")}
                          className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {errors.paymentScreenshot && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.paymentScreenshot}
                      </p>
                    )}
                  </div>

                </div>
              )}

              {/* STIPEND INTERNSHIP */}
              {internshipType === "stipend" && (
                <div className="space-y-6 animate-slide-in">
                  <div>
                    <label htmlFor="relevantExperience" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Relevant Experience For This Role *</label>
                    <textarea
                      id="relevantExperience"
                      name="relevantExperience"
                      required
                      rows={5}
                      placeholder="Detail any background projects, certifications, or past learnings related to this internship position..."
                      value={formState.internshipSpecificData.relevantExperience}
                      onBlur={() => handleBlur("relevantExperience")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "relevantExperience", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                        errors.relevantExperience && touched.relevantExperience ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                      }`}
                    ></textarea>
                    {errors.relevantExperience && touched.relevantExperience && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.relevantExperience}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* INDUSTRIAL INTERNSHIP */}
              {internshipType === "industrial" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="preferredTechStack" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Preferred Technology Stack *</label>
                    <textarea
                      id="preferredTechStack"
                      name="preferredTechStack"
                      required
                      rows={3}
                      placeholder="E.g. React/Next.js for frontend, Node.js/Express for backend, PostgreSQL, etc."
                      value={formState.internshipSpecificData.preferredTechStack}
                      onBlur={() => handleBlur("preferredTechStack")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "preferredTechStack", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                        errors.preferredTechStack && touched.preferredTechStack ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                      }`}
                    ></textarea>
                    {errors.preferredTechStack && touched.preferredTechStack && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.preferredTechStack}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="relevantTechnicalExperience" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Relevant Technical Experience *</label>
                    <textarea
                      id="relevantTechnicalExperience"
                      name="relevantTechnicalExperience"
                      required
                      rows={4}
                      placeholder="Describe any industrial experience, workflows, or technical applications you have configured..."
                      value={formState.internshipSpecificData.relevantTechnicalExperience}
                      onBlur={() => handleBlur("relevantTechnicalExperience")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "relevantTechnicalExperience", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                        errors.relevantTechnicalExperience && touched.relevantTechnicalExperience ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                      }`}
                    ></textarea>
                    {errors.relevantTechnicalExperience && touched.relevantTechnicalExperience && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.relevantTechnicalExperience}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* RESEARCH INTERNSHIP */}
              {internshipType === "research" && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="researchAreaOfInterest" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Research Area Of Interest *</label>
                    <input
                      type="text"
                      id="researchAreaOfInterest"
                      name="researchAreaOfInterest"
                      required
                      placeholder="E.g. Neural Networks, Computer Vision, Cryptography"
                      value={formState.internshipSpecificData.researchAreaOfInterest}
                      onBlur={() => handleBlur("researchAreaOfInterest")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "researchAreaOfInterest", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                        errors.researchAreaOfInterest && touched.researchAreaOfInterest ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                      }`}
                    />
                    {errors.researchAreaOfInterest && touched.researchAreaOfInterest && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.researchAreaOfInterest}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="researchInterestStatement" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Research Interest Statement *</label>
                    <textarea
                      id="researchInterestStatement"
                      name="researchInterestStatement"
                      required
                      rows={4}
                      placeholder="Why does this research area interest you? What goals or outcomes do you aim to pursue?"
                      value={formState.internshipSpecificData.researchInterestStatement}
                      onBlur={() => handleBlur("researchInterestStatement")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "researchInterestStatement", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                        errors.researchInterestStatement && touched.researchInterestStatement ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                      }`}
                    ></textarea>
                    {errors.researchInterestStatement && touched.researchInterestStatement && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                        <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        {errors.researchInterestStatement}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="publicationsAvailable" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Publications Available</label>
                    <select
                      id="publicationsAvailable"
                      name="publicationsAvailable"
                      value={formState.internshipSpecificData.publicationsAvailable}
                      onChange={(e) => handleInputChange("internshipSpecificData", "publicationsAvailable", e.target.value as "Yes" | "No")}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-slate-800 transition-all"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {formState.internshipSpecificData.publicationsAvailable === "Yes" && (
                    <div className="animate-slide-in">
                      <label htmlFor="publicationLinks" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Publication Links *</label>
                      <textarea
                        id="publicationLinks"
                        name="publicationLinks"
                        required
                        rows={3}
                        placeholder="Provide links to your published papers, IEEE/ACM profiles, or repositories..."
                        value={formState.internshipSpecificData.publicationLinks}
                        onBlur={() => handleBlur("publicationLinks")}
                        onChange={(e) => handleInputChange("internshipSpecificData", "publicationLinks", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-850 transition-all ${
                          errors.publicationLinks && touched.publicationLinks ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                        }`}
                      ></textarea>
                      {errors.publicationLinks && touched.publicationLinks && (
                        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                          <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                          {errors.publicationLinks}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: DOCUMENTS */}
          {currentStep === 4 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Documents Upload</h3>
                <p className="text-xs text-slate-400">Upload your academic or professional curriculum vitae. Ensure it contains correct and updated information.</p>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Resume Upload (PDF Format) *</span>
                
                {!formState.documents.resume ? (
                  <div
                    ref={dragRefResume}
                    onClick={() => document.getElementById('resume-input')?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      dragRefResume.current?.classList.add("border-blue-500", "bg-blue-50/30");
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      dragRefResume.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      dragRefResume.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                      const file = e.dataTransfer.files?.[0];
                      if (file) processFile(file, "resume");
                    }}
                    className={`border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:bg-slate-50/50 hover:border-blue-400 transition-all ${
                      errors.resume ? "border-rose-450 bg-rose-50/10" : ""
                    }`}
                  >
                    <input
                      id="resume-input"
                      name="resume"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processFile(file, "resume");
                      }}
                    />
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                      <DocumentIcon className="h-7 w-7 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Drag & Drop or click to upload your Resume</p>
                    <p className="text-xs text-slate-400 mt-1">Accepts PDF format only (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="h-12 w-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-extrabold text-sm shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{formState.documents.resume.name}</p>
                      <p className="text-xs text-slate-400 font-semibold">{(formState.documents.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("resume")}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-100 shadow-sm"
                    >
                      Remove File
                    </button>
                  </div>
                )}
                {errors.resume && (
                  <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">⚠ {errors.resume}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: MOTIVATION */}
          {currentStep === 5 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Motivation Statement</h3>
                <p className="text-xs text-slate-400">Describe why you want this role and how this internship fits into your future career aspirations.</p>
              </div>

              <div>
                <label htmlFor="whyInternship" className="block text-xs font-bold text-slate-550 mb-2 uppercase tracking-wide">Why do you want this internship? *</label>
                <span id="why-hint" className="block text-[11px] text-slate-450 mb-2 font-medium">Minimum 100 characters required. Tell us about your passion and alignment.</span>
                <textarea
                  id="whyInternship"
                  name="whyInternship"
                  required
                  aria-describedby="why-hint"
                  rows={6}
                  placeholder="Explain your goals, background skills alignment, and what you aim to achieve during this internship at Pinesphere..."
                  value={formState.motivation.whyInternship}
                  onBlur={() => handleBlur("whyInternship")}
                  onChange={(e) => handleInputChange("motivation", "whyInternship", e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white placeholder-slate-400 text-slate-800 transition-all ${
                    errors.whyInternship && touched.whyInternship ? "border-rose-500 bg-rose-50/20" : "border-slate-300"
                  }`}
                ></textarea>
                
                {/* Character Counter Panel */}
                <div className="flex items-center justify-between mt-2">
                  <div className="w-1/2 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        (formState.motivation.whyInternship?.length || 0) >= 100 ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(((formState.motivation.whyInternship?.length || 0) / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-bold ${
                    (formState.motivation.whyInternship?.length || 0) >= 100 ? "text-emerald-600" : "text-slate-400"
                  }`}>
                    {formState.motivation.whyInternship?.length || 0} / 100 characters
                  </span>
                </div>

                {errors.whyInternship && touched.whyInternship && (
                  <p className="text-xs text-rose-500 font-semibold mt-2.5 flex items-center gap-1">⚠ {errors.whyInternship}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & SUBMIT */}
          {currentStep === 6 && (
            <div className="animate-slide-in space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Verify Application Summary</h3>
                <p className="text-xs text-slate-400">Review all information details carefully. You can directly edit any section before submitting your application.</p>
              </div>

              <div className="space-y-6">
                
                {/* Personal Information */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-blue-600" /> Personal Information
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(0)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div><span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.firstName} {formState.personalInformation.lastName}</span></div>
                    <div><span className="text-slate-400">Email:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.email}</span></div>
                    <div><span className="text-slate-400">Mobile:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.mobileNumber}</span></div>
                    <div><span className="text-slate-400">DOB:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.dateOfBirth || "N/A"}</span></div>
                    <div><span className="text-slate-400">Gender:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.gender || "N/A"}</span></div>
                    <div><span className="text-slate-400">Location:</span> <span className="font-semibold text-slate-800">{formState.personalInformation.city}, {formState.personalInformation.state}</span></div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <AcademicIcon className="h-5 w-5 text-blue-600" /> Academic Profile
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div className="col-span-2"><span className="text-slate-400">College:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.collegeName}</span></div>
                    <div><span className="text-slate-400">Department:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.department}</span></div>
                    <div><span className="text-slate-400">Degree:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.degree}</span></div>
                    <div><span className="text-slate-400">Current Year:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.currentYear}</span></div>
                    <div><span className="text-slate-400">CGPA / %:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.cgpaPercentage}</span></div>
                    <div><span className="text-slate-400">Graduation Year:</span> <span className="font-semibold text-slate-800">{formState.academicInformation.graduationYear}</span></div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <ProfessionalIcon className="h-5 w-5 text-blue-600" /> Professional Details
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div><span className="text-slate-400">Skills:</span> <span className="font-semibold text-slate-800">{formState.professionalInformation.skills}</span></div>
                    {formState.professionalInformation.githubUrl && <div><span className="text-slate-400">GitHub:</span> <a href={formState.professionalInformation.githubUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.githubUrl}</a></div>}
                    {formState.professionalInformation.linkedinUrl && <div><span className="text-slate-400">LinkedIn:</span> <a href={formState.professionalInformation.linkedinUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.linkedinUrl}</a></div>}
                    {formState.professionalInformation.portfolioUrl && <div><span className="text-slate-400">Portfolio:</span> <a href={formState.professionalInformation.portfolioUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.portfolioUrl}</a></div>}
                    {formState.professionalInformation.projectExperience && <div><span className="text-slate-400">Project Info:</span> <p className="font-medium text-slate-700 mt-1 whitespace-pre-wrap">{formState.professionalInformation.projectExperience}</p></div>}
                  </div>
                </div>

                {/* Internship Specific Information */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <SpecificIcon className="h-5 w-5 text-blue-600" /> Internship Specifics
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="text-xs space-y-2">
                    <div><span className="text-slate-400">Internship Selected:</span> <span className="font-bold text-blue-600 capitalize">{internshipType} Internship</span></div>
                    
                    {internshipType === "free" && <div><span className="text-slate-500 italic">Free Internship requires no additional fields.</span></div>}
                    {internshipType === "corporate" && <div><span className="text-slate-500 italic">Corporate sponsored program requires no additional fields.</span></div>}
                    
                    {internshipType === "paid" && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div><span className="text-slate-400">Payment Mode:</span> <span className="font-semibold text-slate-800">{formState.internshipSpecificData.paymentMode}</span></div>
                        <div><span className="text-slate-400">Transaction ID:</span> <span className="font-semibold text-slate-800">{formState.internshipSpecificData.transactionId}</span></div>
                        <div className="col-span-2 mt-1"><span className="text-slate-400">Verification Screenshot:</span> <span className="font-bold text-slate-800 bg-slate-50 px-2 py-1 border rounded">{formState.internshipSpecificData.paymentScreenshot?.name}</span></div>
                      </div>
                    )}

                    {internshipType === "stipend" && (
                      <div>
                        <span className="text-slate-400">Relevant Experience:</span>
                        <p className="font-medium text-slate-700 mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.relevantExperience}</p>
                      </div>
                    )}

                    {internshipType === "industrial" && (
                      <div className="space-y-2">
                        <div><span className="text-slate-400">Preferred Stack:</span> <p className="font-semibold text-slate-800 mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.preferredTechStack}</p></div>
                        <div><span className="text-slate-400">Technical experience:</span> <p className="font-medium text-slate-700 mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.relevantTechnicalExperience}</p></div>
                      </div>
                    )}

                    {internshipType === "research" && (
                      <div className="space-y-2">
                        <div><span className="text-slate-400">Research Area of Interest:</span> <span className="font-semibold text-slate-800">{formState.internshipSpecificData.researchAreaOfInterest}</span></div>
                        <div><span className="text-slate-400">Interest statement:</span> <p className="font-medium text-slate-700 mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.researchInterestStatement}</p></div>
                        <div><span className="text-slate-400">Publications Available:</span> <span className="font-semibold text-slate-800">{formState.internshipSpecificData.publicationsAvailable}</span></div>
                        {formState.internshipSpecificData.publicationsAvailable === "Yes" && <div><span className="text-slate-400">Publications links:</span> <p className="font-medium text-slate-700 mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.publicationLinks}</p></div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <DocumentIcon className="h-5 w-5 text-blue-600" /> Documents Attached
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="text-xs">
                    <div><span className="text-slate-400">Resume:</span> <span className="font-bold text-slate-800 bg-slate-50 px-3.5 py-1.5 border border-slate-150 rounded inline-block">{formState.documents.resume?.name} ({(formState.documents.resume ? formState.documents.resume.size / 1024 / 1024 : 0).toFixed(2)} MB)</span></div>
                  </div>
                </div>

                {/* Motivation */}
                <div className="border border-slate-200 rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <MotivationIcon className="h-5 w-5 text-blue-600" /> Motivation Statement
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(5)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{formState.motivation.whyInternship}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Form Action Buttons Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-650 hover:bg-slate-55 transition-all ${
                currentStep === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              ← Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>Submit Application ✓</>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between text-slate-800">
      <div>
        {/* Navigation Header */}
        <header className="h-16 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-13.5 w-auto object-contain transition-transform hover:scale-[1.02]" />
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-slate-650 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <ArrowBackIcon className="h-4 w-4" /> Return to Homepage
          </Link>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Apply for Internship</h1>
            <p className="text-sm text-slate-500">Submit your customized application to begin your internship journey with Pinesphere.</p>
          </div>

          <Suspense fallback={<div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-2xl">Loading application portal details...</div>}>
            <ApplicationFormContent />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-150 bg-white py-6 px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-slate-450">
        <div>© 2026 PINESPHERE ENTERPRISE. BUILT FOR SCALE.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-blue-650 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-blue-650 transition-colors">TERMS</Link>
          <Link href="#" className="hover:text-blue-650 transition-colors">SUPPORT</Link>
        </div>
      </footer>
    </div>
  );
}