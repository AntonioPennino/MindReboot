export interface SobrietyData {
  startDate: string | null; // ISO date string
  relapses: string[]; // Array of ISO date strings, each being YYYY-MM-DD
}

export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  isoDate: string; // YYYY-MM-DD for easier filtering by day
  content: string;
  mood?: string;
  triggers?: string[];
}

export interface Goal {
  id: string;
  text: string;
  type: 'weekly' | 'monthly';
  createdAt: string; // ISO date string
  completed: boolean;
  completedAt?: string | null; // ISO date string
}

export interface AppSettings {
  notificationsEnabled: boolean;
  enableHourlyReminders: boolean;
  wakeTime: string; // e.g., "07:00"
  sleepTime: string; // e.g., "23:00"
  motivationalMessagesEnabled: boolean;
  customMotivationalMessages: string[];
}

export interface AlternativeActivity {
  id: string;
  name: string;
  description?: string;
}
