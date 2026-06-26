export type ApplicationState = 
  | 'Applied' 
  | 'Screening' 
  | 'Interview' 
  | 'Selected' 
  | 'Offer' 
  | 'Joined' 
  | 'Learning' 
  | 'Assessment' 
  | 'Completed' 
  | 'Certified' 
  | 'Placed'
  | 'Rejected'
  | 'Hold';

export type StudentState = 
  | 'Active' 
  | 'Training' 
  | 'Assessment' 
  | 'Completed' 
  | 'Archived';

export class WorkflowEngine {
  // Define valid transitions for Application
  private static applicationTransitions: Record<ApplicationState, ApplicationState[]> = {
    'Applied': ['Screening', 'Rejected'],
    'Screening': ['Interview', 'Rejected', 'Hold'],
    'Interview': ['Selected', 'Rejected', 'Hold'],
    'Selected': ['Offer', 'Rejected'],
    'Offer': ['Joined', 'Rejected'],
    'Joined': ['Learning'],
    'Learning': ['Assessment'],
    'Assessment': ['Completed'],
    'Completed': ['Certified'],
    'Certified': ['Placed'],
    'Placed': [],
    'Rejected': [],
    'Hold': ['Screening', 'Interview', 'Rejected'],
  };

  // Define valid transitions for Student
  private static studentTransitions: Record<StudentState, StudentState[]> = {
    'Active': ['Training', 'Archived'],
    'Training': ['Assessment', 'Archived'],
    'Assessment': ['Completed', 'Archived'],
    'Completed': ['Archived'],
    'Archived': ['Active'],
  };

  /**
   * Returns the valid next states for an Application.
   */
  static getNextApplicationStates(currentState: ApplicationState): ApplicationState[] {
    return this.applicationTransitions[currentState] || [];
  }

  /**
   * Returns the valid next states for a Student.
   */
  static getNextStudentStates(currentState: StudentState): StudentState[] {
    return this.studentTransitions[currentState] || [];
  }

  /**
   * Validates if a transition is allowed.
   */
  static canTransitionApplication(from: ApplicationState, to: ApplicationState): boolean {
    const validStates = this.getNextApplicationStates(from);
    return validStates.includes(to);
  }

  static canTransitionStudent(from: StudentState, to: StudentState): boolean {
    const validStates = this.getNextStudentStates(from);
    return validStates.includes(to);
  }
}
