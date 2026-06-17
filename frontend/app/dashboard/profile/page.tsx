"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDashboard } from '../DashboardContext';
import { 
  Camera, 
  Save, 
  ArrowLeft, 
  User, 
  BookOpen, 
  Briefcase, 
  FileText, 
  Trash2,
  FileCheck
} from 'lucide-react';

interface FileData {
  name: string;
  size: string;
  base64: string;
}

interface UserProfile {
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
    internshipType: string;
    preferredTechStack: string;
    relevantExperience?: string;
  };
  documents: {
    resumeName: string;
    resumeBase64: string | null;
  };
}

const defaultProfile: UserProfile = {
  personalInformation: {
    firstName: "Harini",
    lastName: "S",
    email: "harini@pinesphere.com",
    mobileNumber: "9876543210",
    dateOfBirth: "2004-05-15",
    gender: "Female",
    city: "Chennai",
    state: "Tamil Nadu",
  },
  academicInformation: {
    collegeName: "Anna University",
    department: "Computer Science and Engineering",
    degree: "B.E",
    currentYear: "Final Year",
    cgpaPercentage: "8.9",
    graduationYear: "2026",
  },
  professionalInformation: {
    skills: "React, Next.js, TypeScript, TailwindCSS, Node.js, Python, Git",
    githubUrl: "https://github.com/harini",
    linkedinUrl: "https://linkedin.com/in/harini",
    portfolioUrl: "https://harini.dev",
    projectExperience: "Designed and built an AI-powered enterprise ERP portal integration system during the capstone phase.",
  },
  internshipSpecificData: {
    internshipType: "Free",
    preferredTechStack: "Next.js & TypeScript Architecture",
  },
  documents: {
    resumeName: "Harini_Resume.pdf",
    resumeBase64: null,
  }
};

