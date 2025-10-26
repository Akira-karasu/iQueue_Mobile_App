import { useAuth, } from '@/src/context/authContext';
import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateAuth } from '@/src/utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';




type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLogin() {

  const { login } = useAuth();

const navigation = useNavigation<LoginScreenNavigationProp>();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [validationMessage, setValidationMessage] = useState(' ');
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
setIsLoading(true);

const authValidation = validateAuth(email, password);

if (!authValidation.valid) {
  setValidationMessage(authValidation.message || '');
  setIsLoading(false);
  return;
}

setValidationMessage(' ');

try {
  const user = await authService().login(email, password);
  console.log('User logged in:', user);
  console.log('Token being saved:', user.access_token);
  login(user.access_token);
} catch (error: any) {
  if (error.message === 'User is registered but not verified'){
    navigation.navigate('Otp', { email });
  }else{
    setValidationMessage(error.message);
  }
} finally {
  setIsLoading(false);
}


};

const goToForgotPassword = () => navigation.navigate('Forgot', { email } );
const goToRegister = () => navigation.navigate('Register');

return {
email,
setEmail,
password,
setPassword,
validationMessage,
handleLogin,
goToForgotPassword,
goToRegister,
isLoading,
};
}
