import { authService } from '@/src/services/authService';
import { AuthStackParamList } from '@/src/types/navigation';
import { validateConfirmPassword, validatePassword } from '@/src/utils/validation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

type ChangePassScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Change'>;

type ChangePassScreenRouteProp = RouteProp<AuthStackParamList, 'Change'>;


export function useChangePass() {
    const navigation = useNavigation<ChangePassScreenNavigationProp>();
    const route = useRoute<ChangePassScreenRouteProp>();
    const { email } = route.params;

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [validationMessage, setValidationMessage] = React.useState(' ');
    const [isLoading, setIsLoading] = React.useState(false);

    const goToLogin = () => navigation.navigate('Login');

    const handleChange = async () => {
    setIsLoading(true);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);

    if (!passwordValidation.valid) {
        setValidationMessage(passwordValidation.message || '');
        setIsLoading(false);  // ✅ Set to false before returning
        return;
    }

    if (!confirmPasswordValidation.valid) {
        setValidationMessage(confirmPasswordValidation.message || '');
        setIsLoading(false);  // ✅ Set to false before returning
        return;
    }

    try {
        await authService().changePass(email, password, confirmPassword);
        console.log('Password changed successfully');
        setIsLoading(false);  // ✅ Success case
        goToLogin();
    } catch (err: any) {
        setValidationMessage(err.message);
        setIsLoading(false);  // ✅ Error case
    }
    }



    return(
        {
            email,
            password,
            setPassword,
            confirmPassword,
            setConfirmPassword,
            validationMessage,
            setValidationMessage,
            isLoading,
            setIsLoading,
            handleChange,
        }
    );

}



