import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateOtp } from '@/src/utils/validation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

type OtpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Otp">;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, "Otp">;

export function useOtp() {
    const navigation = useNavigation<OtpScreenNavigationProp>();
    const route = useRoute<OtpScreenRouteProp>();
    const { email } = route.params;

    const [Otp, setOtp] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState(" ");
    const [isLoading, setIsLoading] = React.useState(false);


    const handleOtp = async () => {
        setIsLoading(true);

        const otpValidation = validateOtp(Number(Otp));

        if (!otpValidation.valid) {
            setValidationMessage(otpValidation.message || '');
            setIsLoading(false);
            return;
        }
        try {
            const user = await authService().otp_verify(email, Otp);
            console.log('OTP verified successfully');
            console.log(user);
            setIsLoading(false);
            navigation.navigate('Login');
        } catch (err: any) {
            setValidationMessage(err.message);
            setIsLoading(false);
            return;
        }finally{
            setIsLoading(false);
        }

    };

        const handleForgotPasswordOTP = async () => {
        setIsLoading(true);

        const otpValidation = validateOtp(Number(Otp));

        if (!otpValidation.valid) {
            setValidationMessage(otpValidation.message || '');
            setIsLoading(false);
            return;
        }
        try {
            const user = await authService().otp_verify(email, Otp);
            console.log('OTP verified successfully');
            console.log(user);
            setIsLoading(false);
            navigation.navigate('Change', { email });
        } catch (err: any) {
            setValidationMessage(err.message);
            setIsLoading(false);
            return;
        }finally{
            setIsLoading(false);
        }

    };

    const goToBack = () => navigation.goBack();

    return {
        navigation,
        Otp, 
        setOtp,
        validationMessage, 
        setValidationMessage,
        handleOtp,
        isLoading,
        setIsLoading,
        goToBack,
        handleForgotPasswordOTP,
        email
    };
}

