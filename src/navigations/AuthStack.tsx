import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/auth/LoginScreen';
import RegisterScreen from '../views/auth/RegisterScreen';
import ForgotPassScreen from '../views/auth/ForgotPassScreen';
import ChangePassScreen from '../views/auth/ChangePassScreen';
import OtpVerifyScreen from '../views/auth/OtpVerifyScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator 
        screenOptions={{
        animation: 'none',
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Forgot" component={ForgotPassScreen} />
      <Stack.Screen name="Change" component={ChangePassScreen} />
      <Stack.Screen name="Otp" component={OtpVerifyScreen} />
    </Stack.Navigator>
  );
}

