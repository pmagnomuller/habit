import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/home-screen';
import AddHabitScreen from './src/screens/add-habit-screen';
import HabitDetailScreen from './src/screens/habit-detail-screen';

export type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  HabitDetail: { habitId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'My Habits' }}
          />
          <Stack.Screen 
            name="AddHabit" 
            component={AddHabitScreen} 
            options={{ title: 'Add New Habit' }}
          />
          <Stack.Screen 
            name="HabitDetail" 
            component={HabitDetailScreen} 
            options={{ title: 'Habit Details' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 