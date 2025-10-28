import { authService } from '@/src/services/authService';
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
const [checked, setChecked] = useState(false);

const goToLogin = () => navigation.navigate('Login');
const goToOtp = () => navigation.navigate('Otp', { email });



const handleSignUp = async () => {
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

  if (!hasAcceptedTerms) {
    open();
  } else {
    try {
      setIsLoading(true);
        try {
          await authService().register(email, password, hasAcceptedTerms);
          console.log('new account registered, OTP sent');
        } catch (err: any) {
          if (err.message === 'Email not verified'){
          }else{
            return setValidationMessage(err.message);
          }
        }
      await authService().register_send_otp(email);
      goToOtp();
      setValidationMessage(" ")
    } catch (error: any) {
      return setValidationMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

setValidationMessage(' ');

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
checked, 
setChecked
};
}
