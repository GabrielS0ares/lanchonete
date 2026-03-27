import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { MainScreen } from './src/screens/MainScreen';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f7efe2' }}>
        <StatusBar style="dark" />
        <MainScreen />
      </SafeAreaView>
    </AppProvider>
  );
}