export default function ProfilePage() {
  const { 
    username, 
    setUsername, 
    profilePicture, 
    setProfilePicture, 
    showToastNotification 
  } = useDashboard();

  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'professional' | 'internship'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Load profile data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('pinesphere_user_profile');
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error("Failed to parse stored user profile", e);
        }
      } else {
        // Fallback to check for drafts
        const types = ["free", "paid", "stipend", "industrial", "corporate", "research"];
        let draftFound = false;
        
        for (const type of types) {
          const draft = localStorage.getItem(`pinesphere_internship_draft_${type}`);
          if (draft) {
            try {
              const parsed = JSON.parse(draft);
              const merged: UserProfile = {
                personalInformation: {
                  firstName: parsed.personalInformation?.firstName || defaultProfile.personalInformation.firstName,
                  lastName: parsed.personalInformation?.lastName || defaultProfile.personalInformation.lastName,
                  email: parsed.personalInformation?.email || defaultProfile.personalInformation.email,
                  mobileNumber: parsed.personalInformation?.mobileNumber || defaultProfile.personalInformation.mobileNumber,
                  dateOfBirth: parsed.personalInformation?.dateOfBirth || defaultProfile.personalInformation.dateOfBirth,
                  gender: parsed.personalInformation?.gender || defaultProfile.personalInformation.gender,
                  city: parsed.personalInformation?.city || defaultProfile.personalInformation.city,
                  state: parsed.personalInformation?.state || defaultProfile.personalInformation.state,
                },
                academicInformation: {
                  collegeName: parsed.academicInformation?.collegeName || defaultProfile.academicInformation.collegeName,
                  department: parsed.academicInformation?.department || defaultProfile.academicInformation.department,
                  degree: parsed.academicInformation?.degree || defaultProfile.academicInformation.degree,
                  currentYear: parsed.academicInformation?.currentYear || defaultProfile.academicInformation.currentYear,
                  cgpaPercentage: parsed.academicInformation?.cgpaPercentage || defaultProfile.academicInformation.cgpaPercentage,
                  graduationYear: parsed.academicInformation?.graduationYear || defaultProfile.academicInformation.graduationYear,
                },
                professionalInformation: {
                  skills: parsed.professionalInformation?.skills || defaultProfile.professionalInformation.skills,
                  githubUrl: parsed.professionalInformation?.githubUrl || defaultProfile.professionalInformation.githubUrl,
                  linkedinUrl: parsed.professionalInformation?.linkedinUrl || defaultProfile.professionalInformation.linkedinUrl,
                  portfolioUrl: parsed.professionalInformation?.portfolioUrl || defaultProfile.professionalInformation.portfolioUrl,
                  projectExperience: parsed.professionalInformation?.projectExperience || defaultProfile.professionalInformation.projectExperience,
                },
                internshipSpecificData: {
                  internshipType: type.charAt(0).toUpperCase() + type.slice(1),
                  preferredTechStack: parsed.internshipSpecificData?.preferredTechStack || defaultProfile.internshipSpecificData.preferredTechStack,
                  relevantExperience: parsed.internshipSpecificData?.relevantExperience || parsed.internshipSpecificData?.relevantTechnicalExperience || ""
                },
                documents: {
                  resumeName: parsed.documents?.resume?.name || defaultProfile.documents.resumeName,
                  resumeBase64: parsed.documents?.resume?.base64 || null
                }
              };
              setProfile(merged);
              draftFound = true;
              break;
            } catch (err) {
              console.error("Failed to parse draft", err);
            }
          }
        }
        
        // If username exists in localStorage but no profile is saved, pre-populate first/last name
        const storedName = localStorage.getItem('pinesphere_username');
        if (storedName && !draftFound) {
          const parts = storedName.split(' ');
          const fName = parts[0] || "Harini";
          const lName = parts.slice(1).join(' ') || "S";
          setProfile(prev => ({
            ...prev,
            personalInformation: {
              ...prev.personalInformation,
              firstName: fName,
              lastName: lName,
              email: `${fName.toLowerCase()}@pinesphere.com`
            }
          }));
        }
      }
    }
  }, []);

  const handleInputChange = (section: keyof UserProfile, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as object,
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToastNotification("Only image files are accepted.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setProfilePicture(reader.result as string);
        showToastNotification("Profile picture updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
 
    if (file.type !== 'application/pdf') {
      showToastNotification("Please upload resume in PDF format only.");
      return;
    }
 
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const updatedProfile = {
          ...profile,
          documents: {
            resumeName: file.name,
            resumeBase64: reader.result as string
          }
        };
        setProfile(updatedProfile);
        localStorage.setItem('pinesphere_user_profile', JSON.stringify(updatedProfile));
        showToastNotification("Resume document updated and saved!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
 
    // Sync context username
    const fullName = `${profile.personalInformation.firstName.trim()} ${profile.personalInformation.lastName.trim()}`;
    setUsername(fullName);
 
    // Save full profile configuration
    localStorage.setItem('pinesphere_user_profile', JSON.stringify(profile));
 
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      showToastNotification("Profile updated successfully!");
    }, 800);
  };

  const removeProfilePic = () => {
    setProfilePicture(null);
    showToastNotification("Profile picture removed.");
  };

  return (
    <div className="space-y-6 animate-slide-in">
      
      {/* Top action header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-650 transition-colors shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
              <span>My Profile</span>
              {isDirty && (
                <span className="text-[9px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-450">Review and modify your student details and upload documents.</p>
          </div>
        </div>
        
        {/* Header Save/Update button */}
        <button
          onClick={() => handleSaveProfile()}
          disabled={isSaving}
          className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer shadow-sm active:scale-[0.98] flex items-center gap-2 ${
            isDirty 
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/15' 
              : 'bg-blue-650 hover:bg-blue-700 text-white shadow-blue-500/10'
          }`}
        >
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : isDirty ? "Update Profile" : "Save Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PROFILE CARD */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          
          {/* Avatar Upload Area */}
          <div className="relative group mb-4">
            <div className="h-28 w-28 rounded-full border-2 border-slate-100 overflow-hidden bg-slate-50 shadow-inner flex items-center justify-center relative">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile Picture" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <span className="text-3xl font-black text-slate-400 uppercase">
                  {profile.personalInformation.firstName[0]}{profile.personalInformation.lastName[0]}
                </span>
              )}
              
              {/* Overlay hover trigger */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                aria-label="Upload profile picture"
              >
                <Camera className="h-6 w-6" />
              </button>
            </div>

            {/* Hidden Input File */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleProfilePicUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <h2 className="font-extrabold text-slate-800 text-lg">
            {profile.personalInformation.firstName} {profile.personalInformation.lastName}
          </h2>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">
            Intern Developer ({profile.internshipSpecificData.internshipType} Program)
          </p>
          <p className="text-xs text-slate-400 mb-6">{profile.personalInformation.email}</p>

          <div className="w-full flex flex-col gap-2.5 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Upload Photo</span>
            </button>
            {profilePicture && (
              <button 
                type="button"
                onClick={removeProfilePic}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          {/* Academic/Professional summary boxes */}
          <div className="w-full space-y-3 mt-6 pt-5 border-t border-slate-100 text-left text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">College Details:</span>
              <p className="font-bold text-slate-750">{profile.academicInformation.collegeName}</p>
              <p className="text-[10px] text-slate-500">{profile.academicInformation.degree} - {profile.academicInformation.department}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Submitted Resume:</span>
              </span>
              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200/80 rounded-lg">
                <span className="font-bold text-slate-650 truncate flex-1 text-[11px]">
                  {profile.documents.resumeName}
                </span>
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-750 shrink-0 uppercase tracking-wide"
                >
                  Change
                </button>
              </div>
              <input 
                type="file" 
                ref={resumeInputRef} 
                onChange={handleResumeUpload} 
                accept="application/pdf" 
                className="hidden" 
              />
            </div>
          </div>

        </div>

        {/* RIGHT DETAILS FORM */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'personal', label: 'Personal Information', icon: User },
              { id: 'academic', label: 'Academic Information', icon: BookOpen },
              { id: 'professional', label: 'Professional Portfolio', icon: Briefcase },
              { id: 'internship', label: 'Internship Details', icon: FileCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* TAB 1: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Contact & Identification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">First Name</label>
                      <input 
                        type="text" 
                        value={profile.personalInformation.firstName}
                        onChange={(e) => handleInputChange('personalInformation', 'firstName', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.personalInformation.lastName}
                        onChange={(e) => handleInputChange('personalInformation', 'lastName', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={profile.personalInformation.email}
                        onChange={(e) => handleInputChange('personalInformation', 'email', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={profile.personalInformation.mobileNumber}
                        onChange={(e) => handleInputChange('personalInformation', 'mobileNumber', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Date of Birth</label>
                      <input 
                        type="date" 
                        value={profile.personalInformation.dateOfBirth}
                        onChange={(e) => handleInputChange('personalInformation', 'dateOfBirth', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Gender</label>
                      <select 
                        value={profile.personalInformation.gender}
                        onChange={(e) => handleInputChange('personalInformation', 'gender', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">City</label>
                      <input 
                        type="text" 
                        value={profile.personalInformation.city}
                        onChange={(e) => handleInputChange('personalInformation', 'city', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">State</label>
                      <input 
                        type="text" 
                        value={profile.personalInformation.state}
                        onChange={(e) => handleInputChange('personalInformation', 'state', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC INFORMATION */}
            {activeTab === 'academic' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Educational Records</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">College Name</label>
                      <input 
                        type="text" 
                        value={profile.academicInformation.collegeName}
                        onChange={(e) => handleInputChange('academicInformation', 'collegeName', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Department</label>
                      <input 
                        type="text" 
                        value={profile.academicInformation.department}
                        onChange={(e) => handleInputChange('academicInformation', 'department', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Degree</label>
                      <input 
                        type="text" 
                        value={profile.academicInformation.degree}
                        onChange={(e) => handleInputChange('academicInformation', 'degree', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Current Year of Study</label>
                      <select 
                        value={profile.academicInformation.currentYear}
                        onChange={(e) => handleInputChange('academicInformation', 'currentYear', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="First Year">First Year</option>
                        <option value="Second Year">Second Year</option>
                        <option value="Third Year">Third Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduated">Graduated / Post-grad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">CGPA / Percentage</label>
                      <input 
                        type="text" 
                        value={profile.academicInformation.cgpaPercentage}
                        onChange={(e) => handleInputChange('academicInformation', 'cgpaPercentage', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Graduation Year</label>
                      <input 
                        type="text" 
                        value={profile.academicInformation.graduationYear}
                        onChange={(e) => handleInputChange('academicInformation', 'graduationYear', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROFESSIONAL PORTFOLIO */}
            {activeTab === 'professional' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Portfolio Links & Credentials</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Technical Skills (Comma separated)</label>
                      <input 
                        type="text" 
                        value={profile.professionalInformation.skills}
                        onChange={(e) => handleInputChange('professionalInformation', 'skills', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">GitHub Profile URL</label>
                        <input 
                          type="url" 
                          value={profile.professionalInformation.githubUrl}
                          onChange={(e) => handleInputChange('professionalInformation', 'githubUrl', e.target.value)}
                          className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">LinkedIn Profile URL</label>
                        <input 
                          type="url" 
                          value={profile.professionalInformation.linkedinUrl}
                          onChange={(e) => handleInputChange('professionalInformation', 'linkedinUrl', e.target.value)}
                          className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Portfolio Website URL</label>
                        <input 
                          type="url" 
                          value={profile.professionalInformation.portfolioUrl}
                          onChange={(e) => handleInputChange('professionalInformation', 'portfolioUrl', e.target.value)}
                          className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Relevant Project / Technical Experience</label>
                      <textarea 
                        rows={4}
                        value={profile.professionalInformation.projectExperience}
                        onChange={(e) => handleInputChange('professionalInformation', 'projectExperience', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INTERNSHIP DETAILS */}
            {activeTab === 'internship' && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">Internship Specific Configurations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Internship Program Type</label>
                      <input 
                        type="text" 
                        value={profile.internshipSpecificData.internshipType}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Preferred Tech Stack</label>
                      <input 
                        type="text" 
                        value={profile.internshipSpecificData.preferredTechStack}
                        onChange={(e) => handleInputChange('internshipSpecificData', 'preferredTechStack', e.target.value)}
                        className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    {profile.internshipSpecificData.relevantExperience !== undefined && (
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Additional Relevance statement</label>
                        <textarea 
                          rows={3}
                          value={profile.internshipSpecificData.relevantExperience}
                          onChange={(e) => handleInputChange('internshipSpecificData', 'relevantExperience', e.target.value)}
                          className="w-full border border-slate-350 rounded-xl px-4 py-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600 resize-none leading-relaxed"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10 active:scale-[0.98]"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
