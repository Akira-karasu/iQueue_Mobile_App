import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const user = true; // later: replace with your real auth state

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
  );
}

