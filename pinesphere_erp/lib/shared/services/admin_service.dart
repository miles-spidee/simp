import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/shared/models/admin_models.dart';

class AdminService {
  // Stateful in-memory database mirroring mock-organizations.ts exactly
  static final List<OrganizationModel> _organizations = [
    OrganizationModel(
      id: 'org-1',
      name: 'Stanford University',
      code: 'STAN',
      type: 'Engineering',
      headcount: 1450,
      status: 'Active',
      logo: 'SU',
      university: 'Stanford Board of Trustees',
      location: 'Stanford, CA',
      partnershipStatus: 'Active',
      partnershipSince: '2021-09-01T00:00:00Z',
      website: 'https://stanford.edu',
      email: 'placements@stanford.edu',
      phone: '+1 (650) 723-2300',
      address: '450 Jane Stanford Way, Stanford, CA 94305',
      naacGrade: 'A++',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 3,
      departments: [
        OrganizationDepartment(
          name: 'Computer Science (CSE)',
          hod: 'Dr. John Hennessy',
          studentsCount: 650,
          facultyCount: 45,
          internshipsCount: 320,
          placementRate: 98,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Information Technology (IT)',
          hod: 'Dr. Jennifer Widom',
          studentsCount: 400,
          facultyCount: 30,
          internshipsCount: 180,
          placementRate: 95,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Electrical Engineering (ECE)',
          hod: 'Dr. Stephen Boyd',
          studentsCount: 400,
          facultyCount: 35,
          internshipsCount: 150,
          placementRate: 90,
          status: 'Active',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-1',
          name: 'Diana Prince',
          email: 'diana@stanford.edu',
          phone: '+1 (555) 018-4729',
          department: 'Computer Science',
          studentsManaged: 650,
          programsManaged: 4,
          status: 'Active',
          applicationsProcessed: 420,
          attendanceApprovals: 920,
          internshipCompletions: 380,
          placementSuccess: 98,
        ),
        OrganizationCoordinator(
          id: 'coord-2',
          name: 'Jane Foster',
          email: 'jane@stanford.edu',
          phone: '+1 (555) 018-2234',
          department: 'Electrical Engineering',
          studentsManaged: 400,
          programsManaged: 2,
          status: 'Active',
          applicationsProcessed: 200,
          attendanceApprovals: 450,
          internshipCompletions: 170,
          placementSuccess: 90,
        ),
      ],
      students: [
        OrganizationStudent(
          id: 'STU-1001',
          name: 'Alice Freeman',
          department: 'Computer Science (CSE)',
          year: 4,
          program: 'Silicon Valley Internship Program',
          status: 'Active',
          coordinatorName: 'Diana Prince',
        ),
        OrganizationStudent(
          id: 'STU-1002',
          name: 'Bob Johnson',
          department: 'Computer Science (CSE)',
          year: 3,
          program: 'Silicon Valley Internship Program',
          status: 'Placement Ready',
          coordinatorName: 'Diana Prince',
        ),
        OrganizationStudent(
          id: 'STU-1003',
          name: 'Charlie Miller',
          department: 'Electrical Engineering (ECE)',
          year: 4,
          program: 'Embedded Systems Accelerator',
          status: 'Placed',
          coordinatorName: 'Jane Foster',
        ),
      ],
      programs: [
        OrganizationProgram(
          name: 'Silicon Valley Internship Program',
          duration: '6 Months',
          enrolledCount: 650,
          status: 'Active',
          coordinatorName: 'Diana Prince',
          completionRate: 96,
          attendanceRate: 98,
          placementRate: 98,
          satisfactionScore: 4.8,
          performanceScore: 94,
        ),
        OrganizationProgram(
          name: 'Embedded Systems Accelerator',
          duration: '3 Months',
          enrolledCount: 400,
          status: 'Active',
          coordinatorName: 'Jane Foster',
          completionRate: 92,
          attendanceRate: 95,
          placementRate: 90,
          satisfactionScore: 4.5,
          performanceScore: 88,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'stanford_mou_2025_2030.pdf',
          uploadDate: '2025-01-10',
          status: 'Verified',
          verifiedBy: 'Charlie Davis',
          version: 'v1.0',
          previewContent: 'Memorandum of Understanding between Stanford School of Engineering and PineSphere ERP Systems. Valid for 5 years.',
        ),
        OrganizationDocument(
          type: 'Partnership Agreement',
          name: 'partnership_stanford_final.pdf',
          uploadDate: '2025-01-12',
          status: 'Verified',
          verifiedBy: 'Charlie Davis',
          version: 'v1.1',
          previewContent: 'Institutional agreement outlining credits transfer rules and active coordinator access logs.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2021-09-01',
          title: 'College Added',
          description: 'Stanford University registered as partner institution.',
          type: 'added',
        ),
        OrganizationTimelineEvent(
          date: '2021-09-05',
          title: 'MoU Signed',
          description: '5-year institutional MoU signed by Dean of Engineering.',
          type: 'mou',
        ),
        OrganizationTimelineEvent(
          date: '2021-09-10',
          title: 'Coordinator Assigned',
          description: 'Diana Prince mapped as primary coordinator for Stanford.',
          type: 'coordinator',
        ),
      ],
    ),
    OrganizationModel(
      id: 'org-2',
      name: 'Massachusetts Institute of Technology',
      code: 'MIT',
      type: 'Engineering',
      headcount: 1200,
      status: 'Active',
      logo: 'MIT',
      university: 'MIT Corporation',
      location: 'Cambridge, MA',
      partnershipStatus: 'Active',
      partnershipSince: '2022-03-10T00:00:00Z',
      website: 'https://mit.edu',
      email: 'careers@mit.edu',
      phone: '+1 (617) 253-1000',
      address: '77 Massachusetts Ave, Cambridge, MA 02139',
      naacGrade: 'A++',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 1,
      departments: [
        OrganizationDepartment(
          name: 'Computer Science (CSE)',
          hod: 'Dr. Hal Abelson',
          studentsCount: 700,
          facultyCount: 50,
          internshipsCount: 350,
          placementRate: 99,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Artificial Intelligence & DS',
          hod: 'Dr. Daniela Rus',
          studentsCount: 500,
          facultyCount: 40,
          internshipsCount: 220,
          placementRate: 98,
          status: 'Active',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-3',
          name: 'Gerry Sussman',
          email: 'sussman@mit.edu',
          phone: '+1 (555) 012-3456',
          department: 'Computer Science',
          studentsManaged: 700,
          programsManaged: 3,
          status: 'Active',
          applicationsProcessed: 450,
          attendanceApprovals: 880,
          internshipCompletions: 390,
          placementSuccess: 99,
        ),
      ],
      students: [
        OrganizationStudent(
          id: 'STU-2001',
          name: 'Evan Wright',
          department: 'Computer Science (CSE)',
          year: 3,
          program: 'MIT Frontier Internships',
          status: 'Active',
          coordinatorName: 'Gerry Sussman',
        ),
      ],
      programs: [
        OrganizationProgram(
          name: 'MIT Frontier Internships',
          duration: '6 Months',
          enrolledCount: 700,
          status: 'Active',
          coordinatorName: 'Gerry Sussman',
          completionRate: 98,
          attendanceRate: 99,
          placementRate: 99,
          satisfactionScore: 4.9,
          performanceScore: 97,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'mit_pinesphere_mou.pdf',
          uploadDate: '2022-03-01',
          status: 'Verified',
          verifiedBy: 'Charlie Davis',
          version: 'v1.0',
          previewContent: 'PineSphere Academic Alliance with MIT EECS Department. Valid till 2027.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2022-03-10',
          title: 'College Added',
          description: 'Massachusetts Institute of Technology mapped in system.',
          type: 'added',
        ),
        OrganizationTimelineEvent(
          date: '2022-03-12',
          title: 'Partnership Signed',
          description: 'All-department partnership signed at Cambridge.',
          type: 'mou',
        ),
      ],
    ),
    OrganizationModel(
      id: 'org-3',
      name: 'University of California, Berkeley',
      code: 'UCB',
      type: 'Science',
      headcount: 900,
      status: 'Active',
      logo: 'UCB',
      university: 'University of California Regents',
      location: 'Berkeley, CA',
      partnershipStatus: 'Active',
      partnershipSince: '2023-06-20T00:00:00Z',
      website: 'https://berkeley.edu',
      email: 'recruit@berkeley.edu',
      phone: '+1 (510) 642-6000',
      address: '101 Sproul Hall, Berkeley, CA 94720',
      naacGrade: 'A+',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 5,
      departments: [
        OrganizationDepartment(
          name: 'Computer Science (CSE)',
          hod: 'Dr. Michael Jordan',
          studentsCount: 500,
          facultyCount: 30,
          internshipsCount: 210,
          placementRate: 94,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Management Studies (MBA)',
          hod: 'Dr. David Aaker',
          studentsCount: 400,
          facultyCount: 25,
          internshipsCount: 150,
          placementRate: 92,
          status: 'Active',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-4',
          name: 'Richard Karp',
          email: 'karp@berkeley.edu',
          phone: '+1 (555) 013-8899',
          department: 'Computer Science',
          studentsManaged: 500,
          programsManaged: 2,
          status: 'Active',
          applicationsProcessed: 310,
          attendanceApprovals: 540,
          internshipCompletions: 290,
          placementSuccess: 94,
        ),
      ],
      students: [
        OrganizationStudent(
          id: 'STU-3001',
          name: 'George Green',
          department: 'Computer Science (CSE)',
          year: 4,
          program: 'Berkeley Tech Term',
          status: 'Completed',
          coordinatorName: 'Richard Karp',
        ),
      ],
      programs: [
        OrganizationProgram(
          name: 'Berkeley Tech Term',
          duration: '6 Months',
          enrolledCount: 500,
          status: 'Active',
          coordinatorName: 'Richard Karp',
          completionRate: 94,
          attendanceRate: 96,
          placementRate: 94,
          satisfactionScore: 4.6,
          performanceScore: 91,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'ucb_pinesphere_mou_23.pdf',
          uploadDate: '2023-06-15',
          status: 'Verified',
          verifiedBy: 'Charlie Davis',
          version: 'v1.0',
          previewContent: 'UC Berkeley CS Department educational MoU.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2023-06-20',
          title: 'College Added',
          description: 'UC Berkeley registered in the system.',
          type: 'added',
        ),
      ],
    ),
    OrganizationModel(
      id: 'org-4',
      name: 'California Institute of Technology',
      code: 'CALTECH',
      type: 'Science',
      headcount: 500,
      status: 'Active',
      logo: 'CIT',
      university: 'Caltech Board of Trustees',
      location: 'Pasadena, CA',
      partnershipStatus: 'Pending Verification',
      partnershipSince: '2025-10-24T00:00:00Z',
      website: 'https://caltech.edu',
      email: 'career@caltech.edu',
      phone: '+1 (626) 395-6811',
      address: '1200 E California Blvd, Pasadena, CA 91125',
      naacGrade: 'A++',
      nbaStatus: 'Applied',
      autonomousStatus: 'Autonomous',
      nationalRanking: 2,
      departments: [
        OrganizationDepartment(
          name: 'Physics & Computing',
          hod: 'Dr. Kip Thorne',
          studentsCount: 300,
          facultyCount: 25,
          internshipsCount: 120,
          placementRate: 97,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Applied Mathematics',
          hod: 'Dr. Eric Temple Bell',
          studentsCount: 200,
          facultyCount: 15,
          internshipsCount: 80,
          placementRate: 95,
          status: 'Active',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-5',
          name: 'Richard Feynman',
          email: 'feynman@caltech.edu',
          phone: '+1 (555) 011-5847',
          department: 'Physics & Computing',
          studentsManaged: 300,
          programsManaged: 1,
          status: 'Active',
          applicationsProcessed: 140,
          attendanceApprovals: 220,
          internshipCompletions: 110,
          placementSuccess: 97,
        ),
      ],
      students: [
        OrganizationStudent(
          id: 'STU-4001',
          name: 'Hannah White',
          department: 'Physics & Computing',
          year: 2,
          program: 'Quantum Internship Initiative',
          status: 'Active',
          coordinatorName: 'Richard Feynman',
        ),
      ],
      programs: [
        OrganizationProgram(
          name: 'Quantum Internship Initiative',
          duration: '6 Months',
          enrolledCount: 300,
          status: 'Active',
          coordinatorName: 'Richard Feynman',
          completionRate: 97,
          attendanceRate: 97,
          placementRate: 97,
          satisfactionScore: 4.8,
          performanceScore: 95,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'caltech_draft_mou_2025.pdf',
          uploadDate: '2025-10-20',
          status: 'Pending',
          verifiedBy: 'N/A',
          version: 'v1.0',
          previewContent: 'Draft MoU for Caltech Physics Placement Drive.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2025-10-24',
          title: 'College Added',
          description: 'Caltech registered for quantum internship drives.',
          type: 'added',
        ),
      ],
    ),
    OrganizationModel(
      id: 'org-5',
      name: 'Harvard University',
      code: 'HARV',
      type: 'Management',
      headcount: 850,
      status: 'Inactive',
      logo: 'HU',
      university: 'Harvard Board of Overseers',
      location: 'Cambridge, MA',
      partnershipStatus: 'Partnership Expired',
      partnershipSince: '2020-05-10T00:00:00Z',
      website: 'https://harvard.edu',
      email: 'recruit@harvard.edu',
      phone: '+1 (617) 495-1000',
      address: 'Massachusetts Hall, Cambridge, MA 02138',
      naacGrade: 'A++',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 4,
      departments: [
        OrganizationDepartment(
          name: 'Business Administration (MBA)',
          hod: 'Dr. Nitin Nohria',
          studentsCount: 500,
          facultyCount: 40,
          internshipsCount: 300,
          placementRate: 98,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Public Policy',
          hod: 'Dr. Douglas Elmendorf',
          studentsCount: 350,
          facultyCount: 20,
          internshipsCount: 150,
          placementRate: 92,
          status: 'Inactive',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-6',
          name: 'Michael Porter',
          email: 'porter@harvard.edu',
          phone: '+1 (555) 016-1122',
          department: 'Business Administration',
          studentsManaged: 500,
          programsManaged: 2,
          status: 'Inactive',
          applicationsProcessed: 400,
          attendanceApprovals: 650,
          internshipCompletions: 380,
          placementSuccess: 98,
        ),
      ],
      students: [],
      programs: [
        OrganizationProgram(
          name: 'Harvard Global Leadership Program',
          duration: '3 Months',
          enrolledCount: 500,
          status: 'Completed',
          coordinatorName: 'Michael Porter',
          completionRate: 98,
          attendanceRate: 96,
          placementRate: 98,
          satisfactionScore: 4.7,
          performanceScore: 93,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'harvard_expired_mou.pdf',
          uploadDate: '2020-05-01',
          status: 'Rejected',
          verifiedBy: 'Charlie Davis',
          version: 'v1.0',
          previewContent: 'MoU expired on 2025-05-01. Needs renewal review.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2020-05-10',
          title: 'College Added',
          description: 'Harvard Business School registered in ERP.',
          type: 'added',
        ),
        OrganizationTimelineEvent(
          date: '2025-05-01',
          title: 'Partnership Expired',
          description: 'MoU term expired without automated renewal trigger.',
          type: 'renewal',
        ),
      ],
    ),
    OrganizationModel(
      id: 'org-6',
      name: 'Indian Institute of Technology Madras',
      code: 'IITM',
      type: 'Engineering',
      headcount: 1100,
      status: 'Active',
      logo: 'IITM',
      university: 'IIT Council',
      location: 'Chennai, India',
      partnershipStatus: 'Active',
      partnershipSince: '2024-05-01T00:00:00Z',
      website: 'https://iitm.ac.in',
      email: 'placement@iitm.ac.in',
      phone: '+91 (44) 2257-8000',
      address: 'IIT Madras, Chennai, Tamil Nadu 600036',
      naacGrade: 'A++',
      nbaStatus: 'Accredited',
      autonomousStatus: 'Autonomous',
      nationalRanking: 1,
      departments: [
        OrganizationDepartment(
          name: 'Computer Science (CSE)',
          hod: 'Dr. C. Pandu Rangan',
          studentsCount: 600,
          facultyCount: 40,
          internshipsCount: 310,
          placementRate: 97,
          status: 'Active',
        ),
        OrganizationDepartment(
          name: 'Artificial Intelligence & DS',
          hod: 'Dr. B. Ravindran',
          studentsCount: 500,
          facultyCount: 30,
          internshipsCount: 260,
          placementRate: 98,
          status: 'Active',
        ),
      ],
      coordinators: [
        OrganizationCoordinator(
          id: 'coord-7',
          name: 'Kamalesh Kumar',
          email: 'kamalesh@iitm.ac.in',
          phone: '+91 9444012345',
          department: 'Computer Science',
          studentsManaged: 600,
          programsManaged: 2,
          status: 'Active',
          applicationsProcessed: 410,
          attendanceApprovals: 750,
          internshipCompletions: 340,
          placementSuccess: 97,
        ),
      ],
      students: [],
      programs: [
        OrganizationProgram(
          name: 'IIT Madras AI & ML Cohort',
          duration: '6 Months',
          enrolledCount: 600,
          status: 'Active',
          coordinatorName: 'Kamalesh Kumar',
          completionRate: 96,
          attendanceRate: 98,
          placementRate: 97,
          satisfactionScore: 4.8,
          performanceScore: 92,
        ),
      ],
      documents: [
        OrganizationDocument(
          type: 'MoU',
          name: 'iitm_pinesphere_mou_2024.pdf',
          uploadDate: '2024-04-20',
          status: 'Verified',
          verifiedBy: 'Charlie Davis',
          version: 'v1.0',
          previewContent: 'IIT Madras Institutional Placement MoU for 3 Years.',
        ),
      ],
      timeline: [
        OrganizationTimelineEvent(
          date: '2024-05-01',
          title: 'College Added',
          description: 'IIT Madras mapped into ERP roster.',
          type: 'added',
        ),
      ],
    ),
  ];

