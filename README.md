# Habit Tracker App

A React Native mobile application for tracking daily habits and building positive routines.

## Features

- Create and manage habits with custom frequencies (daily, weekly, monthly)
- Track habit completion with a simple tap
- View habit statistics and progress
- Clean and intuitive user interface
- Persistent storage using AsyncStorage

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd habit-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your physical device

## Project Structure

```
src/
  ├── screens/           # Screen components
  │   ├── home-screen.tsx
  │   ├── add-habit-screen.tsx
  │   └── habit-detail-screen.tsx
  ├── services/         # Business logic and data management
  │   └── habit-service.ts
  └── types/           # TypeScript type definitions
      └── habit.ts
```

## Usage

1. **View Habits**
   - Open the app to see your list of habits
   - Each habit shows its name, description, frequency, and completion count

2. **Add a New Habit**
   - Tap the "Add New Habit" button
   - Fill in the habit details (name, description, frequency)
   - Tap "Save Habit" to create

3. **Track Habits**
   - Tap on a habit to view its details
   - Use the "Mark as Complete" button to record completion
   - View statistics and progress

4. **Delete Habits**
   - Open habit details
   - Tap "Delete Habit" to remove it

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 