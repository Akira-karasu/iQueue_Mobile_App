import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Activity from '@/src/components/buttons/activity';
import Button from '@/src/components/buttons/Button';
import Input from '@/src/components/inputs/Input';
import IconBar from '@/src/components/layout/IconBar';
import LogoTitle from '@/src/components/layout/LogoTitle';
import { ForgotOtpTimer } from '@/src/components/timer/forgototpTimer ';
import { useOtp } from '@/src/hooks/autHooks/useOtp';
import { useOtpTimer } from '@/src/hooks/componentHooks/useOtpTimer';
import { Text, View } from 'react-native';
import styles from './authStyle';




export default function ForgotPasswordOTP(){


    const {
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
    } = useOtp();

    const { secondsLeft, startTimer, resendOtp, isCounting } = useOtpTimer(30);

    React.useEffect(() => {
        startTimer();
    }, [startTimer]);



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
         <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={styles.LinearGradient}
                >
            <IconBar />
            <LogoTitle title="OTP Verification" />

            <View style={styles.FormContainer}>
                <View style={styles.InputContainer}>
                    <Input
                        label="OTP"
                        placeholder="Enter your OTP"
                        value={Otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        editable={true}
                        maxLength={6}
                    />
                </View>
            {validationMessage ? (
              <Text style={styles.ValidationText}>{validationMessage}</Text>
            ) : null}

            <ForgotOtpTimer secondsLeft={secondsLeft} resendOtp={resendOtp} isCounting={isCounting} emailVerification={email} />
            
            <Button title={"Verify"} onPress={handleForgotPasswordOTP} disabled={isLoading} style={{ width: "100%" }} />

            <View style={styles.ActiveContainer}>
                <Text>Not receive OTP? </Text>
                <Activity label="Go back" onPress={goToBack} />
            </View>

            </View>

        </LinearGradient>
        </SafeAreaView>
    );
}

