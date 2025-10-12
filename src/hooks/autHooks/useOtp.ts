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

    const handleOtp = () => {
        const otpValidation = validateOtp(Number(Otp));

        if (!otpValidation.valid) {
            setValidationMessage(otpValidation.message || '');
            return;
        }

        setValidationMessage(' ');
        setIsLoading(true);
        navigation.navigate('Change', { email });
    };

    const goToForgot = () => navigation.navigate('Forgot', { email });

    return {
        navigation,
        Otp, 
        setOtp,
        validationMessage, 
        setValidationMessage,
        handleOtp,
        isLoading,
        setIsLoading,
        goToForgot
    };
}

