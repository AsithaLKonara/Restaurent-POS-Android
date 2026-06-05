import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/db';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';

// Custom POS Theme
const customDarkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CAF50', // Modern Green
    secondary: '#2196F3', // Modern Blue
    error: '#f44336',
    background: '#121212',
    surface: '#1e1e1e',
    surfaceVariant: '#2c2c2c',
  },
};

const customLightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50', // Modern Green
    secondary: '#2196F3', // Modern Blue
    error: '#f44336',
    background: '#f5f5f5',
    surface: '#ffffff',
    surfaceVariant: '#eeeeee',
  },
};

const App = () => {
  // We can later wire this up to settings for dark/light mode toggle
  const isDarkMode = true; 
  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  useEffect(() => {
    initDatabase().catch(console.error);
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
