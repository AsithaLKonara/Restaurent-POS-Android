import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { MenuScreen } from '../screens/MenuScreen';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

// Placeholders for other screens
const BillingScreenPlaceholder = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Billing Core</Text></View>;
const HistoryScreenPlaceholder = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>History</Text></View>;
const SettingsScreenPlaceholder = () => <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Settings</Text></View>;

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
      <Tab.Screen name="Billing" component={BillingScreenPlaceholder} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="History" component={HistoryScreenPlaceholder} />
      <Tab.Screen name="Settings" component={SettingsScreenPlaceholder} />
    </Tab.Navigator>
  );
};
