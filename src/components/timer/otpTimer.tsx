import { StyleSheet, Text, View } from "react-native";
import Activity from "../buttons/activity";

interface OtpTimerProps {
    secondsLeft: number;
    resendOtp: () => void;
    isCounting: boolean;
}

export function OtpTimer({ secondsLeft, resendOtp, isCounting }: OtpTimerProps) {
    return (
        <View style={styles.container}>
            {isCounting ? (
                <Text style={{ color: 'gray', marginBottom: 10 }}>
                You can resend in {secondsLeft}s
                </Text>
            ) : (
                <Activity
                    label="Resend OTP"
                    onPress={resendOtp}
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