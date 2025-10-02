import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from "../../components/Button";
import IconBar from '../../components/IconBar';
import Input from "../../components/Input";
import LogoTitle from '../../components/LogoTitle';
import Activity from '../../components/activity';
import { GlobalStyles } from '../../styles/style';



export default function OtpVerifyScreen({ navigation }){
    const [Otp, setOtp] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState("");
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
         <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={GlobalStyles.container}
                >
              <IconBar />
              <LogoTitle title='OTP Verification'/>
              <View style={styles.container}>
                <Input
                    label="Enter OTP"
                    placeholder="Enter your OTP"
                    value={Otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    />
                {validationMessage ? (
                                <Text style={{ color: 'red', marginTop: 2 }}>{validationMessage}</Text>
                              ) : null}
                <Text >Resend 0s </Text>
                <Button
                    title="Verify"
                    onPress={() => navigation.navigate('Change')}
                    style={{ marginTop: 60, width: "100%" }}
                />

                <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
                        <Text >Verification not sending? </Text>
                        <Activity
                          label="Change email"
                          onPress={() => navigation.navigate('Forgot')}
                          color="#FFCE00"
                          underline={true}
                        />
                      </View>

              </View>

              

        </LinearGradient>
        </SafeAreaView>
    );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
  },
});