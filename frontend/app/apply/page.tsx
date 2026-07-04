"use client";

import React, { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ENDPOINTS } from '@/src/config';

import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Target, 
  FileText, 
  Edit3, 
  ClipboardCheck, 
  AlertTriangle, 
  Building, 
  Check, 
  ArrowLeft,
  Upload
} from 'lucide-react';

// Replaced raw SVG paths with Lucide React icons to resolve IDE 'path' parsing errors
const UserIcon = ({ className = "h-4 w-4" }) => <User className={className} />;
const AcademicIcon = ({ className = "h-4 w-4" }) => <GraduationCap className={className} />;
const ProfessionalIcon = ({ className = "h-4 w-4" }) => <Briefcase className={className} />;
const SpecificIcon = ({ className = "h-4 w-4" }) => <Target className={className} />;
const DocumentIcon = ({ className = "h-4 w-4" }) => <FileText className={className} />;
const MotivationIcon = ({ className = "h-4 w-4" }) => <Edit3 className={className} />;
const ReviewIcon = ({ className = "h-4 w-4" }) => <ClipboardCheck className={className} />;
const WarningIcon = ({ className = "h-4 w-4" }) => <AlertTriangle className={className} />;
const CorporateIcon = ({ className = "h-4 w-4" }) => <Building className={className} />;
const SuccessCheckIcon = ({ className = "h-4 w-4" }) => <Check className={className} />;
const ArrowBackIcon = ({ className = "h-4 w-4" }) => <ArrowLeft className={className} />;
const UploadIcon = ({ className = "h-4 w-4" }) => <Upload className={className} />;

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
    photo: FileData | null;
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
    upiApp?: string;
    upiPaid?: boolean;
    bankName?: string;
    utrNumber?: string;
    transferDate?: string;
    cardType?: string;
    last4Digits?: string;
    authCode?: string;
    cardPaid?: boolean;
  };
  documents: {
    resume: FileData | null;
    passbook: FileData | null;
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
    photo: null,
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
    upiApp: "",
    upiPaid: false,
    bankName: "",
    utrNumber: "",
    transferDate: "",
    cardType: "",
    last4Digits: "",
    authCode: "",
    cardPaid: false,
  },
  documents: {
    resume: null,
    passbook: null,
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

const toPlainBase64 = (value: string) => {
  const commaIndex = value.indexOf(',');
  return commaIndex >= 0 ? value.slice(commaIndex + 1) : value;
};

const sanitizeFileData = (file: FileData | null): FileData | null => {
  if (!file) return null;

  return {
    ...file,
    base64: toPlainBase64(file.base64),
  };
};

const sanitizeText = (value: string) => value.trim();

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [colleges, setColleges] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [degrees, setDegrees] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAcademicData() {
      try {
        const { organizationApi } = await import('@/src/api/organization.api');
        const { degreeService } = await import('@/src/services/degree.service');
        const [cols, depts, degs] = await Promise.all([
          organizationApi.getColleges().catch(() => []),
          organizationApi.getDepartments().catch(() => []),
          degreeService.getDegrees().catch(() => [])
        ]);
        setColleges(cols || []);
        setDepartments(depts || []);
        
        const defaultDegrees = [
          { degree_id: '1', degree_name: 'B.E. / B.Tech' },
          { degree_id: '2', degree_name: 'B.Sc' },
          { degree_id: '3', degree_name: 'BCA' },
          { degree_id: '4', degree_name: 'M.E. / M.Tech' },
          { degree_id: '5', degree_name: 'M.Sc' },
          { degree_id: '6', degree_name: 'MCA' },
        ];
        setDegrees(degs && degs.length > 0 ? degs : defaultDegrees);
      } catch (err) {
        console.error("Failed to load academic data", err);
      }
    }
    fetchAcademicData();
  }, []);

  const dragRefResume = useRef<HTMLDivElement>(null);
  const dragRefScreenshot = useRef<HTMLDivElement>(null);
  const dragRefPhoto = useRef<HTMLDivElement>(null);
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
      // Strip out file data to prevent QuotaExceededError in localStorage
      const stateToSave = {
        ...formState,
        personalInformation: {
          ...formState.personalInformation,
          photo: null,
        },
        internshipSpecificData: {
          ...formState.internshipSpecificData,
          paymentScreenshot: null,
        },
        documents: {
          resume: null,
          passbook: null,
        }
      };
      
      try {
        localStorage.setItem(`pinesphere_internship_draft_${internshipType}`, JSON.stringify(stateToSave));
      } catch (err) {
        console.error("Failed to save draft to localStorage", err);
      }
      
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [formState, internshipType]);

  // Handle simple input modifications
  const handleInputChange = (section: keyof ApplicationState, field: string, value: string | boolean) => {
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
      const { firstName, lastName, email, mobileNumber, city, state, photo } = formState.personalInformation;
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
      if (!photo) {
        stepErrors.photo = "Passport size photo is required.";
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
        const maxValidYear = new Date().getFullYear() + 10;
        if (isNaN(year) || year < 1900 || year > maxValidYear) {
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
        const { feeAcceptance, paymentMode, upiApp, upiPaid, bankName, utrNumber, transferDate, cardType, last4Digits, cardPaid } = formState.internshipSpecificData;
        if (!feeAcceptance) {
          stepErrors.feeAcceptance = "You must accept the fee guidelines.";
        }
        if (!paymentMode) {
          stepErrors.paymentMode = "Please select a payment mode.";
        } else if (paymentMode === "UPI") {
          if (!upiApp) stepErrors.upiApp = "Please select your UPI App.";
          if (!upiPaid) stepErrors.upiPaid = "Please complete the UPI payment.";
        } else if (paymentMode === "Bank Transfer") {
          if (!bankName || !bankName.trim()) stepErrors.bankName = "Bank Name is required.";
          if (!utrNumber || !/^[A-Za-z0-9]{12,22}$/.test(utrNumber.trim())) {
            stepErrors.utrNumber = "UTR Number must be between 12 and 22 alphanumeric characters.";
          }
          if (!transferDate) stepErrors.transferDate = "Transfer date is required.";
        } else if (paymentMode === "Credit Card" || paymentMode === "Debit Card") {
          if (!cardType) stepErrors.cardType = "Please select your card type.";
          if (!last4Digits || !/^\d{4}$/.test(last4Digits.trim())) {
            stepErrors.last4Digits = "Please enter the last 4 digits of your card.";
          }
          if (!cardPaid) stepErrors.cardPaid = "Please complete the card payment.";
        }
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
      const { resume, passbook } = formState.documents;
      if (!resume) stepErrors.resume = "Resume PDF file is required.";
      if (internshipType === "stipend" && !passbook) {
        stepErrors.passbook = "Passbook/Bank document is required for stipend processing.";
      }
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
  const processFile = (file: File, type: "resume" | "screenshot" | "photo" | "passbook") => {
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
    } else if (type === "photo") {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, photo: "Only image files (JPEG, PNG, WEBP) are accepted." }));
        return;
      }
      if (file.size > maxScreenshotSize) {
        setErrors((prev) => ({ ...prev, photo: "Photo size must be under 5MB." }));
        return;
      }
    } else if (type === "passbook") {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, passbook: "Accepted files: JPEG, PNG, WEBP, or PDF." }));
        return;
      }
      if (file.size > maxScreenshotSize) {
        setErrors((prev) => ({ ...prev, passbook: "Passbook size must be under 5MB." }));
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
      } else if (type === "photo") {
        setFormState((prev) => ({
          ...prev,
          personalInformation: { ...prev.personalInformation, photo: fileObj }
        }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next.photo;
          return next;
        });
      } else if (type === "passbook") {
        setFormState((prev) => ({
          ...prev,
          documents: { ...prev.documents, passbook: fileObj }
        }));
        setErrors((prev) => {
          const next = { ...prev };
          delete next.passbook;
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

  const removeFile = (type: "resume" | "screenshot" | "photo" | "passbook") => {
    if (type === "resume") {
      setFormState((prev) => ({
        ...prev,
        documents: { ...prev.documents, resume: null }
      }));
    } else if (type === "photo") {
      setFormState((prev) => ({
        ...prev,
        personalInformation: { ...prev.personalInformation, photo: null }
      }));
    } else if (type === "passbook") {
      setFormState((prev) => ({
        ...prev,
        documents: { ...prev.documents, passbook: null }
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        internshipSpecificData: { ...prev.internshipSpecificData, paymentScreenshot: null }
      }));
    }
  };

  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  const handleUPISimulation = () => {
    setIsSimulatingPayment(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.upiPaid;
      delete next.paymentStatus;
      return next;
    });
    setTimeout(() => {
      setIsSimulatingPayment(false);
      const mockTxnId = `UPI-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setFormState((prev) => ({
        ...prev,
        internshipSpecificData: {
          ...prev.internshipSpecificData,
          upiPaid: true,
          transactionId: mockTxnId,
        }
      }));
    }, 1500);
  };

  const handleCardSimulation = () => {
    setIsSimulatingPayment(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.cardPaid;
      delete next.paymentStatus;
      return next;
    });
    setTimeout(() => {
      setIsSimulatingPayment(false);
      const mockTxnId = `CARD-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const mockAuthCode = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
      setFormState((prev) => ({
        ...prev,
        internshipSpecificData: {
          ...prev.internshipSpecificData,
          cardPaid: true,
          authCode: mockAuthCode,
          transactionId: mockTxnId,
        }
      }));
    }, 1500);
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

    await executeSubmit();
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    try {
      let currentOpeningId = searchParams.get('id');
      if (!currentOpeningId || currentOpeningId === 'undefined') {
        try {
          const { opportunitiesService } = await import('@/src/services/opportunities.service');
          const opps = await opportunitiesService.getOpportunities();
          if (opps && opps.length > 0) {
            currentOpeningId = opps[0].id;
          } else {
            currentOpeningId = '00000000-0000-0000-0000-000000000000';
          }
        } catch (e) {
          currentOpeningId = '00000000-0000-0000-0000-000000000000';
        }
      }

      const payload = {
        internshipType,
        personalInformation: {
          photo: sanitizeFileData(formState.personalInformation.photo),
          firstName: sanitizeText(formState.personalInformation.firstName),
          lastName: sanitizeText(formState.personalInformation.lastName),
          email: sanitizeText(formState.personalInformation.email),
          mobileNumber: sanitizeText(formState.personalInformation.mobileNumber),
          dateOfBirth: sanitizeText(formState.personalInformation.dateOfBirth),
          gender: sanitizeText(formState.personalInformation.gender),
          city: sanitizeText(formState.personalInformation.city),
          state: sanitizeText(formState.personalInformation.state),
        },
        academicInformation: {
          collegeName: sanitizeText(formState.academicInformation.collegeName),
          department: sanitizeText(formState.academicInformation.department),
          degree: sanitizeText(formState.academicInformation.degree),
          currentYear: sanitizeText(formState.academicInformation.currentYear),
          cgpaPercentage: sanitizeText(formState.academicInformation.cgpaPercentage),
          graduationYear: sanitizeText(formState.academicInformation.graduationYear),
        },
        professionalInformation: {
          skills: sanitizeText(formState.professionalInformation.skills),
          githubUrl: sanitizeText(formState.professionalInformation.githubUrl),
          linkedinUrl: sanitizeText(formState.professionalInformation.linkedinUrl),
          portfolioUrl: sanitizeText(formState.professionalInformation.portfolioUrl),
          projectExperience: sanitizeText(formState.professionalInformation.projectExperience),
        },
        internshipSpecificData: {
          ...formState.internshipSpecificData,
          paymentMode: sanitizeText(formState.internshipSpecificData.paymentMode),
          transactionId: sanitizeText(formState.internshipSpecificData.transactionId),
          relevantExperience: sanitizeText(formState.internshipSpecificData.relevantExperience),
          preferredTechStack: sanitizeText(formState.internshipSpecificData.preferredTechStack),
          relevantTechnicalExperience: sanitizeText(formState.internshipSpecificData.relevantTechnicalExperience),
          researchAreaOfInterest: sanitizeText(formState.internshipSpecificData.researchAreaOfInterest),
          researchInterestStatement: sanitizeText(formState.internshipSpecificData.researchInterestStatement),
          publicationLinks: sanitizeText(formState.internshipSpecificData.publicationLinks),
          paymentScreenshot: sanitizeFileData(formState.internshipSpecificData.paymentScreenshot),
        },
        documents: {
          resume: sanitizeFileData(formState.documents.resume),
          passbook: sanitizeFileData(formState.documents.passbook),
        },
        motivation: {
          whyInternship: sanitizeText(formState.motivation.whyInternship),
        },
        
        opening_id: currentOpeningId,
        first_name: sanitizeText(formState.personalInformation.firstName),
        last_name: sanitizeText(formState.personalInformation.lastName),
        email: sanitizeText(formState.personalInformation.email),
        mobile_number: sanitizeText(formState.personalInformation.mobileNumber),
        resume_url: '',
      };

      // removed extra try {
        const { applicationService } = await import('@/src/services/application.service');
        const response = await applicationService.createApplication(payload as any);
        
        // Mocking delay for UX if API is too fast
        await new Promise(resolve => setTimeout(resolve, 500));

        localStorage.setItem('pinesphere_submitted_photo', formState.personalInformation.photo?.base64 || '');
        localStorage.setItem('pinesphere_submitted_name', `${formState.personalInformation.firstName} ${formState.personalInformation.lastName}`);
        localStorage.setItem('pinesphere_submitted_program', internshipType === 'research' ? 'Research Intern' : internshipType === 'paid' ? 'Paid Intern' : 'Free Intern');
        
        localStorage.removeItem(`pinesphere_internship_draft_${internshipType}`);
        
        router.push(`/success?type=${internshipType}`);
      } catch (err: any) {
        console.error("Submission error:", err);
        let message = `Failed to submit application`;
        
        if (err.response && err.response.data) {
          message = err.response.data.detail || err.response.data.message || err.response.data.error || message;
        } else if (err.message) {
          message = err.message;
        }

        setErrors((prev) => ({ ...prev, submit: message }));
        alert(`There was an error submitting your application: ${message}`);
        setIsSubmitting(false);
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-[family-name:var(--font-work-sans)] text-[var(--foreground)]" ref={topRef}>
      
      {/* LEFT COLUMN: Sticky Step List (checking validation states natively) */}
      <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-border/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase font-[family-name:var(--font-outfit)]">Application Sections</h2>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary bg-slate-50 px-2.5 py-1 rounded-full">
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
                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-105" 
                        : isDone 
                          ? "bg-sky-50 text-text-secondary border-border" 
                          : "bg-slate-50 text-text-secondary border-border group-hover:bg-slate-100"
                    }`}>
                      {isDone ? (
                        <SuccessCheckIcon className="h-4 w-4" />
                      ) : (
                        getStepIcon(idx, isActive ? "h-4 w-4 text-white" : "h-4 w-4 text-text-secondary")
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold transition-all ${
                        isActive ? "text-text-primary font-extrabold" : "text-text-secondary"
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-text-secondary font-medium">
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
      <div className="lg:col-span-8 bg-white border border-border rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        {/* Mobile progress Indicator header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
            <h2 className="text-lg font-bold text-text-primary">{steps[currentStep].label}</h2>
          </div>
          <div className="text-[10px] text-text-secondary font-bold bg-slate-50 px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isSaved ? "bg-emerald-500" : "bg-slate-300"}`}></span>
            {isSaved ? "SAVING..." : "AUTO-SAVED"}
          </div>
        </div>

        {/* Global horizontal progress line on top of form */}
        <div className="hidden lg:block mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-secondary tracking-wider uppercase">Application Progress</span>
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
                <h3 className="text-xl font-bold text-text-primary mb-1">Personal Information</h3>
                <p className="text-xs text-text-secondary">Please provide your contact and identification details as they appear on your government documents.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="E.g. John"
                    value={formState.personalInformation.firstName}
                    onBlur={() => handleBlur("firstName")}
                    onChange={(e) => handleInputChange("personalInformation", "firstName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.firstName && touched.firstName ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="lastName" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="E.g. Doe"
                    value={formState.personalInformation.lastName}
                    onBlur={() => handleBlur("lastName")}
                    onChange={(e) => handleInputChange("personalInformation", "lastName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.lastName && touched.lastName ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="email" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="E.g. john.doe@email.com"
                    value={formState.personalInformation.email}
                    onBlur={() => handleBlur("email")}
                    onChange={(e) => handleInputChange("personalInformation", "email", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.email && touched.email ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="mobileNumber" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Mobile Number *</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    required
                    placeholder="E.g. 9876543210"
                    value={formState.personalInformation.mobileNumber}
                    onBlur={() => handleBlur("mobileNumber")}
                    onChange={(e) => handleInputChange("personalInformation", "mobileNumber", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.mobileNumber && touched.mobileNumber ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="dateOfBirth" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formState.personalInformation.dateOfBirth}
                    onChange={(e) => handleInputChange("personalInformation", "dateOfBirth", e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-primary transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formState.personalInformation.gender}
                    onChange={(e) => handleInputChange("personalInformation", "gender", e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-primary transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    placeholder="E.g. Chennai"
                    value={formState.personalInformation.city}
                    onBlur={() => handleBlur("city")}
                    onChange={(e) => handleInputChange("personalInformation", "city", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.city && touched.city ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="state" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    placeholder="E.g. Tamil Nadu"
                    value={formState.personalInformation.state}
                    onBlur={() => handleBlur("state")}
                    onChange={(e) => handleInputChange("personalInformation", "state", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.state && touched.state ? "border-rose-500 bg-rose-50/20" : "border-border"
                    }`}
                  />
                  {errors.state && touched.state && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 mt-2">
                  <span className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Passport Size Photo *</span>
                  
                  {!formState.personalInformation.photo ? (
                    <div
                      ref={dragRefPhoto}
                      onClick={() => document.getElementById('photo-input')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        dragRefPhoto.current?.classList.add("border-blue-500", "bg-blue-50/30");
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        dragRefPhoto.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        dragRefPhoto.current?.classList.remove("border-blue-500", "bg-blue-50/30");
                        const file = e.dataTransfer.files?.[0];
                        if (file) processFile(file, "photo");
                      }}
                      className={`border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:bg-slate-50/50 hover:border-secondary transition-all ${
                        errors.photo ? "border-rose-450 bg-rose-50/10" : ""
                      }`}
                    >
                      <input
                        id="photo-input"
                        name="photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processFile(file, "photo");
                        }}
                      />
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
                        <UploadIcon className="h-7 w-7 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold text-text-primary">Drag & Drop or click to upload your Passport Size Photo</p>
                      <p className="text-xs text-helper mt-1">Accepts JPEG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-slate-50 border border-border rounded-xl p-5 shadow-sm">
                      <div className="h-16 w-16 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 overflow-hidden shrink-0">
                        {formState.personalInformation.photo?.base64 ? (
                          <img src={formState.personalInformation.photo?.base64} alt="Photo" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-text-primary truncate">{formState.personalInformation.photo.name}</p>
                        <p className="text-xs text-text-secondary font-semibold">{(formState.personalInformation.photo.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("photo")}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors border border-rose-100 shadow-sm"
                      >
                        Remove File
                      </button>
                    </div>
                  )}
                  {errors.photo && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" /> {errors.photo}
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
                <h3 className="text-xl font-bold text-text-primary mb-1">Academic Profile</h3>
                <p className="text-xs text-text-secondary">Share your current academic standings, department, and expected graduation timelines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="collegeName" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">College Name *</label>
                  <select
                    id="collegeName"
                    name="collegeName"
                    required
                    value={formState.academicInformation.collegeName}
                    onBlur={() => handleBlur("collegeName")}
                    onChange={(e) => handleInputChange("academicInformation", "collegeName", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder:text-placeholder text-text-primary transition-all ${
                      errors.collegeName && touched.collegeName ? "border-rose-500 bg-rose-50/20" : "border-border"
                    }`}
                  >
                    <option value="">Select your college</option>
                    {colleges.map((c: any) => (
                      <option key={c.college_id} value={c.college_name}>{c.college_name}</option>
                    ))}
                  </select>
                  {errors.collegeName && touched.collegeName && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.collegeName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Department *</label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formState.academicInformation.department}
                    onBlur={() => handleBlur("department")}
                    onChange={(e) => handleInputChange("academicInformation", "department", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder:text-placeholder text-text-primary transition-all ${
                      errors.department && touched.department ? "border-rose-500 bg-rose-50/20" : "border-border"
                    }`}
                  >
                    <option value="">Select your department</option>
                    {departments.map((d: any) => (
                      <option key={d.department_id} value={d.department_name}>{d.department_name}</option>
                    ))}
                  </select>
                  {errors.department && touched.department && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="degree" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Degree *</label>
                  <select
                    id="degree"
                    name="degree"
                    required
                    value={formState.academicInformation.degree}
                    onBlur={() => handleBlur("degree")}
                    onChange={(e) => handleInputChange("academicInformation", "degree", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder:text-placeholder text-text-primary transition-all ${
                      errors.degree && touched.degree ? "border-rose-500 bg-rose-50/20" : "border-border"
                    }`}
                  >
                    <option value="">Select your degree</option>
                    {degrees.map((deg: any) => (
                      <option key={deg.degree_id} value={deg.degree_name}>{deg.degree_name}</option>
                    ))}
                  </select>
                  {errors.degree && touched.degree && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.degree}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="currentYear" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Current Year *</label>
                  <select
                    id="currentYear"
                    name="currentYear"
                    required
                    value={formState.academicInformation.currentYear}
                    onBlur={() => handleBlur("currentYear")}
                    onChange={(e) => handleInputChange("academicInformation", "currentYear", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-primary transition-all ${
                      errors.currentYear && touched.currentYear ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="cgpaPercentage" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">CGPA / Percentage *</label>
                  <input
                    type="text"
                    id="cgpaPercentage"
                    name="cgpaPercentage"
                    required
                    placeholder="E.g. 8.5 or 85%"
                    value={formState.academicInformation.cgpaPercentage}
                    onBlur={() => handleBlur("cgpaPercentage")}
                    onChange={(e) => handleInputChange("academicInformation", "cgpaPercentage", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.cgpaPercentage && touched.cgpaPercentage ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="graduationYear" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Graduation Year *</label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    required
                    placeholder="E.g. 2027"
                    value={formState.academicInformation.graduationYear}
                    onBlur={() => handleBlur("graduationYear")}
                    onChange={(e) => handleInputChange("academicInformation", "graduationYear", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                      errors.graduationYear && touched.graduationYear ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                <h3 className="text-xl font-bold text-text-primary mb-1">Professional Portfolio</h3>
                <p className="text-xs text-text-secondary">Share your skillsets, web profiles, portfolios, and previous building experiences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="skills" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Skills (Comma Separated) *</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    required
                    placeholder="E.g. React, Node.js, TypeScript, CSS, UI Design"
                    value={formState.professionalInformation.skills}
                    onBlur={() => handleBlur("skills")}
                    onChange={(e) => handleInputChange("professionalInformation", "skills", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.skills && touched.skills ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="githubUrl" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">GitHub Profile URL</label>
                  <input
                    type="url"
                    id="githubUrl"
                    name="githubUrl"
                    placeholder="https://github.com/username"
                    value={formState.professionalInformation.githubUrl}
                    onBlur={() => handleBlur("githubUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "githubUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.githubUrl && touched.githubUrl ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="linkedinUrl" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={formState.professionalInformation.linkedinUrl}
                    onBlur={() => handleBlur("linkedinUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "linkedinUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-slate-855 transition-all ${
                      errors.linkedinUrl && touched.linkedinUrl ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="portfolioUrl" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Portfolio URL</label>
                  <input
                    type="url"
                    id="portfolioUrl"
                    name="portfolioUrl"
                    placeholder="https://myportfolio.com"
                    value={formState.professionalInformation.portfolioUrl}
                    onBlur={() => handleBlur("portfolioUrl")}
                    onChange={(e) => handleInputChange("professionalInformation", "portfolioUrl", e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-slate-850 transition-all ${
                      errors.portfolioUrl && touched.portfolioUrl ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                  <label htmlFor="projectExperience" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Project Experience / Description</label>
                  <textarea
                    id="projectExperience"
                    name="projectExperience"
                    rows={4}
                    placeholder="Describe some key projects you've built, the tech stacks used, and details of your contributions."
                    value={formState.professionalInformation.projectExperience}
                    onChange={(e) => handleInputChange("professionalInformation", "projectExperience", e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DYNAMIC INTERNSHIP SPECIFIC SECTION */}
          {currentStep === 3 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Internship Specific Details</h3>
                <p className="text-xs text-text-secondary">Additional information tailored to the selected <strong className="text-blue-600 capitalize">{internshipType}</strong> internship program.</p>
              </div>

              {/* FREE INTERNSHIP */}
              {internshipType === "free" && (
                <div className="bg-slate-50 border border-border rounded-xl p-6 text-center text-sm font-semibold text-text-secondary flex items-center justify-center gap-2">
                  <SpecificIcon className="h-5 w-5 text-blue-600" /> Free Internship requires no additional information.
                </div>
              )}

              {/* CORPORATE SPONSORED INTERNSHIP */}
              {internshipType === "corporate" && (
                <div className="bg-slate-50 border border-border rounded-xl p-6 text-center text-sm font-semibold text-text-secondary flex items-center justify-center gap-2">
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
                      className="h-5 w-5 shrink-0 rounded border-border text-blue-600 focus:ring-primary accent-blue-600 mt-0.5"
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

                  <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="paymentMode" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Payment Mode *</label>
                        <select
                          id="paymentMode"
                          name="paymentMode"
                          required
                          value={formState.internshipSpecificData.paymentMode}
                          onBlur={() => handleBlur("paymentMode")}
                          onChange={(e) => {
                            const mode = e.target.value;
                            setFormState((prev) => ({
                              ...prev,
                              internshipSpecificData: {
                                ...prev.internshipSpecificData,
                                paymentMode: mode,
                                upiApp: "",
                                upiPaid: false,
                                bankName: "",
                                utrNumber: "",
                                transferDate: "",
                                cardType: "",
                                last4Digits: "",
                                authCode: "",
                                cardPaid: false,
                                transactionId: "",
                              }
                            }));
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next.paymentMode;
                              delete next.upiApp;
                              delete next.upiPaid;
                              delete next.bankName;
                              delete next.utrNumber;
                              delete next.transferDate;
                              delete next.cardType;
                              delete next.last4Digits;
                              delete next.cardPaid;
                              delete next.paymentStatus;
                              return next;
                            });
                          }}
                          className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-primary transition-all ${
                            errors.paymentMode && touched.paymentMode ? "border-rose-500 bg-rose-50/20" : "border-border"
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

                      {/* Display Amount Due */}
                      <div className="flex flex-col justify-center bg-slate-50 border border-border rounded-xl px-5 py-3">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Amount Due</span>
                        <span className="text-2xl font-black text-text-primary">₹1,500<span className="text-xs font-semibold text-text-secondary">.00 INR</span></span>
                      </div>
                    </div>

                    {/* UPI DETAILS */}
                    {formState.internshipSpecificData.paymentMode === "UPI" && (
                      <div className="bg-slate-50/50 border border-border/60 rounded-xl p-5 space-y-4 animate-slide-in">
                        <div className="max-w-md">
                          <label htmlFor="upiApp" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Select UPI App *</label>
                          <select
                            id="upiApp"
                            name="upiApp"
                            value={formState.internshipSpecificData.upiApp}
                            onChange={(e) => handleInputChange("internshipSpecificData", "upiApp", e.target.value)}
                            className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                          >
                            <option value="">Choose App</option>
                            <option value="Google Pay">Google Pay</option>
                            <option value="PhonePe">PhonePe</option>
                            <option value="Paytm">Paytm</option>
                            <option value="BHIM UPI">BHIM UPI</option>
                            <option value="Other">Other UPI App</option>
                          </select>
                          {errors.upiApp && (
                            <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                              <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                              {errors.upiApp}
                            </p>
                          )}
                        </div>

                        {!formState.internshipSpecificData.upiPaid ? (
                          <div>
                            <button
                              type="button"
                              disabled={isSimulatingPayment || !formState.internshipSpecificData.upiApp}
                              onClick={handleUPISimulation}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSimulatingPayment ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Redirecting to UPI App...
                                </>
                              ) : (
                                <>Proceed to UPI App & Pay</>
                              )}
                            </button>
                            {errors.upiPaid && (
                              <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                                <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                {errors.upiPaid}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                              <div>
                                <p className="text-sm font-bold text-text-primary">Payment Completed via {formState.internshipSpecificData.upiApp}</p>
                                <p className="text-xs text-text-secondary font-medium mt-0.5">Transaction ID: <span className="font-mono text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded">{formState.internshipSpecificData.transactionId}</span></p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full uppercase tracking-wider">Paid</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* BANK TRANSFER DETAILS */}
                    {formState.internshipSpecificData.paymentMode === "Bank Transfer" && (
                      <div className="bg-slate-50/50 border border-border/60 rounded-xl p-5 space-y-4 animate-slide-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="bankName" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Bank Name *</label>
                            <input
                              type="text"
                              id="bankName"
                              name="bankName"
                              placeholder="E.g. State Bank of India"
                              value={formState.internshipSpecificData.bankName}
                              onChange={(e) => handleInputChange("internshipSpecificData", "bankName", e.target.value)}
                              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                            />
                            {errors.bankName && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <WarningIcon className="h-3 w-3 text-rose-500" />
                                {errors.bankName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="utrNumber" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">UTR Number *</label>
                            <input
                              type="text"
                              id="utrNumber"
                              name="utrNumber"
                              placeholder="12-22 digit alphanumeric UTR"
                              value={formState.internshipSpecificData.utrNumber}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase();
                                handleInputChange("internshipSpecificData", "utrNumber", val);
                                handleInputChange("internshipSpecificData", "transactionId", val);
                              }}
                              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                            />
                            {errors.utrNumber && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <WarningIcon className="h-3 w-3 text-rose-500" />
                                {errors.utrNumber}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="transferDate" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Transfer Date *</label>
                            <input
                              type="date"
                              id="transferDate"
                              name="transferDate"
                              value={formState.internshipSpecificData.transferDate}
                              onChange={(e) => handleInputChange("internshipSpecificData", "transferDate", e.target.value)}
                              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                            />
                            {errors.transferDate && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <WarningIcon className="h-3 w-3 text-rose-500" />
                                {errors.transferDate}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CARD DETAILS */}
                    {(formState.internshipSpecificData.paymentMode === "Credit Card" || formState.internshipSpecificData.paymentMode === "Debit Card") && (
                      <div className="bg-slate-50/50 border border-border/60 rounded-xl p-5 space-y-4 animate-slide-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardType" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Card Network *</label>
                            <select
                              id="cardType"
                              name="cardType"
                              value={formState.internshipSpecificData.cardType}
                              onChange={(e) => handleInputChange("internshipSpecificData", "cardType", e.target.value)}
                              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                            >
                              <option value="">Select Network</option>
                              <option value="Visa">Visa</option>
                              <option value="Mastercard">Mastercard</option>
                              <option value="RuPay">RuPay</option>
                              <option value="American Express">American Express</option>
                            </select>
                            {errors.cardType && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <WarningIcon className="h-3 w-3 text-rose-500" />
                                {errors.cardType}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="last4Digits" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Last 4 Digits *</label>
                            <input
                              type="text"
                              id="last4Digits"
                              name="last4Digits"
                              maxLength={4}
                              placeholder="E.g. 4321"
                              inputMode="numeric"
                              pattern="[0-9]{4}"
                              value={formState.internshipSpecificData.last4Digits}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                handleInputChange("internshipSpecificData", "last4Digits", val);
                              }}
                              className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none bg-white text-text-primary"
                            />
                            {errors.last4Digits && (
                              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                                <WarningIcon className="h-3 w-3 text-rose-500" />
                                {errors.last4Digits}
                              </p>
                            )}
                          </div>
                        </div>

                        {!formState.internshipSpecificData.cardPaid ? (
                          <div>
                            <button
                              type="button"
                              disabled={isSimulatingPayment || !formState.internshipSpecificData.cardType || formState.internshipSpecificData.last4Digits?.length !== 4}
                              onClick={handleCardSimulation}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSimulatingPayment ? (
                                <>
                                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Authorizing Card...
                                </>
                              ) : (
                                <>Pay with Card</>
                              )}
                            </button>
                            {errors.cardPaid && (
                              <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                                <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                {errors.cardPaid}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
                              <div>
                                <p className="text-sm font-bold text-text-primary">Card Payment Authorized via {formState.internshipSpecificData.cardType} (**** {formState.internshipSpecificData.last4Digits})</p>
                                <p className="text-xs text-text-secondary font-medium mt-0.5 flex gap-3">
                                  <span>Auth Code: <span className="font-mono text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded">{formState.internshipSpecificData.authCode}</span></span>
                                  <span>Txn ID: <span className="font-mono text-text-secondary bg-slate-100 px-1.5 py-0.5 rounded">{formState.internshipSpecificData.transactionId}</span></span>
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full uppercase tracking-wider">Authorized</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Payment Screenshot Receipt *</span>
                    
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
                        className={`border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:bg-slate-50/50 hover:border-secondary transition-all ${
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
                        <p className="text-sm font-bold text-text-primary">Drag & Drop or Click to upload receipt</p>
                        <p className="text-xs text-helper mt-1">Accepts images & PDF (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 bg-slate-50 border border-border rounded-xl p-4">
                        <div className="h-12 w-12 bg-white border border-slate-150 rounded-lg flex items-center justify-center text-blue-600 font-bold shrink-0">
                          {formState.internshipSpecificData.paymentScreenshot.type.includes("pdf") ? "PDF" : "IMG"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-text-primary truncate">{formState.internshipSpecificData.paymentScreenshot.name}</p>
                          <p className="text-xs text-text-secondary font-semibold">{(formState.internshipSpecificData.paymentScreenshot.size / 1024 / 1024).toFixed(2)} MB</p>
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
                    <label htmlFor="relevantExperience" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Relevant Experience For This Role *</label>
                    <textarea
                      id="relevantExperience"
                      name="relevantExperience"
                      required
                      rows={5}
                      placeholder="Detail any background projects, certifications, or past learnings related to this internship position..."
                      value={formState.internshipSpecificData.relevantExperience}
                      onBlur={() => handleBlur("relevantExperience")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "relevantExperience", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                        errors.relevantExperience && touched.relevantExperience ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    <label htmlFor="preferredTechStack" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Preferred Technology Stack *</label>
                    <textarea
                      id="preferredTechStack"
                      name="preferredTechStack"
                      required
                      rows={3}
                      placeholder="E.g. React/Next.js for frontend, Node.js/Express for backend, PostgreSQL, etc."
                      value={formState.internshipSpecificData.preferredTechStack}
                      onBlur={() => handleBlur("preferredTechStack")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "preferredTechStack", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                        errors.preferredTechStack && touched.preferredTechStack ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    <label htmlFor="relevantTechnicalExperience" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Relevant Technical Experience *</label>
                    <textarea
                      id="relevantTechnicalExperience"
                      name="relevantTechnicalExperience"
                      required
                      rows={4}
                      placeholder="Describe any industrial experience, workflows, or technical applications you have configured..."
                      value={formState.internshipSpecificData.relevantTechnicalExperience}
                      onBlur={() => handleBlur("relevantTechnicalExperience")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "relevantTechnicalExperience", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                        errors.relevantTechnicalExperience && touched.relevantTechnicalExperience ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    <label htmlFor="researchAreaOfInterest" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Research Area Of Interest *</label>
                    <input
                      type="text"
                      id="researchAreaOfInterest"
                      name="researchAreaOfInterest"
                      required
                      placeholder="E.g. Neural Networks, Computer Vision, Cryptography"
                      value={formState.internshipSpecificData.researchAreaOfInterest}
                      onBlur={() => handleBlur("researchAreaOfInterest")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "researchAreaOfInterest", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                        errors.researchAreaOfInterest && touched.researchAreaOfInterest ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    <label htmlFor="researchInterestStatement" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Research Interest Statement *</label>
                    <textarea
                      id="researchInterestStatement"
                      name="researchInterestStatement"
                      required
                      rows={4}
                      placeholder="Why does this research area interest you? What goals or outcomes do you aim to pursue?"
                      value={formState.internshipSpecificData.researchInterestStatement}
                      onBlur={() => handleBlur("researchInterestStatement")}
                      onChange={(e) => handleInputChange("internshipSpecificData", "researchInterestStatement", e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                        errors.researchInterestStatement && touched.researchInterestStatement ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    <label htmlFor="publicationsAvailable" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Publications Available</label>
                    <select
                      id="publicationsAvailable"
                      name="publicationsAvailable"
                      value={formState.internshipSpecificData.publicationsAvailable}
                      onChange={(e) => handleInputChange("internshipSpecificData", "publicationsAvailable", e.target.value as "Yes" | "No")}
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white text-text-primary transition-all"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {formState.internshipSpecificData.publicationsAvailable === "Yes" && (
                    <div className="animate-slide-in">
                      <label htmlFor="publicationLinks" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Publication Links *</label>
                      <textarea
                        id="publicationLinks"
                        name="publicationLinks"
                        required
                        rows={3}
                        placeholder="Provide links to your published papers, IEEE/ACM profiles, or repositories..."
                        value={formState.internshipSpecificData.publicationLinks}
                        onBlur={() => handleBlur("publicationLinks")}
                        onChange={(e) => handleInputChange("internshipSpecificData", "publicationLinks", e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-slate-850 transition-all ${
                          errors.publicationLinks && touched.publicationLinks ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                <h3 className="text-xl font-bold text-text-primary mb-1">Documents Upload</h3>
                <p className="text-xs text-text-secondary">Upload your academic or professional curriculum vitae. Ensure it contains correct and updated information.</p>
              </div>

              <div>
                <span className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Resume Upload (PDF Format) *</span>
                
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
                    className={`border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:bg-slate-50/50 hover:border-secondary transition-all ${
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
                    <p className="text-sm font-bold text-text-primary">Drag & Drop or click to upload your Resume</p>
                    <p className="text-xs text-helper mt-1">Accepts PDF format only (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-slate-50 border border-border rounded-xl p-5 shadow-sm">
                    <div className="h-12 w-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-extrabold text-sm shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text-primary truncate">{formState.documents.resume.name}</p>
                      <p className="text-xs text-text-secondary font-semibold">{(formState.documents.resume.size / 1024 / 1024).toFixed(2)} MB</p>
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
              {internshipType === "stipend" && (
                <div className="mt-6">
                  <span className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Passbook / Bank Document (For Stipend) *</span>
                  
                  {!formState.documents.passbook ? (
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        errors.passbook ? "border-rose-300 bg-rose-50/50" : "border-border hover:border-secondary hover:bg-blue-50/50 bg-slate-50"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0], "passbook");
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <div className="p-3 bg-white shadow-sm rounded-full">
                          <UploadIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-text-primary">Click to upload or drag and drop Passbook</p>
                        <p className="text-xs text-text-secondary">JPG, PNG, WEBP, PDF up to 5MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl mt-2">
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="h-6 w-6 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900 line-clamp-1">{formState.documents.passbook.name}</p>
                          <p className="text-xs text-emerald-600">{(formState.documents.passbook.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("passbook")}
                        className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  )}
                  {errors.passbook && (
                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1.5">
                      <WarningIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {errors.passbook}
                    </p>
                  )}
                </div>
              )}

            </div>
          )}

          {/* STEP 6: MOTIVATION */}
          {currentStep === 5 && (
            <div className="animate-slide-in space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Motivation Statement</h3>
                <p className="text-xs text-text-secondary">Describe why you want this role and how this internship fits into your future career aspirations.</p>
              </div>

              <div>
                <label htmlFor="whyInternship" className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wide">Why do you want this internship? *</label>
                <span id="why-hint" className="block text-[11px] text-text-secondary mb-2 font-medium">Minimum 100 characters required. Tell us about your passion and alignment.</span>
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
                  className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder-slate-400 text-text-primary transition-all ${
                    errors.whyInternship && touched.whyInternship ? "border-rose-500 bg-rose-50/20" : "border-border"
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
                    (formState.motivation.whyInternship?.length || 0) >= 100 ? "text-emerald-600" : "text-text-secondary"
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
                <h3 className="text-xl font-bold text-text-primary mb-1">Verify Application Summary</h3>
                <p className="text-xs text-text-secondary">Review all information details carefully. You can directly edit any section before submitting your application.</p>
              </div>

              <div className="space-y-6">
                
                {/* Personal Information */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                    <div><span className="text-text-secondary">Name:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.firstName} {formState.personalInformation.lastName}</span></div>
                    <div><span className="text-text-secondary">Email:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.email}</span></div>
                    <div><span className="text-text-secondary">Mobile:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.mobileNumber}</span></div>
                    <div><span className="text-text-secondary">DOB:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.dateOfBirth || "N/A"}</span></div>
                    <div><span className="text-text-secondary">Gender:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.gender || "N/A"}</span></div>
                    <div><span className="text-text-secondary">Location:</span> <span className="font-semibold text-text-primary">{formState.personalInformation.city}, {formState.personalInformation.state}</span></div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                    <div className="col-span-2"><span className="text-text-secondary">College:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.collegeName}</span></div>
                    <div><span className="text-text-secondary">Department:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.department}</span></div>
                    <div><span className="text-text-secondary">Degree:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.degree}</span></div>
                    <div><span className="text-text-secondary">Current Year:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.currentYear}</span></div>
                    <div><span className="text-text-secondary">CGPA / %:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.cgpaPercentage}</span></div>
                    <div><span className="text-text-secondary">Graduation Year:</span> <span className="font-semibold text-text-primary">{formState.academicInformation.graduationYear}</span></div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                    <div><span className="text-text-secondary">Skills:</span> <span className="font-semibold text-text-primary">{formState.professionalInformation.skills}</span></div>
                    {formState.professionalInformation.githubUrl && <div><span className="text-text-secondary">GitHub:</span> <a href={formState.professionalInformation.githubUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.githubUrl}</a></div>}
                    {formState.professionalInformation.linkedinUrl && <div><span className="text-text-secondary">LinkedIn:</span> <a href={formState.professionalInformation.linkedinUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.linkedinUrl}</a></div>}
                    {formState.professionalInformation.portfolioUrl && <div><span className="text-text-secondary">Portfolio:</span> <a href={formState.professionalInformation.portfolioUrl} target="_blank" className="font-semibold text-blue-600 hover:underline">{formState.professionalInformation.portfolioUrl}</a></div>}
                    {formState.professionalInformation.projectExperience && <div><span className="text-text-secondary">Project Info:</span> <p className="font-medium text-text-primary mt-1 whitespace-pre-wrap">{formState.professionalInformation.projectExperience}</p></div>}
                  </div>
                </div>

                {/* Internship Specific Information */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                    <div><span className="text-text-secondary">Internship Selected:</span> <span className="font-bold text-blue-600 capitalize">{internshipType} Internship</span></div>
                    
                    {internshipType === "free" && <div><span className="text-text-secondary italic">Free Internship requires no additional fields.</span></div>}
                    {internshipType === "corporate" && <div><span className="text-text-secondary italic">Corporate sponsored program requires no additional fields.</span></div>}
                    
                    {internshipType === "paid" && (
                      <div className="mt-2 space-y-1.5 bg-slate-50 border border-slate-150 rounded-xl p-3">
                        <p className="font-bold text-text-primary flex items-center gap-1.5">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                          Payment Completed & Verified (₹1,500)
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-text-secondary">
                          <div><span className="text-text-secondary">Payment Mode:</span> <span className="font-semibold">{formState.internshipSpecificData.paymentMode}</span></div>
                          {formState.internshipSpecificData.paymentMode === "UPI" && (
                            <>
                              <div><span className="text-text-secondary">UPI App:</span> <span className="font-semibold">{formState.internshipSpecificData.upiApp}</span></div>
                              <div className="col-span-2"><span className="text-text-secondary">Transaction ID:</span> <span className="font-mono bg-slate-100 px-1 rounded">{formState.internshipSpecificData.transactionId}</span></div>
                            </>
                          )}
                          {formState.internshipSpecificData.paymentMode === "Bank Transfer" && (
                            <>
                              <div><span className="text-text-secondary">Bank Name:</span> <span className="font-semibold">{formState.internshipSpecificData.bankName}</span></div>
                              <div><span className="text-text-secondary">Date:</span> <span className="font-semibold">{formState.internshipSpecificData.transferDate}</span></div>
                              <div className="col-span-2"><span className="text-text-secondary">UTR / Transaction ID:</span> <span className="font-mono bg-slate-100 px-1 rounded">{formState.internshipSpecificData.transactionId}</span></div>
                            </>
                          )}
                          {(formState.internshipSpecificData.paymentMode === "Credit Card" || formState.internshipSpecificData.paymentMode === "Debit Card") && (
                            <>
                              <div><span className="text-text-secondary">Card Network:</span> <span className="font-semibold">{formState.internshipSpecificData.cardType}</span></div>
                              <div><span className="text-text-secondary">Last 4 Digits:</span> <span className="font-semibold">**** {formState.internshipSpecificData.last4Digits}</span></div>
                              <div><span className="text-text-secondary">Auth Code:</span> <span className="font-semibold">{formState.internshipSpecificData.authCode}</span></div>
                              <div className="col-span-2"><span className="text-text-secondary">Transaction ID:</span> <span className="font-mono bg-slate-100 px-1 rounded">{formState.internshipSpecificData.transactionId}</span></div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {internshipType === "stipend" && (
                      <div>
                        <span className="text-text-secondary">Relevant Experience:</span>
                        <p className="font-medium text-text-primary mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.relevantExperience}</p>
                      </div>
                    )}

                    {internshipType === "industrial" && (
                      <div className="space-y-2">
                        <div><span className="text-text-secondary">Preferred Stack:</span> <p className="font-semibold text-text-primary mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.preferredTechStack}</p></div>
                        <div><span className="text-text-secondary">Technical experience:</span> <p className="font-medium text-text-primary mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.relevantTechnicalExperience}</p></div>
                      </div>
                    )}

                    {internshipType === "research" && (
                      <div className="space-y-2">
                        <div><span className="text-text-secondary">Research Area of Interest:</span> <span className="font-semibold text-text-primary">{formState.internshipSpecificData.researchAreaOfInterest}</span></div>
                        <div><span className="text-text-secondary">Interest statement:</span> <p className="font-medium text-text-primary mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.researchInterestStatement}</p></div>
                        <div><span className="text-text-secondary">Publications Available:</span> <span className="font-semibold text-text-primary">{formState.internshipSpecificData.publicationsAvailable}</span></div>
                        {formState.internshipSpecificData.publicationsAvailable === "Yes" && <div><span className="text-text-secondary">Publications links:</span> <p className="font-medium text-text-primary mt-1 whitespace-pre-wrap">{formState.internshipSpecificData.publicationLinks}</p></div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                  <div className="text-xs space-y-2">
                    <div><span className="text-text-secondary">Resume:</span> <span className="font-bold text-text-primary bg-slate-50 px-3.5 py-1.5 border border-slate-150 rounded inline-block">{formState.documents.resume?.name} ({(formState.documents.resume ? formState.documents.resume.size / 1024 / 1024 : 0).toFixed(2)} MB)</span></div>
                    {internshipType === "stipend" && (
                      <div><span className="text-text-secondary">Passbook:</span> <span className="font-bold text-text-primary bg-slate-50 px-3.5 py-1.5 border border-slate-150 rounded inline-block">{formState.documents.passbook?.name} ({(formState.documents.passbook ? formState.documents.passbook.size / 1024 / 1024 : 0).toFixed(2)} MB)</span></div>
                    )}
                  </div>
                </div>

                {/* Motivation */}
                <div className="border border-border rounded-2xl p-5 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
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
                    <p className="font-medium text-text-primary whitespace-pre-wrap leading-relaxed">{formState.motivation.whyInternship}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Form Action Buttons Footer */}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-6 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-secondary hover:bg-slate-55 transition-all ${
                currentStep === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              ← Previous
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleNext}
                className={`flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] ${
                  currentStep < steps.length - 1 ? "flex" : "hidden"
                }`}
              >
                Next Step →
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentStep === steps.length - 1 ? "flex" : "hidden"
                }`}
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
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between text-text-primary">
      <div>
        {/* Navigation Header */}
        <header className="h-16 w-full bg-white flex items-center justify-between px-6 lg:px-16 border-b border-border sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Pinesphere Logo" className="h-13.5 w-auto object-contain transition-transform hover:scale-[1.02]" />
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <ArrowBackIcon className="h-4 w-4" /> Return to Homepage
          </Link>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">Apply for Internship</h1>
            <p className="text-sm text-text-secondary">Submit your customized application to begin your internship journey with Pinesphere.</p>
          </div>

          <Suspense fallback={<div className="p-8 text-center text-text-secondary bg-white border border-border rounded-2xl">Loading application portal details...</div>}>
            <ApplicationFormContent />
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-150 bg-white py-6 px-8 lg:px-24 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-wider text-text-secondary">
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
