import { AuthStackParamList } from '@/src/types/navigation';
import { validateAuth } from '@/src/utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLogin() {
const navigation = useNavigation<LoginScreenNavigationProp>();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [validationMessage, setValidationMessage] = useState(' ');
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
const authValidation = validateAuth(email, password);


if (!authValidation.valid) {
  setValidationMessage(authValidation.message || '');
  return;
}

setValidationMessage(' ');
setIsLoading(true);

try {
  // Example login logic:
  // await loginUser(email, password);
  console.log('Logging in with:', { email, password });
  // navigation.navigate('Home'); // example
} catch (error) {
  setValidationMessage('Login failed. Please try again.');
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