  static final List<SystemSettingModel> _settings = [
    SystemSettingModel(id: 'set-1', category: 'General', key: 'Platform Name', value: 'PineSphere ERP'),
    SystemSettingModel(id: 'set-2', category: 'Security', key: 'Max Login Attempts', value: '5'),
    SystemSettingModel(id: 'set-3', category: 'Storage', key: 'Max File Size', value: '50MB'),
    SystemSettingModel(id: 'set-4', category: 'Security', key: 'Session Timeout (min)', value: '30'),
    SystemSettingModel(id: 'set-5', category: 'General', key: 'Support Email', value: 'support@pinesphere.com'),
  ];

  static final List<AuditLogModel> _auditLogs = [
    AuditLogModel(
      id: 'log-1',
      userId: 'emp-1',
      action: 'LOGIN',
      entityType: 'System',
      entityId: 'sys-1',
      timestamp: '2026-06-25T10:00:00Z',
      status: 'Success',
    ),
    AuditLogModel(
      id: 'log-2',
      userId: 'emp-2',
      action: 'CREATE_TASK',
      entityType: 'Task',
      entityId: 'tsk-101',
      timestamp: '2026-06-25T10:15:00Z',
      status: 'Success',
    ),
    AuditLogModel(
      id: 'log-3',
      userId: 'unknown',
      action: 'LOGIN',
      entityType: 'System',
      entityId: 'sys-1',
      timestamp: '2026-06-25T11:00:00Z',
      status: 'Failed',
    ),
    AuditLogModel(
      id: 'log-4',
      userId: 'emp-1',
      action: 'ASSIGN_ROLE',
      entityType: 'User',
      entityId: 'usr-4',
      timestamp: '2026-06-25T12:05:00Z',
      status: 'Success',
    ),
    AuditLogModel(
      id: 'log-5',
      userId: 'emp-2',
      action: 'UPDATE_SETTING',
      entityType: 'Config',
      entityId: 'set-2',
      timestamp: '2026-06-25T12:20:00Z',
      status: 'Success',
    ),
  ];

