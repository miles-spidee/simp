export type ResourceType = 'PDF' | 'Video' | 'PPT' | 'ZIP' | 'External Link';

export interface LearningResource {
  id: string;
  moduleId: string;
  title: string;
  resource_type: ResourceType;
  file_id?: string;
  external_url?: string;
  duration?: string; // Optional duration for video
  completed: boolean;
}

export interface LearningModule {
  id: string;
  programId: string;
  title: string;
  category: string;
  image: string;
  progress: number;
  resources: LearningResource[];
}
