export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface StickyNote {
  id: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'pink';
  createdAt: string;
}

export interface PersonalTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface ProductivityWorkspace {
  bookmarks: Bookmark[];
  notes: StickyNote[];
  tasks: PersonalTask[];
}