  static final List<RoleModel> _roles = [
    RoleModel(
      id: 'role-1',
      name: 'Student',
      code: 'ROLE_STUDENT',
      desc: 'Can access LMS, submit tasks and assessments, view attendance and performance.',
      status: 'Active',
      modulesCount: 23,
      usersCount: 245,
      moduleIds: const ['dashboard', 'task', 'assessment', 'attendance', 'performance', 'lms', 'leave', 'wallet', 'notification', 'announcement', 'communication', 'calendar', 'certificate', 'placement', 'alumni', 'analytics', 'reports', 'helpdesk', 'marketplace', 'referral', 'idcard', 'selfservice', 'productivity'],
      permissions: const ['dashboard.view', 'task.view', 'task.submit', 'assessment.view', 'assessment.submit', 'attendance.view', 'performance.view', 'lms.view', 'leave.view', 'leave.create', 'wallet.view', 'notification.view', 'announcement.view', 'communication.view', 'communication.create', 'calendar.view', 'certificate.view', 'placement.view', 'alumni.view', 'analytics.view', 'report.view', 'helpdesk.view', 'helpdesk.create', 'marketplace.view', 'marketplace.apply', 'marketplace.favorite', 'referral.view', 'referral.create', 'idcard.view', 'idcard.download', 'idcard.print', 'selfservice.view', 'productivity.view', 'productivity.manage'],
    ),
    RoleModel(
      id: 'role-2',
      name: 'Mentor',
      code: 'ROLE_MENTOR',
      desc: 'Can view students, mark attendance, review tasks and evaluate assessments.',
      status: 'Active',
      modulesCount: 21,
      usersCount: 34,
      moduleIds: const ['dashboard', 'student', 'attendance', 'task', 'assessment', 'performance', 'leave', 'wallet', 'notification', 'announcement', 'communication', 'calendar', 'certificate', 'placement', 'alumni', 'analytics', 'reports', 'helpdesk', 'idcard', 'selfservice', 'productivity'],
      permissions: const ['dashboard.view', 'student.view', 'attendance.view', 'attendance.mark', 'task.view', 'task.review', 'assessment.view', 'assessment.evaluate', 'performance.view', 'leave.view', 'leave.create', 'wallet.view', 'notification.view', 'announcement.view', 'communication.view', 'communication.create', 'calendar.view', 'certificate.view', 'placement.view', 'alumni.view', 'analytics.view', 'report.view', 'helpdesk.view', 'helpdesk.create', 'idcard.view', 'selfservice.view', 'productivity.view', 'productivity.manage'],
    ),
    RoleModel(
      id: 'role-3',
      name: 'HR',
      code: 'ROLE_HR',
      desc: 'Can manage employees, organizations, programs, applications, students and batches.',
      status: 'Active',
      modulesCount: 38,
      usersCount: 12,
      moduleIds: const ['dashboard', 'employee', 'organization', 'program', 'opportunity', 'application', 'student', 'batch', 'reporting_manager', 'leave', 'activity', 'escalation', 'payment', 'fee', 'billing', 'wallet', 'finance', 'finance_analytics', 'notification', 'announcement', 'communication', 'calendar', 'email', 'certificate', 'document', 'placement', 'alumni', 'analytics', 'reports', 'kpi', 'export', 'insights', 'helpdesk', 'marketplace', 'referral', 'idcard', 'selfservice', 'productivity'],
      permissions: const ['dashboard.view', 'employee.view', 'employee.create', 'employee.edit', 'organization.view', 'organization.create', 'organization.edit', 'program.view', 'program.create', 'program.edit', 'application.view', 'application.review', 'student.view', 'student.create', 'student.edit', 'batch.view', 'batch.create', 'batch.edit', 'reporting_manager.view', 'reporting_manager.create', 'reporting_manager.edit', 'reporting_manager.assign', 'leave.view', 'leave.create', 'leave.edit', 'leave.delete', 'leave.approve', 'leave.reject', 'leave.export', 'activity.view', 'escalation.view', 'escalation.edit', 'payment.view', 'fee.view', 'billing.view', 'wallet.view', 'finance.view', 'analytics.finance.view', 'notification.view', 'notification.create', 'notification.edit', 'notification.delete', 'notification.send', 'notification.schedule', 'notification.template', 'notification.export', 'announcement.view', 'announcement.create', 'announcement.edit', 'announcement.delete', 'communication.view', 'communication.create', 'communication.edit', 'communication.delete', 'calendar.view', 'calendar.create', 'calendar.edit', 'calendar.delete', 'calendar.approve', 'calendar.export', 'email.view', 'email.create', 'email.edit', 'email.delete', 'certificate.view', 'certificate.create', 'certificate.edit', 'certificate.generate', 'certificate.approve', 'certificate.issue', 'certificate.revoke', 'certificate.export', 'document.view', 'document.create', 'document.edit', 'document.generate', 'document.export', 'placement.view', 'placement.create', 'placement.edit', 'placement.approve', 'placement.export', 'alumni.view', 'alumni.create', 'alumni.edit', 'alumni.export', 'analytics.view', 'analytics.export', 'analytics.configure', 'analytics.dashboard', 'report.view', 'report.export', 'report.schedule', 'report.share', 'kpi.view', 'export.view', 'insights.view', 'helpdesk.view', 'helpdesk.create', 'helpdesk.edit', 'helpdesk.assign', 'helpdesk.resolve', 'helpdesk.close', 'helpdesk.export', 'marketplace.view', 'marketplace.apply', 'marketplace.favorite', 'marketplace.publish', 'marketplace.manage', 'referral.view', 'referral.create', 'referral.approve', 'referral.export', 'idcard.view', 'idcard.generate', 'idcard.download', 'idcard.print', 'selfservice.view', 'productivity.view', 'productivity.manage'],
    ),
    RoleModel(
      id: 'role-4',
      name: 'College Coordinator',
      code: 'ROLE_CC',
      desc: 'Can track student progress and view reports.',
      status: 'Active',
      modulesCount: 16,
      usersCount: 28,
      moduleIds: const ['dashboard', 'college_coordinator', 'student', 'attendance', 'performance', 'leave', 'wallet', 'notification', 'announcement', 'communication', 'calendar', 'certificate', 'placement', 'alumni', 'analytics', 'reports'],
      permissions: const ['dashboard.view', 'college_coordinator.view', 'student.view', 'attendance.view', 'performance.view', 'leave.view', 'leave.approve', 'leave.reject', 'wallet.view', 'notification.view', 'announcement.view', 'communication.view', 'communication.create', 'calendar.view', 'certificate.view', 'placement.view', 'alumni.view', 'analytics.view', 'report.view'],
    ),
    RoleModel(
      id: 'role-5',
      name: 'Super Admin',
      code: 'ROLE_ADMIN',
      desc: 'Full system access. All modules, all permissions, no restrictions.',
      status: 'Active',
      modulesCount: 52,
      usersCount: 3,
      moduleIds: const ['identity', 'employee', 'organization', 'program', 'opportunity', 'application', 'student', 'batch', 'allocation', 'mentor', 'lms', 'task', 'assessment', 'submission', 'attendance', 'performance', 'college_coordinator', 'dashboard', 'common_file', 'super_admin', 'reporting_manager', 'leave', 'activity', 'escalation', 'payment', 'fee', 'billing', 'wallet', 'finance', 'finance_analytics', 'notification', 'announcement', 'communication', 'calendar', 'email', 'certificate', 'document', 'placement', 'alumni', 'analytics', 'reports', 'kpi', 'executive', 'export', 'insights', 'helpdesk', 'marketplace', 'referral', 'idcard', 'selfservice', 'productivity'],
      permissions: const ['all'],
    ),
    RoleModel(
      id: 'role-6',
      name: 'Reporting Manager',
      code: 'ROLE_MANAGER',
      desc: 'Can manage assigned interns, approve leaves, review assignments and performance.',
      status: 'Active',
      modulesCount: 17,
      usersCount: 20,
      moduleIds: const ['dashboard', 'reporting_manager', 'leave', 'attendance', 'task', 'assessment', 'performance', 'wallet', 'notification', 'announcement', 'communication', 'calendar', 'certificate', 'placement', 'alumni', 'analytics', 'reports'],
      permissions: const ['dashboard.view', 'reporting_manager.view', 'reporting_manager.review', 'reporting_manager.approve', 'leave.view', 'leave.approve', 'leave.reject', 'attendance.view', 'task.view', 'task.review', 'assessment.view', 'assessment.evaluate', 'performance.view', 'wallet.view', 'notification.view', 'announcement.view', 'communication.view', 'communication.create', 'calendar.view', 'certificate.view', 'placement.view', 'alumni.view', 'analytics.view', 'report.view'],
    ),
    RoleModel(
      id: 'role-7',
      name: 'Finance Manager',
      code: 'ROLE_FINANCE',
      desc: 'Can manage all financial operations, payments, fees, and revenue analytics.',
      status: 'Active',
      modulesCount: 14,
      usersCount: 5,
      moduleIds: const ['dashboard', 'payment', 'fee', 'billing', 'wallet', 'finance', 'finance_analytics', 'notification', 'announcement', 'communication', 'calendar', 'analytics', 'reports', 'kpi'],
      permissions: const ['dashboard.view', 'payment.view', 'payment.create', 'payment.edit', 'payment.delete', 'payment.verify', 'payment.refund', 'payment.export', 'fee.view', 'fee.create', 'fee.edit', 'fee.delete', 'billing.view', 'billing.create', 'billing.edit', 'billing.delete', 'billing.export', 'wallet.view', 'wallet.create', 'wallet.edit', 'wallet.delete', 'finance.view', 'analytics.finance.view', 'notification.view', 'announcement.view', 'communication.view', 'communication.create', 'calendar.view', 'analytics.view', 'report.view', 'kpi.view'],
    ),
  ];

