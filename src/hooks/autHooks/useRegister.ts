import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateRegisterInputs } from '@/src/utils/validation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function useRegister() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [checked, setChecked] = useState(false);

  const goToLogin = () => navigation.navigate('Login');
  const goToOtp = () => navigation.navigate('Otp', { email });

  // Parse backend error messages
  const parseBackendError = (error: any): string => {
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      if (message.includes('Validation failed:')) {
        return message.replace('Validation failed: ', '');
      }
      return message;
    }

    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  };

  const handleSignUp = async () => {
    try {
      setValidationMessage('');
      setIsLoading(true);

      // Frontend validation using utility function
      const validation = validateRegisterInputs(
        email,
        password,
        confirmPassword,
        hasAcceptedTerms
      );

      if (!validation.valid) {
        setValidationMessage(validation.message || 'Validation failed');
        setIsLoading(false);
        return;
      }

      // Send to backend
      try {
        await authService().register(email, password, hasAcceptedTerms);
        console.log('New account registered, OTP sent');
      } catch (err: any) {
        const errorMessage = parseBackendError(err);

        if (err.response?.data?.message?.includes('Email already exists')) {
          setValidationMessage('This email is already registered');
          setIsLoading(false);
          return;
        }

        if (err.message === 'Email not verified') {
          await authService().register_send_otp(email);
          goToOtp();
          setIsLoading(false);
          return;
        }

        setValidationMessage(errorMessage);
        setIsLoading(false);
        return;
      }

      // Send OTP
      try {
        await authService().register_send_otp(email);
        goToOtp();
      } catch (otpErr: any) {
        setValidationMessage(parseBackendError(otpErr));
        setIsLoading(false);
      }
    } catch (error: any) {
      setValidationMessage(parseBackendError(error));
    } finally {
      setIsLoading(false);
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
    checked,
    setChecked,
  };
}