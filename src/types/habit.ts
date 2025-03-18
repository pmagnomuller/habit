export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  createdAt: Date;
  completedDates: Date[];
  reminderTime?: Date;
}

export interface HabitCompletion {
  habitId: string;
  date: Date;
  completed: boolean;
} 