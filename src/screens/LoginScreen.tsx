import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, hasPinSet, setPin: savePin } = useAuthStore();
  const theme = useTheme();

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (hasPinSet) {
        login(pin).then(success => {
          if (!success) {
            setError('Invalid PIN');
            setPin('');
          }
        });
      } else {
        savePin(pin);
      }
    }
  }, [pin]);

  const renderDot = (index: number) => {
    const isFilled = index < pin.length;
    return (
      <View
        key={index}
        style={[
          styles.dot,
          { backgroundColor: isFilled ? theme.colors.primary : theme.colors.surfaceVariant }
        ]}
      />
    );
  };

  const renderKeypadButton = (num: string) => (
    <TouchableOpacity
      style={[styles.keypadButton, { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={() => handlePress(num)}
    >
      <Text style={styles.keypadText}>{num}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        {hasPinSet ? 'Enter PIN' : 'Set New 4-Digit PIN'}
      </Text>

      <View style={styles.dotsContainer}>
        {[0, 1, 2, 3].map(renderDot)}
      </View>

      {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}

      <View style={styles.keypadContainer}>
        <View style={styles.row}>
          {renderKeypadButton('1')}
          {renderKeypadButton('2')}
          {renderKeypadButton('3')}
        </View>
        <View style={styles.row}>
          {renderKeypadButton('4')}
          {renderKeypadButton('5')}
          {renderKeypadButton('6')}
        </View>
        <View style={styles.row}>
          {renderKeypadButton('7')}
          {renderKeypadButton('8')}
          {renderKeypadButton('9')}
        </View>
        <View style={styles.row}>
          <View style={styles.emptyButton} />
          {renderKeypadButton('0')}
          <TouchableOpacity
            style={[styles.keypadButton, { backgroundColor: theme.colors.errorContainer }]}
            onPress={handleClear}
          >
            <Text style={[styles.keypadText, { color: theme.colors.onErrorContainer }]}>C</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 40,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  keypadContainer: {
    gap: 15,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  keypadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyButton: {
    width: 80,
    height: 80,
  },
  error: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
