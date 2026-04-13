export interface NoteFrontmatter {
  title: string;
  date: string;
  day: number;
  week: number;
  tags: string[];
  focus: FocusTag;
  duration_hours: number;
  cs336_topic: string;
}

export interface Note {
  slug: string;
  frontmatter: NoteFrontmatter;
  content: string;
}

export type FocusTag = 
  | 'lecture-notes' 
  | 'review-assignment' 
  | 'setup-environment' 
  | 'code-prototype' 
  | 'study-prerequisite' 
  | 'optimize-impl';

export interface SiteConfig {
  site_title: string;
  about_line_1: string;
  about_line_2: string;
  start_date: string;
  total_days: number;
  expected_note_count: number;
  github_repo_url: string;
  cs336_course_url: string;
  week_labels: Record<string, string>;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  dailyStatus: { date: string; hasNote: boolean; isFuture: boolean }[];
}

export interface SiteData {
  config: SiteConfig;
  notes: Note[];
  streak: StreakData;
  stats: {
    totalNotes: number;
    totalHours: number;
    percentComplete: number;
    currentDay: number;
  };
}