  static final List<SystemPermissionModel> _permissions = [
    SystemPermissionModel(id: 'identity.view', module: 'identity', label: 'View Identity'),
    SystemPermissionModel(id: 'identity.manage_users', module: 'identity', label: 'Manage Users'),
    SystemPermissionModel(id: 'identity.manage_roles', module: 'identity', label: 'Manage Roles'),
    SystemPermissionModel(id: 'employee.view', module: 'employee', label: 'View Employees'),
    SystemPermissionModel(id: 'employee.create', module: 'employee', label: 'Create Employee'),
    SystemPermissionModel(id: 'employee.edit', module: 'employee', label: 'Edit Employee'),
    SystemPermissionModel(id: 'organization.view', module: 'organization', label: 'View Organizations'),
    SystemPermissionModel(id: 'organization.create', module: 'organization', label: 'Create Organization'),
    SystemPermissionModel(id: 'program.view', module: 'program', label: 'View Programs'),
    SystemPermissionModel(id: 'program.create', module: 'program', label: 'Create Program'),
    SystemPermissionModel(id: 'mentor.view', module: 'mentor', label: 'View Mentors'),
    SystemPermissionModel(id: 'mentor.assign', module: 'mentor', label: 'Assign Mentors'),
    SystemPermissionModel(id: 'task.view', module: 'task', label: 'View Tasks'),
    SystemPermissionModel(id: 'task.submit', module: 'task', label: 'Submit Tasks'),
  ];

