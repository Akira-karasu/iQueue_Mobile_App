import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';

import ChangePassScreen from '../views/auth/ChangePassScreen';
import ForgotPassScreen from '../views/auth/ForgotPassScreen';
import ForgotPasswordOTP from '../views/auth/ForgotPasswordOTP';
import LoginScreen from '../views/auth/LoginScreen';
import OtpVerifyScreen from '../views/auth/OtpVerifyScreen';
import RegisterScreen from '../views/auth/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

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
      <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTP} />
    </Stack.Navigator>
  );
}

