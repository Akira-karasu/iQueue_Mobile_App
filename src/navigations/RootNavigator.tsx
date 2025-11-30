import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useEffect } from 'react';
import { RootStackParamList } from '../types/navigation';

import { ActivityIndicator, View } from 'react-native';
import api from '../api/api-connection';
import { useAuth } from '../context/authContext'; // ✅ import your Auth hook
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  useKeepAwake();
  const { token, loading, expoPushToken } = useAuth(); // ✅ use token + loading from context

useEffect(() => {
    try {
      console.log('Axios instance base URL:', api.defaults.baseURL);
      console.log('Expo Push Token:', expoPushToken);
    } catch (error) {
      console.error('API connection error:', error);
    }

}, []);


  // ✅ Show a loading indicator while checking AsyncStorage
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#44ff00ff" />
      </View>
    );
  }

  // ✅ Use token to decide which stack to show
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
