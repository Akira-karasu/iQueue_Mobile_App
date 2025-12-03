import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateForgotPass } from '@/src/utils/validation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';


type ForgotScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Forgot'>;
type ForgotScreenRouteProp = RouteProp<AuthStackParamList, "Forgot">;

export function useForgotPass() {
    const navigation = useNavigation<ForgotScreenNavigationProp>();
    const route = useRoute<ForgotScreenRouteProp>();
    const { email: routeEmail } = route.params || { email: '' };

    const [email, setEmail] = useState(routeEmail || '');
    const [password, setPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState(' ');
    const [isLoading, setIsLoading] = useState(false);
    const goToOtp = () => navigation.navigate('ForgotPasswordOTP', { email });
    const goToLogin = () => navigation.navigate('Login');

    const handleForgot = async () => {
        const checkEmail = validateForgotPass(email);
        setIsLoading(true);

        if (!checkEmail.valid) {
            setValidationMessage(checkEmail.message || '');
            return;
        }

        try {
            await authService().forgot_send_otp(email);
            console.log('Password reset email sent successfully');
        } catch (err: any) {
            setValidationMessage(err.message);
            setIsLoading(false);
            return;
        }

        setValidationMessage(' ');
        setIsLoading(false);
        goToOtp();
    };


    return {
        email,
        setEmail,
        password,
        setPassword,
        validationMessage,
        setValidationMessage,
        isLoading,
        setIsLoading,
        handleForgot,
        goToOtp,
        goToLogin
    };
}