  // ── API Methods ─────────────────────────────────────────────────────────────

  Future<List<OrganizationModel>> getOrganizations() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_organizations);
  }

  Future<List<RoleModel>> getRoles() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_roles);
  }

  Future<RoleModel> createRole(Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final newRole = RoleModel(
      id: 'role-${_roles.length + 1}',
      name: data['name'] as String,
      code: data['code'] as String,
      desc: data['desc'] as String? ?? '',
      status: data['status'] as String? ?? 'Active',
      modulesCount: (data['moduleIds'] as List?)?.length ?? 0,
      usersCount: 0,
      moduleIds: List<String>.from(data['moduleIds'] as List? ?? []),
      permissions: List<String>.from(data['permissions'] as List? ?? []),
    );
    _roles.add(newRole);
    return newRole;
  }

  Future<void> updateRole(String id, Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final index = _roles.indexWhere((r) => r.id == id);
    if (index != -1) {
      final existing = _roles[index];
      _roles[index] = existing.copyWith(
        name: data['name'] as String?,
        code: data['code'] as String?,
        desc: data['desc'] as String?,
        status: data['status'] as String?,
        moduleIds: data['moduleIds'] != null ? List<String>.from(data['moduleIds'] as List) : null,
        permissions: data['permissions'] != null ? List<String>.from(data['permissions'] as List) : null,
        modulesCount: data['moduleIds'] != null ? (data['moduleIds'] as List).length : null,
      );
    }
  }

  Future<void> deleteRole(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    _roles.removeWhere((r) => r.id == id);
  }

  Future<OrganizationModel> createOrganization(Map<String, dynamic> data) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final newOrg = OrganizationModel(
      id: 'org-${_organizations.length + 1}',
      name: data['name'] as String,
      code: data['code'] as String,
      type: data['type'] as String? ?? 'Engineering',
      headcount: data['headcount'] as int? ?? 0,
      status: 'Active',
      logo: data['code'] as String? ?? 'ORG',
      university: data['university'] as String? ?? 'Technical University',
      location: data['location'] as String? ?? 'City, State',
      partnershipStatus: 'Active',
      partnershipSince: DateTime.now().toUtc().toIso8601String(),
      website: data['website'] as String? ?? '',
      email: data['email'] as String? ?? '',
      phone: data['phone'] as String? ?? '',
      address: data['address'] as String? ?? '',
      naacGrade: data['naacGrade'] as String? ?? 'A+',
      nbaStatus: data['nbaStatus'] as String? ?? 'Accredited',
      autonomousStatus: data['autonomousStatus'] as String? ?? 'Autonomous',
      nationalRanking: data['nationalRanking'] as int? ?? 50,
      departments: [],
      coordinators: [],
      students: [],
      programs: [],
      documents: [],
      timeline: [
        OrganizationTimelineEvent(
          date: DateTime.now().toIso8601String().split('T')[0],
          title: 'College Added',
          description: 'Institution registered as partner.',
          type: 'added',
        ),
      ],
    );
    _organizations.add(newOrg);
    return newOrg;
  }

  Future<OrganizationModel?> updateOrganization(
      String id, Map<String, dynamic> updates) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final idx = _organizations.indexWhere((o) => o.id == id);
    if (idx == -1) return null;

    final existing = _organizations[idx];
    
    // Convert departments if updated
    List<OrganizationDepartment>? depts;
    if (updates['departments'] != null) {
      depts = (updates['departments'] as List)
          .map((d) => d as OrganizationDepartment)
          .toList();
    }
    
    // Convert coordinators if updated
    List<OrganizationCoordinator>? coords;
    if (updates['coordinators'] != null) {
      coords = (updates['coordinators'] as List)
          .map((c) => c as OrganizationCoordinator)
          .toList();
    }

    // Convert timeline if updated
    List<OrganizationTimelineEvent>? timelineEvents;
    if (updates['timeline'] != null) {
      timelineEvents = (updates['timeline'] as List)
          .map((t) => t as OrganizationTimelineEvent)
          .toList();
    }

    final updated = existing.copyWith(
      name: updates['name'] as String?,
      code: updates['code'] as String?,
      type: updates['type'] as String?,
      partnershipStatus: updates['partnershipStatus'] as String?,
      status: updates['status'] as String?,
      location: updates['location'] as String?,
      university: updates['university'] as String?,
      website: updates['website'] as String?,
      email: updates['email'] as String?,
      phone: updates['phone'] as String?,
      address: updates['address'] as String?,
      naacGrade: updates['naacGrade'] as String?,
      nbaStatus: updates['nbaStatus'] as String?,
      autonomousStatus: updates['autonomousStatus'] as String?,
      nationalRanking: updates['nationalRanking'] as int?,
      departments: depts,
      coordinators: coords,
      timeline: timelineEvents,
    );
    _organizations[idx] = updated;
    return updated;
  }

  Future<List<SystemSettingModel>> getSettings() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return List.from(_settings);
  }

  Future<SystemSettingModel?> updateSetting(String id, String value) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final idx = _settings.indexWhere((s) => s.id == id);
    if (idx == -1) return null;
    final updated = _settings[idx].copyWith(value: value);
    _settings[idx] = updated;
    return updated;
  }

  Future<List<AuditLogModel>> getAuditLogs() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return List.from(_auditLogs);
  }

  Future<List<SystemPermissionModel>> getPermissions() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return List.from(_permissions);
  }
}

