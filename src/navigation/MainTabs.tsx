import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { MenuScreen } from '../screens/MenuScreen';
import { BillingScreen } from '../screens/BillingScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { PrinterSetupScreen } from '../screens/PrinterSetupScreen';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

// Placeholders for other screens
const SettingsScreenPlaceholder = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Settings Placeholder</Text></View>;

export const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help';
          if (route.name === 'Billing') iconName = 'cash-register';
          else if (route.name === 'Menu') iconName = 'food';
          else if (route.name === 'History') iconName = 'history';
          else if (route.name === 'Settings') iconName = 'cog';
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.background },
      })}
    >
      <Tab.Screen name="Billing" component={BillingScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={PrinterSetupScreen} options={{ title: 'Setup' }} />
    </Tab.Navigator>
  );
};
