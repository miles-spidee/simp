import { ResourceType, LearningResource, LearningModule } from '../types/api/lms.types';

export const MOCK_LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    programId: 'prog-1',
    title: 'Advanced React Patterns & Performance',
    category: 'Frontend UI',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    progress: 100,
    resources: [
      {
        id: 'res-1',
        moduleId: 'mod-1',
        title: 'Component Lifecycle and Hooks Deep Dive',
        resource_type: 'Video',
        file_id: 'file-2', // From common files
        duration: '45 mins',
        completed: true
      },
      {
        id: 'res-2',
        moduleId: 'mod-1',
        title: 'Memoization Strategies Guide',
        resource_type: 'PDF',
        file_id: 'file-1', // From common files
        completed: true
      }
    ]
  },
  {
    id: 'mod-2',
    programId: 'prog-1',
    title: 'Node.js Microservices Architecture',
    category: 'Backend Dev',
    image: 'https://images.unsplash.com/photo-1627398246734-d8db53e34376?w=800&auto=format&fit=crop&q=60',
    progress: 35,
    resources: [
      {
        id: 'res-3',
        moduleId: 'mod-2',
        title: 'Event-Driven Communication PPT',
        resource_type: 'PPT',
        external_url: 'https://example.com/ppt',
        completed: true
      },
      {
        id: 'res-4',
        moduleId: 'mod-2',
        title: 'API Gateway Implementation Code',
        resource_type: 'ZIP',
        file_id: 'file-3',
        completed: false
      }
    ]
  }
];
