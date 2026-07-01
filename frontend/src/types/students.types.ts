export interface StudentDocument {
  type: string;
  name: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy?: string;
  url: string;
  previewText?: string;
}

export interface StudentCredentials {
  username: string;
  portalAccess: boolean;
  lmsAccess: boolean;
  assessmentAccess: boolean;
}

export interface StudentBatch {
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  mentor: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

export interface StudentMentor {
  name: string;
  department: string;
  expertise: string;
  sessionsConducted: number;
  rating: number; // out of 5
  feedbackGiven: { date: string; content: string; reviewer: string }[];
}

export interface StudentPerformance {
  attendanceScore: number; // percentage
  assessmentScore: number; // out of 100
  projectScore: number; // out of 100
  mentorRating: number; // out of 5
  overallPerformance: number; // out of 100
  attendanceTrend: { date: string; score: number }[];
  assessmentTrend: { test: string; score: number }[];
  skills: { name: string; value: number }[];
}

export interface StudentPlacement {
  status: 'Not Eligible' | 'Eligible' | 'Placement Ready' | 'Interview Scheduled' | 'Offer Received' | 'Placed';
  company?: string;
  package?: string;
  interviewStatus?: string;
  offerStatus?: string;
}

export interface StudentTimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'registration' | 'approval' | 'id_card' | 'batch' | 'mentor' | 'assessment' | 'cert' | 'placement' | 'info';
}

export interface Student {
  id: string;
  userId: string;
  internId: string;
  applicationId?: string;
  enrollmentDate: string;
  status: 'Applied' | 'Approved' | 'Enrolled' | 'Active' | 'On Hold' | 'Completed' | 'Certified' | 'Placed' | 'Dropped' | 'Suspended';
  
  // Personal Info
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    avatar: string;
  };

  // Academic Info
  academicInfo: {
    college: string;
    department: 'CSE' | 'IT' | 'AI & DS' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil' | 'MBA';
    degree: string;
    year: number;
    cgpa: number;
    graduationYear: number;
  };

  // Internship Info
  internshipInfo: {
    program: string;
    internshipType: 'Free Internship' | 'Paid Internship' | 'Stipend Internship' | 'Industrial Internship' | 'Research Internship' | 'Corporate Internship';
    batchName: string;
    mentorId: string;
    mentorName: string;
    joiningDate: string;
    expectedCompletion: string;
  };

  documents: StudentDocument[];
  credentials: StudentCredentials;
  batch: StudentBatch;
  mentor: StudentMentor;
  performance: StudentPerformance;
  placement: StudentPlacement;
  timeline: StudentTimelineEvent[];
}