import { authService } from "@/src/services/authService";
import { StyleSheet, Text, View } from "react-native";
import Activity from "../buttons/activity";

interface OtpTimerProps {
    secondsLeft: number;
    resendOtp: () => void;
    isCounting: boolean;
    emailVerification: string; 
}

export function OtpTimer({ secondsLeft, resendOtp, isCounting, emailVerification }: OtpTimerProps) {
    return (
        <View style={styles.container}>
            {isCounting ? (
                <Text style={{ color: 'gray', marginBottom: 10 }}>
                You can resend in {secondsLeft}
                </Text>
            ) : (
                <Activity
                    label="Resend OTP"
                    onPress={() => {
                        resendOtp();
                        authService().register_send_otp(emailVerification);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
});