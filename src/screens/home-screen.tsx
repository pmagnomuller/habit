import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit } from '../types/habit';
import { HabitService } from '../services/habit-service';
import { format } from 'date-fns';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const habitService = HabitService.getInstance();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const loadedHabits = await habitService.getHabits();
      setHabits(loadedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity
      style={styles.habitItem}
      onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
    >
      <View style={styles.habitContent}>
        <Text style={styles.habitName}>{item.name}</Text>
        <Text style={styles.habitDescription}>{item.description}</Text>
        <Text style={styles.habitFrequency}>
          Frequency: {item.frequency}
        </Text>
        <Text style={styles.habitCreated}>
          Created: {format(item.createdAt, 'MMM d, yyyy')}
        </Text>
      </View>
      <View style={styles.completionIndicator}>
        <Text style={styles.completionCount}>
          {item.completedDates.length} completions
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddHabit')}
      >
        <Text style={styles.addButtonText}>Add New Habit</Text>
      </TouchableOpacity>
    </View>
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
  listContainer: {
    padding: 16,
  },
  habitItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  habitFrequency: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  habitCreated: {
    fontSize: 12,
    color: '#888',
  },
  completionIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  completionCount: {
    fontSize: 12,
    color: '#f4511e',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 