import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

import { MainTabs } from './MainTabs';
import { AddEditMenuItemScreen } from '../screens/AddEditMenuItemScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, isChecking, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="AddEditMenuItem" 
              component={AddEditMenuItemScreen} 
              options={{ headerShown: true, title: 'Menu Item' }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen} 
              options={{ headerShown: true, title: 'Checkout' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
