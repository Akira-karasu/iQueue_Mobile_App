import { useAuth, } from '@/src/context/authContext';
import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateAuth } from '@/src/utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';




type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLogin() {

  const { login, getUser } = useAuth();

  const Getuser = getUser();

const navigation = useNavigation<LoginScreenNavigationProp>();

const [emailOrUsername, setEmailOrUsername] = useState('');
const [password, setPassword] = useState('');

const [validationMessage, setValidationMessage] = useState(' ');
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);

  const authValidation = validateAuth(emailOrUsername, password);

  if (!authValidation.valid) {
    setValidationMessage(authValidation.message || '');
    setIsLoading(false);
    return;
  }

  setValidationMessage(' ');

  try {
    const response = await authService().login(emailOrUsername, password);
    
    console.log('✅ Login response:', JSON.stringify(response, null, 2));
    
    // ✅ Extract the token from nested structure
    let tokenString = response.access_token;
    
    // ✅ If access_token is an object, get the nested access_token
    if (typeof tokenString === 'object' && tokenString?.access_token) {
      tokenString = tokenString.access_token;
    }
    
    console.log('🎯 Final token string:', tokenString);
    console.log('🎯 Token type:', typeof tokenString);
    
    if (!tokenString || typeof tokenString !== 'string') {
      console.error('❌ Invalid token:', tokenString);
      setValidationMessage('Invalid token received');
      setIsLoading(false);
      return;
    }
    
    // ✅ Pass ONLY the token string
    login(tokenString);
    
  } catch (error: any) {
    if (error.message === 'User is registered but not verified') {
      navigation.navigate('Otp', { email: emailOrUsername });
    } else {
      setValidationMessage(error.message);
    }
  } finally {
    setIsLoading(false);
  }
};

const goToForgotPassword = () => navigation.navigate('Forgot', {email: emailOrUsername  } );
const goToRegister = () => navigation.navigate('Register');

return {
emailOrUsername,
setEmailOrUsername,
password,
setPassword,
validationMessage,
handleLogin,
goToForgotPassword,
goToRegister,
isLoading,
};
}
