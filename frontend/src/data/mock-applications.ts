export type ApplicationStatus =
  | 'Pending'
  | 'Interview'
  | 'Accepted'
  | 'Rejected'
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Hold'
  | 'Documents Missing'
  | 'Payment Verification Pending'
  | 'DRAFT'
  | 'WITHDRAWN';

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  type: 'Resume' | 'ID Proof' | 'Certificate' | 'Portfolio';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  candidateName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  
  // Academic
  college: string;
  department: string;
  degree: string;
  currentYear: string;
  cgpa: number;
  graduationYear: string;

  // Professional
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  projectExperience: string;

  // Motivation & Document
  resumeUrl: string;
  whyInternship: string;

  // Internship Type
  internshipType: 'free' | 'paid' | 'stipend' | 'industrial' | 'corporate' | 'research';
  status: ApplicationStatus;
  appliedDate: string;
  assignedReviewer: string;

  // Internship Specific Information
  feeAccepted?: boolean;
  paymentMode?: string;
  transactionId?: string;
  paymentScreenshot?: string;
  paymentVerified?: 'Pending' | 'Verified' | 'Rejected';
  
  relevantExperience?: string;
  
  preferredTechStack?: string;
  technicalExperience?: string;
  
  researchArea?: string;
  researchStatement?: string;
  publications?: string;
  publicationLinks?: string[];

  // Review Workspace
  reviewScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  academicScore?: number;
  cultureFitScore?: number;
  overallRecommendation?: 'Strong Hire' | 'Hire' | 'No Hire' | 'Strong No Hire' | 'Hold';
  reviewerNotes?: string;
  reviewerFeedback?: string;

  // AI Assistance Panel
  aiMatchPercentage?: number;
  aiStrengths?: string[];
  aiWeaknesses?: string[];
  aiMissingInfo?: string;
  aiRiskFlags?: string[];
  aiRecommendedLevel?: string;
  aiSuggestedQuestions?: string[];
  aiResumeSummary?: string;
  aiSentiment?: 'Positive' | 'Neutral' | 'Concern';
  aiCommitmentScore?: number;
  aiCommunicationScore?: number;
  aiExperienceSummary?: string;
  aiSkillMatchPercentage?: number;
  aiResearchFitScore?: number;
}

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-l1',
    candidateName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    dob: '2002-05-14',
    gender: 'Male',
    city: 'San Francisco',
    state: 'CA',
    college: 'Stanford University',
    department: 'Computer Science',
    degree: 'B.S.',
    currentYear: '3rd Year',
    cgpa: 9.2,
    graduationYear: '2027',
    skills: ['React', 'TypeScript', 'Node.js', 'FastAPI', 'Python'],
    githubUrl: 'https://github.com/johndoe',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    projectExperience: 'Built a full-stack ecommerce site and managed backend load using Redis caching.',
    resumeUrl: 'john_doe_resume.pdf',
    whyInternship: 'I want to build real production features and understand how scalable SaaS environments are designed.',
    internshipType: 'stipend',
    status: 'New',
    appliedDate: '2023-10-16',
    assignedReviewer: 'Alice Vance',
    relevantExperience: 'Worked on 3 frontend freelance projects and built a popular NPM library.',
    reviewScore: 82,
    technicalScore: 8,
    communicationScore: 9,
    academicScore: 8,
    cultureFitScore: 8,
    overallRecommendation: 'Hire',
    reviewerNotes: 'Strong React skills and good overall logic. Ready for coding rounds.',
    aiMatchPercentage: 88,
    aiStrengths: ['Strong React background', 'Independent freelance work', 'NPM open-source contributor'],
    aiWeaknesses: ['Lacks large database scaling experience'],
    aiMissingInfo: 'Confirmation of winter break availability.',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Intermediate Intern',
    aiSuggestedQuestions: [
      'Explain your process for building the NPM package.',
      'How would you optimize React rendering for a long list of candidates?'
    ],
    aiResumeSummary: 'Highly motivated CS junior with solid practical front-end experience and contributions to open source.',
    aiSentiment: 'Positive',
    aiCommitmentScore: 90,
    aiCommunicationScore: 95,
    aiExperienceSummary: 'Proven ability to build client-ready interfaces with zero handholding.'
  },
  {
    id: 'app-2',
    opportunityId: 'opp-l1',
    candidateName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '234-567-8901',
    dob: '2001-08-22',
    gender: 'Female',
    city: 'Boston',
    state: 'MA',
    college: 'Massachusetts Institute of Technology',
    department: 'Electrical Engineering & Computer Science',
    degree: 'B.S.',
    currentYear: '4th Year',
    cgpa: 9.6,
    graduationYear: '2026',
    skills: ['Python', 'Go', 'Docker', 'Kubernetes', 'FastAPI', 'PostgreSQL'],
    githubUrl: 'https://github.com/janesmith',
    linkedinUrl: 'https://linkedin.com/in/janesmith',
    portfolioUrl: 'https://janesmith.io',
    projectExperience: 'Optimized Docker container deployment workflows, reducing spin-up latency by 40%.',
    resumeUrl: 'jane_smith_resume.pdf',
    whyInternship: 'Interested in working with high-throughput cloud environments and microservices pipelines.',
    internshipType: 'industrial',
    status: 'Interview Scheduled',
    appliedDate: '2023-10-18',
    assignedReviewer: 'David Miller',
    preferredTechStack: 'Go, Kubernetes, AWS',
    technicalExperience: 'Prior internship at a fintech startup working on serverless database tasks.',
    reviewScore: 95,
    technicalScore: 10,
    communicationScore: 9,
    academicScore: 10,
    cultureFitScore: 9,
    overallRecommendation: 'Strong Hire',
    reviewerNotes: 'Exceptional backend foundation. Handled scaling questions with ease.',
    aiMatchPercentage: 96,
    aiStrengths: ['Kubernetes deployment experience', 'Perfect CGPA/Academic pedigree', 'Go optimization skills'],
    aiWeaknesses: ['Minimal front-end experience'],
    aiMissingInfo: 'None',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Advanced Intern',
    aiSuggestedQuestions: [
      'Describe a scenario where a database connection pool limits your serverless performance.',
      'How do you manage configuration secrets in a Docker cluster?'
    ],
    aiResumeSummary: 'Brilliant MIT senior specializing in backend microservices infrastructure, containerization, and devops pipelines.',
    aiSentiment: 'Positive',
    aiCommitmentScore: 98,
    aiCommunicationScore: 92,
    aiSkillMatchPercentage: 97
  },
  {
    id: 'app-3',
    opportunityId: 'opp-l2',
    candidateName: 'Alice Johnson',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.j@example.com',
    phone: '345-678-9012',
    dob: '2003-03-09',
    gender: 'Female',
    city: 'Seattle',
    state: 'WA',
    college: 'University of Washington',
    department: 'Human-Centered Design',
    degree: 'B.Des',
    currentYear: '3rd Year',
    cgpa: 8.9,
    graduationYear: '2027',
    skills: ['Figma', 'Adobe XD', 'CSS', 'HTML', 'Design Systems'],
    githubUrl: 'https://github.com/alicejohnson',
    linkedinUrl: 'https://linkedin.com/in/alicejohnson',
    portfolioUrl: 'https://alicej.design',
    projectExperience: 'Designed an educational learning management system dashboard currently used by 5k students.',
    resumeUrl: 'alice_design_resume.pdf',
    whyInternship: 'I want to experience design sprints in a fast-growing B2B product environment.',
    internshipType: 'free',
    status: 'Selected',
    appliedDate: '2023-10-19',
    assignedReviewer: 'Sarah Connor',
    reviewScore: 88,
    technicalScore: 9,
    communicationScore: 10,
    academicScore: 8,
    cultureFitScore: 9,
    overallRecommendation: 'Hire',
    reviewerNotes: 'Splendid UI portfolio. Excellent understanding of layout hierarchy.',
    aiMatchPercentage: 91,
    aiStrengths: ['Rich UI design portfolio', 'LMS system designer', 'Collaborative and creative approach'],
    aiWeaknesses: ['No Tailwind coding history'],
    aiMissingInfo: 'None',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Intermediate Designer',
    aiSuggestedQuestions: [
      'Walk me through the user research you performed for your LMS student dashboard.',
      'How do you hand off design tokens to engineers?'
    ],
    aiResumeSummary: 'Creative designer from UW with a focus on modern user experience and interactive UI widgets.',
    aiSentiment: 'Positive',
    aiCommitmentScore: 92,
    aiCommunicationScore: 100
  },
  {
    id: 'app-4',
    opportunityId: 'opp-l3',
    candidateName: 'Bob Williams',
    firstName: 'Bob',
    lastName: 'Williams',
    email: 'bob.w@example.com',
    phone: '456-789-0123',
    dob: '2000-11-17',
    gender: 'Male',
    city: 'Austin',
    state: 'TX',
    college: 'University of Texas',
    department: 'Data Analytics',
    degree: 'M.S.',
    currentYear: '2nd Year',
    cgpa: 7.8,
    graduationYear: '2026',
    skills: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Excel'],
    githubUrl: 'https://github.com/bobwilliams',
    linkedinUrl: 'https://linkedin.com/in/bobwilliams',
    portfolioUrl: 'https://bobdata.me',
    projectExperience: 'Created custom visualization widgets for a logistics company to spot warehouse bottlenecks.',
    resumeUrl: 'bob_williams_resume.pdf',
    whyInternship: 'To gain access to live complex datasets and translate predictions into strategic revenue.',
    internshipType: 'research',
    status: 'Rejected',
    appliedDate: '2023-11-05',
    assignedReviewer: 'David Miller',
    researchArea: 'Predictive Operations',
    researchStatement: 'Investigating data streams for live logistical dispatch optimizations.',
    publications: 'None published yet.',
    publicationLinks: [],
    reviewScore: 55,
    technicalScore: 5,
    communicationScore: 6,
    academicScore: 6,
    cultureFitScore: 5,
    overallRecommendation: 'No Hire',
    reviewerNotes: 'Basic SQL is fine, but lacks depth in core machine learning theory and mathematical foundations.',
    aiMatchPercentage: 58,
    aiStrengths: ['Familiar with PowerBI dashboards'],
    aiWeaknesses: ['No publications', 'Low CGPA', 'Weak coding experience'],
    aiMissingInfo: 'Detailed research statement.',
    aiRiskFlags: ['Low academic scores', 'No machine learning proof of work'],
    aiRecommendedLevel: 'Junior Analyst',
    aiSuggestedQuestions: [],
    aiResumeSummary: 'Graduate student in Analytics with basic dashboarding and data wrangling skills.',
    aiSentiment: 'Neutral',
    aiCommitmentScore: 60,
    aiCommunicationScore: 70,
    aiResearchFitScore: 40
  },
  {
    id: 'app-5',
    opportunityId: 'opp-l3',
    candidateName: 'David Lee',
    firstName: 'David',
    lastName: 'Lee',
    email: 'david.lee@example.com',
    phone: '567-890-1234',
    dob: '2001-04-30',
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    college: 'Columbia University',
    department: 'Computer Science',
    degree: 'Ph.D.',
    currentYear: '2nd Year',
    cgpa: 9.8,
    graduationYear: '2028',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'SciPy', 'Jupyter'],
    githubUrl: 'https://github.com/davidlee',
    linkedinUrl: 'https://linkedin.com/in/davidlee',
    portfolioUrl: 'https://davidlee.ai',
    projectExperience: 'Optimized neural net architecture backpropagation routines, yielding a 15% training speedup.',
    resumeUrl: 'david_lee_academic_cv.pdf',
    whyInternship: 'To apply advanced transformer architectures to automated resume extraction systems.',
    internshipType: 'research',
    status: 'Under Review',
    appliedDate: '2023-11-10',
    assignedReviewer: 'David Miller',
    researchArea: 'Deep Learning & NLP',
    researchStatement: 'Exploring attention mechanism efficiency under sparse context vectors.',
    publications: 'Sparse attention maps in transformer networks, NAACL 2023.',
    publicationLinks: ['https://arxiv.org/abs/example1'],
    reviewScore: 92,
    technicalScore: 9,
    communicationScore: 9,
    academicScore: 10,
    cultureFitScore: 9,
    overallRecommendation: 'Hire',
    reviewerNotes: 'Excellent research pedigree. Shows clear knowledge of modern NLP models.',
    aiMatchPercentage: 94,
    aiStrengths: ['Ph.D. applicant with NAACL publication', 'Strong PyTorch performance optimizations'],
    aiWeaknesses: ['Might be overqualified for simple tooling tasks'],
    aiMissingInfo: 'None',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Research Intern',
    aiSuggestedQuestions: [
      'Describe the core implementation of your sparse attention NAACL paper.',
      'How would you handle high memory footprint when processing documents with 10k+ pages?'
    ],
    aiResumeSummary: 'NLP Researcher with solid publishing history in top-tier conferences and advanced coding proficiency in neural platforms.',
    aiSentiment: 'Positive',
    aiCommitmentScore: 95,
    aiCommunicationScore: 94,
    aiResearchFitScore: 98
  },
  {
    id: 'app-6',
    opportunityId: 'opp-l3',
    candidateName: 'Emily Chen',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@example.com',
    phone: '678-901-2345',
    dob: '2002-09-12',
    gender: 'Female',
    city: 'Chicago',
    state: 'IL',
    college: 'University of Illinois Urbana-Champaign',
    department: 'Software Engineering',
    degree: 'B.S.',
    currentYear: '3rd Year',
    cgpa: 9.1,
    graduationYear: '2027',
    skills: ['Java', 'Spring Boot', 'MySQL', 'React', 'HTML5'],
    githubUrl: 'https://github.com/emilychen',
    linkedinUrl: 'https://linkedin.com/in/emilychen',
    portfolioUrl: 'https://emilychen.codes',
    projectExperience: 'Engineered a student gradebook backend system handling 200 concurrent API requests.',
    resumeUrl: 'emily_chen_resume.pdf',
    whyInternship: 'I want to transition my theoretical backend software knowledge to cloud-native platforms.',
    internshipType: 'paid',
    status: 'Payment Verification Pending',
    appliedDate: '2023-11-12',
    assignedReviewer: 'Sarah Connor',
    feeAccepted: true,
    paymentMode: 'Stripe Checkout',
    transactionId: 'txn_3M2q8fLkdJu10a',
    paymentScreenshot: 'receipt_screen_emily.png',
    paymentVerified: 'Pending',
    reviewScore: 78,
    technicalScore: 8,
    communicationScore: 8,
    academicScore: 8,
    cultureFitScore: 7,
    overallRecommendation: 'Hold',
    reviewerNotes: 'Waiting for payment verification and transcript audit. Code looks robust.',
    aiMatchPercentage: 81,
    aiStrengths: ['Solid Java / Spring background', 'Clean gradebook project design'],
    aiWeaknesses: ['Minimal cloud or Docker deployment experience'],
    aiMissingInfo: 'Official academic transcript.',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Junior Developer Intern',
    aiSuggestedQuestions: [
      'Explain the difference between optimistic and pessimistic locking in Spring Boot JPA.'
    ],
    aiResumeSummary: 'Competent junior from UIUC with standard Java enterprise development skills and web interfaces.',
    aiSentiment: 'Neutral',
    aiCommitmentScore: 85,
    aiCommunicationScore: 88
  },
  {
    id: 'app-7',
    opportunityId: 'opp-l2',
    candidateName: 'Michael Brown',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'm.brown@example.com',
    phone: '789-012-3456',
    dob: '2003-01-15',
    gender: 'Male',
    city: 'Atlanta',
    state: 'GA',
    college: 'Georgia Institute of Technology',
    department: 'Computer Science',
    degree: 'B.S.',
    currentYear: '3rd Year',
    cgpa: 8.4,
    graduationYear: '2027',
    skills: ['Python', 'SQL', 'FastAPI', 'HTML', 'TailwindCSS'],
    githubUrl: 'https://github.com/mbrown',
    linkedinUrl: 'https://linkedin.com/in/mbrown',
    portfolioUrl: 'https://mbrown.dev',
    projectExperience: 'Configured automated database back-up scripts and integrated SMTP for transactional emails.',
    resumeUrl: 'michael_brown_resume.pdf',
    whyInternship: 'To master backend integration tests and work closer with infrastructure operations.',
    internshipType: 'free',
    status: 'Documents Missing',
    appliedDate: '2023-11-14',
    assignedReviewer: 'Alice Vance',
    reviewScore: 68,
    technicalScore: 7,
    communicationScore: 7,
    academicScore: 7,
    cultureFitScore: 6,
    overallRecommendation: 'Hold',
    reviewerNotes: 'Candidate applied but did not attach their official resume link yet. Reached out.',
    aiMatchPercentage: 70,
    aiStrengths: ['Basic scripting proficiency', 'Enthusiastic and eager to learn'],
    aiWeaknesses: ['Resume missing in database link', 'Lack of complex system design experience'],
    aiMissingInfo: 'Updated Resume PDF file.',
    aiRiskFlags: ['Missing core document'],
    aiRecommendedLevel: 'Junior Intern',
    aiSuggestedQuestions: [],
    aiResumeSummary: 'CS Student at Georgia Tech. Resume PDF link missing. GitHub shows simple script automation.',
    aiSentiment: 'Neutral',
    aiCommitmentScore: 75,
    aiCommunicationScore: 80
  },
  {
    id: 'app-8',
    opportunityId: 'opp-l1',
    candidateName: 'Sarah Jenkins',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.j@example.com',
    phone: '890-123-4567',
    dob: '2002-12-05',
    gender: 'Female',
    city: 'Denver',
    state: 'CO',
    college: 'University of Colorado',
    department: 'Information Technology',
    degree: 'B.S.',
    currentYear: '4th Year',
    cgpa: 8.8,
    graduationYear: '2026',
    skills: ['React', 'CSS', 'JavaScript', 'HTML5', 'Node.js'],
    githubUrl: 'https://github.com/sjenkins',
    linkedinUrl: 'https://linkedin.com/in/sjenkins',
    portfolioUrl: 'https://sjenkins.work',
    projectExperience: 'Designed and built a responsive blog template using React and deployed it to Vercel.',
    resumeUrl: 'sarah_jenkins_resume.pdf',
    whyInternship: 'I want to work with cross-functional product teams to refine UX and deploy web applications.',
    internshipType: 'paid',
    status: 'Hold',
    appliedDate: '2023-11-15',
    assignedReviewer: 'Alice Vance',
    feeAccepted: true,
    paymentMode: 'Google Pay',
    transactionId: 'gpay_9081237A812',
    paymentScreenshot: 'receipt_gpay_sarah.jpg',
    paymentVerified: 'Verified',
    reviewScore: 70,
    technicalScore: 7,
    communicationScore: 8,
    academicScore: 7,
    cultureFitScore: 8,
    overallRecommendation: 'Hold',
    reviewerNotes: 'Payment verified successfully. Placed on hold pending headcount alignment for Front-end teams.',
    aiMatchPercentage: 74,
    aiStrengths: ['Vercel deployment experience', 'Clean component designs'],
    aiWeaknesses: ['Lacks deep server side engineering knowledge'],
    aiMissingInfo: 'None',
    aiRiskFlags: [],
    aiRecommendedLevel: 'Junior Developer Intern',
    aiSuggestedQuestions: [],
    aiResumeSummary: 'Front-end enthusiast with good understanding of responsive layouts and basic React modules.',
    aiSentiment: 'Positive',
    aiCommitmentScore: 88,
    aiCommunicationScore: 90
  }
];
