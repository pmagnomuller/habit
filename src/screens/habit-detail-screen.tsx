import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Habit } from '../types/habit';
import { HabitService } from '../services/habit-service';
import { format, isSameDay } from 'date-fns';

type HabitDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HabitDetail'>;
  route: RouteProp<RootStackParamList, 'HabitDetail'>;
};

export default function HabitDetailScreen({
  navigation,
  route,
}: HabitDetailScreenProps) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const habitService = HabitService.getInstance();

  useEffect(() => {
    loadHabit();
  }, []);

  const loadHabit = async () => {
    try {
      const habits = await habitService.getHabits();
      const foundHabit = habits.find((h) => h.id === route.params.habitId);
      if (foundHabit) {
        setHabit(foundHabit);
      } else {
        Alert.alert('Error', 'Habit not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading habit:', error);
      Alert.alert('Error', 'Failed to load habit');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompletion = async () => {
    if (!habit) return;

    const today = new Date();
    const isCompletedToday = habit.completedDates.some((date) =>
      isSameDay(new Date(date), today)
    );

    const updatedHabit: Habit = {
      ...habit,
      completedDates: isCompletedToday
        ? habit.completedDates.filter(
            (date) => !isSameDay(new Date(date), today)
          )
        : [...habit.completedDates, today],
    };

    try {
      await habitService.saveHabit(updatedHabit);
      setHabit(updatedHabit);
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDelete = async () => {
    if (!habit) return;

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await habitService.deleteHabit(habit.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting habit:', error);
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!habit) {
    return null;
  }

  const isCompletedToday = habit.completedDates.some((date) =>
    isSameDay(new Date(date), new Date())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.description}>{habit.description}</Text>
        <Text style={styles.frequency}>Frequency: {habit.frequency}</Text>
        <Text style={styles.created}>
          Created: {format(habit.createdAt, 'MMM d, yyyy')}
        </Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <Text style={styles.statsText}>
            Total Completions: {habit.completedDates.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompletedToday && styles.completeButtonActive,
          ]}
          onPress={handleToggleCompletion}
        >
          <Text
            style={[
              styles.completeButtonText,
              isCompletedToday && styles.completeButtonTextActive,
            ]}
          >
            {isCompletedToday ? 'Completed Today' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  frequency: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  created: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  completeButtonActive: {
    backgroundColor: '#f4511e',
  },
  completeButtonText: {
    color: '#f4511e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButtonTextActive: {
    color: '#ffffff',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 