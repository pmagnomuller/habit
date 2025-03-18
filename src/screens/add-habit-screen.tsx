import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Habit, HabitFrequency } from '../types/habit';
import { HabitService } from '../services/habit-service';
import { v4 as uuidv4 } from 'uuid';

type AddHabitScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddHabit'>;
};

export default function AddHabitScreen({ navigation }: AddHabitScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const habitService = HabitService.getInstance();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const newHabit: Habit = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      frequency,
      createdAt: new Date(),
      completedDates: [],
    };

    try {
      await habitService.saveHabit(newHabit);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving habit:', error);
      Alert.alert('Error', 'Failed to save habit. Please try again.');
    }
  };

  const renderFrequencyButton = (value: HabitFrequency) => (
    <TouchableOpacity
      style={[
        styles.frequencyButton,
        frequency === value && styles.frequencyButtonActive,
      ]}
      onPress={() => setFrequency(value)}
    >
      <Text
        style={[
          styles.frequencyButtonText,
          frequency === value && styles.frequencyButtonTextActive,
        ]}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter habit name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter habit description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyContainer}>
          {renderFrequencyButton('daily')}
          {renderFrequencyButton('weekly')}
          {renderFrequencyButton('monthly')}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Habit</Text>
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
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  frequencyButtonActive: {
    backgroundColor: '#f4511e',
    borderColor: '#f4511e',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#333',
  },
  frequencyButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#f4511e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 