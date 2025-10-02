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

// import { validateAuth } from '../../utils/validation';

export default function ForgotPassScreen({ navigation }){
    const [email, setEmail] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState('');

    // make a function for checking email if existing

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
        <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={GlobalStyles.container}
            >
              <IconBar />
              <LogoTitle title='Forgot Password'/>

              <View style={styles.container}>
                <Input
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                {validationMessage ? (
                          <Text style={{ color: 'red', marginTop: 8 }}>{validationMessage}</Text>
                        ) : null}
                <Button
                title="Send"
                onPress={() => navigation.navigate('Otp')}
                style={{ marginTop: 60, width: "100%" }}
                />
                <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
                <Text >Remember your password? </Text>
                <Activity
                    label="Login"
                    onPress={() => navigation.navigate('Login')}
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