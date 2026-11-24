export interface CourseChecklistItem {
  id: string;
  label: string;
  hint?: string;
}

export interface CourseDay {
  dayNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  readTimeMinutes: number;
  summary: string;
  heroQuote: string;
  heroQuoteAuthor: string;
  neuroscience: {
    title: string;
    content: string;
  };
  trap: {
    title: string;
    content: string;
  };
  action: {
    title: string;
    steps: string[];
  };
  checklist: CourseChecklistItem[];
  reflectionQuestion: string;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  targetAudience: string;
  commitment: string;
  totalDays: number;
  days: CourseDay[];
}
