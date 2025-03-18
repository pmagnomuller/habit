import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion } from '../types/habit';

const HABITS_STORAGE_KEY = '@habits';
const COMPLETIONS_STORAGE_KEY = '@habit_completions';

export class HabitService {
  private static instance: HabitService;

  private constructor() {}

  public static getInstance(): HabitService {
    if (!HabitService.instance) {
      HabitService.instance = new HabitService();
    }
    return HabitService.instance;
  }

  public async getHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      if (!habitsJson) return [];
      
      const habits: Habit[] = JSON.parse(habitsJson);
      return habits.map(habit => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        completedDates: habit.completedDates.map(date => new Date(date)),
        reminderTime: habit.reminderTime ? new Date(habit.reminderTime) : undefined
      }));
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  }

  public async saveHabit(habit: Habit): Promise<void> {
    try {
      const habits = await this.getHabits();
      const existingIndex = habits.findIndex(h => h.id === habit.id);
      
      if (existingIndex >= 0) {
        habits[existingIndex] = habit;
      } else {
        habits.push(habit);
      }
      
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habit:', error);
      throw error;
    }
  }

  public async deleteHabit(habitId: string): Promise<void> {
    try {
      const habits = await this.getHabits();
      const filteredHabits = habits.filter(h => h.id !== habitId);
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(filteredHabits));
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }

  public async getCompletions(date: Date): Promise<HabitCompletion[]> {
    try {
      const completionsJson = await AsyncStorage.getItem(COMPLETIONS_STORAGE_KEY);
      if (!completionsJson) return [];
      
      const completions: HabitCompletion[] = JSON.parse(completionsJson);
      return completions
        .filter(c => new Date(c.date).toDateString() === date.toDateString())
        .map(c => ({
          ...c,
          date: new Date(c.date)
        }));
    } catch (error) {
      console.error('Error getting completions:', error);
      return [];
    }
  }

  public async saveCompletion(completion: HabitCompletion): Promise<void> {
    try {
      const completions = await this.getCompletions(completion.date);
      const existingIndex = completions.findIndex(
        c => c.habitId === completion.habitId
      );
      
      if (existingIndex >= 0) {
        completions[existingIndex] = completion;
      } else {
        completions.push(completion);
      }
      
      const allCompletionsJson = await AsyncStorage.getItem(COMPLETIONS_STORAGE_KEY);
      const allCompletions: HabitCompletion[] = allCompletionsJson 
        ? JSON.parse(allCompletionsJson)
        : [];
      
      const otherCompletions = allCompletions.filter(
        c => new Date(c.date).toDateString() !== completion.date.toDateString()
      );
      
      await AsyncStorage.setItem(
        COMPLETIONS_STORAGE_KEY,
        JSON.stringify([...otherCompletions, ...completions])
      );
    } catch (error) {
      console.error('Error saving completion:', error);
      throw error;
    }
  }
} 