// ── Providers ─────────────────────────────────────────────────────────────────

final adminServiceProvider = Provider<AdminService>((ref) {
  return AdminService();
});

class AdminOrganizationsNotifier
    extends StateNotifier<AsyncValue<List<OrganizationModel>>> {
  final AdminService _service;
  AdminOrganizationsNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getOrganizations();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> create(Map<String, dynamic> data) async {
    try {
      await _service.createOrganization(data);
      load();
    } catch (e) {
      // handle error
    }
  }

  Future<void> updateStatus(String id, String partnershipStatus) async {
    try {
      await _service.updateOrganization(id, {'partnershipStatus': partnershipStatus});
      load();
    } catch (e) {
      // handle error
    }
  }

  Future<void> updateOrganizationDetails(String id, Map<String, dynamic> updates) async {
    try {
      await _service.updateOrganization(id, updates);
      load();
    } catch (e) {
      // handle error
    }
  }
}

final adminOrganizationsProvider = StateNotifierProvider.autoDispose<
    AdminOrganizationsNotifier, AsyncValue<List<OrganizationModel>>>((ref) {
  return AdminOrganizationsNotifier(ref.watch(adminServiceProvider));
});

class AdminSettingsNotifier
    extends StateNotifier<AsyncValue<List<SystemSettingModel>>> {
  final AdminService _service;
  AdminSettingsNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getSettings();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> update(String id, String value) async {
    try {
      await _service.updateSetting(id, value);
      load();
    } catch (e) {
      // handle error
    }
  }
}

