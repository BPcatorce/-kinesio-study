export type FlashCard = {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
};

export type VideoLink = {
  id: string;
  title: string;
  url: string;
  notes?: string;
};

export type FileAttachment = {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  size: number;
  uploadedAt: string;
};

export type QuickNote = {
  id: string;
  content: string;
  createdAt: string;
  color: 'blue' | 'teal' | 'amber' | 'red';
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type Subtopic = {
  id: string;
  name: string;
  summary: string;
  videos: VideoLink[];
  files: FileAttachment[];
  notes: QuickNote[];
  flashcards: FlashCard[];
  chatHistory: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  subtopics: Subtopic[];
  createdAt: string;
};

export type StudyStore = {
  categories: Category[];
};
