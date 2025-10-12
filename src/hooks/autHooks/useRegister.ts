import { AuthStackParamList } from '@/src/types/navigation';
import { validateConfirmPassword, validateEmail, validatePassword } from '@/src/utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function useRegister() {
const navigation = useNavigation<RegisterScreenNavigationProp>();


const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [validationMessage, setValidationMessage] = useState(' ');
const [isLoading, setIsLoading] = useState(false);
const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

const goToLogin = () => navigation.navigate('Login');

const handleSignUp = async (open: () => void) => {
const emailResult = validateEmail(email);
if (!emailResult.valid) {
setValidationMessage(emailResult.message || '');
return;
}

const passwordResult = validatePassword(password);
if (!passwordResult.valid) {
  setValidationMessage(passwordResult.message || '');
  return;
}

const confirmResult = validateConfirmPassword(password, confirmPassword);
if (!confirmResult.valid) {
  setValidationMessage(confirmResult.message || '');
  return;
}


setValidationMessage(' ');



  if (!hasAcceptedTerms) {
    open();
  } else {
    try {
      setIsLoading(true);
      // Simulate registration logic (e.g. API call)
      console.log('Registering user:', { email, password });
      // navigation.navigate('NextStep'); // Example navigation
      goToLogin();
    } catch (error) {
      setValidationMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }






};


return {
email,
setEmail,
password,
setPassword,
confirmPassword,
setConfirmPassword,
validationMessage,
handleSignUp,
goToLogin,
isLoading,
hasAcceptedTerms,
setHasAcceptedTerms,
};
}
