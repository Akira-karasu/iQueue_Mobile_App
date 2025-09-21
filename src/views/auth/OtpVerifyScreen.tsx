import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../styles/style';
import { LinearGradient } from 'expo-linear-gradient';
import  IconBar  from '../../components/IconBar';
import  LogoTitle  from '../../components/LogoTitle';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Activity from '../../components/activity';



export default function OtpVerifyScreen({ navigation }){
    const [Otp, setOtp] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState("");
    

    return (
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