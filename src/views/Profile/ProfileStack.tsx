import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ProfileStackParamList } from '../../types/navigation';
import AccountSettingsScreen from './AccountSettingsScreen';
import AppSettingsScreen from './AppSettingsScreen';
import ProfileScreen from './ProfileScreen';


const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
    </Stack.Navigator>
  );
}


