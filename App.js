import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainScreen from './src/screens/MainScreen';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar style="light" backgroundColor={COLORS.bg} translucent={false} />
      <MainScreen />
    </SafeAreaProvider>
  );
}