final adminSettingsProvider = StateNotifierProvider.autoDispose<
    AdminSettingsNotifier, AsyncValue<List<SystemSettingModel>>>((ref) {
  return AdminSettingsNotifier(ref.watch(adminServiceProvider));
});

final adminAuditLogsProvider =
    FutureProvider.autoDispose<List<AuditLogModel>>((ref) async {
  return ref.watch(adminServiceProvider).getAuditLogs();
});

final adminPermissionsProvider =
    FutureProvider.autoDispose<List<SystemPermissionModel>>((ref) async {
  return ref.watch(adminServiceProvider).getPermissions();
});

class AdminRolesNotifier extends StateNotifier<AsyncValue<List<RoleModel>>> {
  final AdminService _service;
  AdminRolesNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final list = await _service.getRoles();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addRole(Map<String, dynamic> data) async {
    try {
      await _service.createRole(data);
      load();
    } catch (e) {
      // handle error
    }
  }

  Future<void> editRole(String id, Map<String, dynamic> data) async {
    try {
      await _service.updateRole(id, data);
      load();
    } catch (e) {
      // handle error
    }
  }

  Future<void> deleteRole(String id) async {
    try {
      await _service.deleteRole(id);
      load();
    } catch (e) {
      // handle error
    }
  }
}

final adminRolesProvider = StateNotifierProvider.autoDispose<
    AdminRolesNotifier, AsyncValue<List<RoleModel>>>((ref) {
  return AdminRolesNotifier(ref.watch(adminServiceProvider));
});

final adminScaffoldKeyProvider = Provider<GlobalKey<ScaffoldState>>((ref) {
  return GlobalKey<ScaffoldState>();
});
