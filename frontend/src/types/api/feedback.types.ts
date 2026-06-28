export type FeedbackType = 'StudentMentor' | 'StudentCourse' | 'StudentInfrastructure' | 'StudentExperience' | 'MentorStudent' | 'CollegeInternship';

export interface FeedbackBase {
  id: string;
  type: FeedbackType;
  providerId: string;
  providerRole: 'Student' | 'Mentor' | 'College';
  targetId: string;
  date: string;
  rating: number; // 1-5 scale
  comments: string;
}

export interface StudentMentorFeedback extends FeedbackBase {
  type: 'StudentMentor';
}

export interface MentorStudentFeedback extends FeedbackBase {
  type: 'MentorStudent';
  technicalSkillsRating: number;
  communicationRating: number;
  teamworkRating: number;
  disciplineRating: number;
}

export interface CollegeFeedback extends FeedbackBase {
  type: 'CollegeInternship';
  studentSatisfactionRating: number;
  futureCollaborationInterest: boolean;
}

export type Feedback = StudentMentorFeedback | MentorStudentFeedback | CollegeFeedback;

export interface FeedbackCreate {
  type: FeedbackType;
  targetId: string;
  rating: number;
  comments: string;
  [key: string]: any;
}
