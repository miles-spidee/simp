const stu = {"student_id":"a12873eb-5b51-48ce-98cc-bcc35e351738","application_id":"app-1","program_id":"05f829ae-ed39-4464-a4e9-4c5bf6119a5d","intern_id":"INT-A128","student_status":"ACTIVE","joined_at":"2026-07-04","completed_at":"","created_at":"2026-07-04T10:44:02.289805+00:00","updated_at":"2026-07-04T10:44:02.289805+00:00","email":"student-16@pinesphere.example.com_deleted_old","phone":"+91-900000121","enrollment_number":"ENR2026016","college_id":"","college_name":"Pinesphere School of Commerce","personal_info":{"name":"student-16_deleted_old","email":"student-16@pinesphere.example.com_deleted_old","phone":"+91-900000121","dob":"2000-01-01","gender":"Male","address":"","avatar":"S"},"academic_info":{"college":"Pinesphere School of Commerce","department":"ECE2","degree":"B.Tech","year":4,"cgpa":8.0,"graduationYear":2024},"internship_info":{"program":"Summer Internship","internshipType":"Free Internship","batchName":"Batch 2033","mentorId":"","mentorName":"Unassigned","joiningDate":"2026-07-04","expectedCompletion":"2026-12-31"},"documents":[],"credentials":{"username":"student-16@pinesphere.example.com_deleted_old","portalAccess":true,"lmsAccess":true,"assessmentAccess":true},"batch":{"id":"82ed49f9-20ad-4857-9c40-3fb13025d76b","name":"Batch 2033","startDate":"2026-12-28","status":"Active"},"mentor":{"id":"","name":"Unassigned","department":"CSE","expertise":"Python","sessionsConducted":5,"rating":4.8,"feedbackGiven":[]},"performance":{"attendanceScore":90.0,"assessmentScore":82.5,"projectScore":85,"mentorRating":4.5,"overallPerformance":85.8,"attendanceTrend":[{"date":"2026-06-01","score":90}],"assessmentTrend":[{"test":"Test 1","score":85}],"skills":[{"name":"Python","value":90}],"pendingTasks":1,"lmsInactiveDays":2},"placement":{"status":"Eligible","company":"","package":""},"timeline":[{"date":"2026-07-04","title":"Student Enrolled","description":"Profile registered in SLMS","type":"registration"}]};

function mapToExtended(stu) {
    const personalInfo = stu.personal_info || {
      name: stu.name || `Student ${stu.student_id.substring(0, 4)}`,
      email: stu.email || 'student@example.com',
      phone: stu.phone || '',
      dob: stu.dob || '',
      gender: stu.gender || 'Male',
      address: stu.address || '',
      avatar: ''
    };

    const academicInfo = stu.academic_info || {
      college: '',
      department: stu.department || 'CSE',
      degree: 'B.Tech',
      year: stu.year || 4,
      cgpa: stu.cgpa || 8.0,
      graduationYear: stu.graduation_year || 2024
    };

    const internshipInfo = stu.internship_info || {
      program: stu.program || '',
      internshipType: stu.internship_type || 'Free Internship',
      batchName: stu.batch_name || '',
      mentorId: stu.mentor_id || '',
      mentorName: stu.mentor_name || '',
      joiningDate: stu.joined_at || '',
      expectedCompletion: stu.completed_at || ''
    };

    return {
      ...stu,
      id: stu.student_id,
      userId: stu.user_id || 'USR-000',
      internId: stu.intern_id || `INT-${stu.student_id.substring(0, 4)}`,
      enrollmentDate: stu.created_at || new Date().toISOString(),
      status: (stu.student_status || 'Applied'),
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      official_email: personalInfo.email,
      designation: 'Student',
      college_id: stu.college_id || '',
      college_name: stu.college_name || stu.academic_info?.college || '',

      personalInfo: {
        ...personalInfo,
        avatar: personalInfo.avatar || personalInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase()
      },
      academicInfo,
      internshipInfo,

      documents: stu.documents || [],
      credentials: stu.credentials || {
        username: personalInfo.email,
        password: '',
        portalAccess: true,
        lmsAccess: true,
        assessmentAccess: true
      },
      batch: stu.batch || {
        id: stu.batch_id || '',
        name: internshipInfo.batchName || 'Unassigned',
        startDate: internshipInfo.joiningDate || '',
        status: 'Active'
      },
      mentor: stu.mentor || {
        id: internshipInfo.mentorId || '',
        name: internshipInfo.mentorName || 'Unassigned',
        department: 'CSE',
        expertise: 'Python',
        sessionsConducted: 5,
        rating: 4.8,
        feedbackGiven: []
      },
      performance: stu.performance || {
        attendanceScore: 90,
        assessmentScore: 82.5,
        projectScore: 85,
        mentorRating: 4.5,
        overallPerformance: 85.8,
        attendanceTrend: [],
        assessmentTrend: [],
        skills: [],
        pendingTasks: 0,
        lmsInactiveDays: 0
      },
      placement: stu.placement || {
        status: 'Eligible'
      },
      timeline: stu.timeline || []
    };
}

console.log(mapToExtended(stu));
