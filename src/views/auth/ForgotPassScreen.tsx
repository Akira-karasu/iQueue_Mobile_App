import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../styles/style';
import { LinearGradient } from 'expo-linear-gradient';
import  IconBar  from '../../components/IconBar';
import  LogoTitle  from '../../components/LogoTitle';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Activity from '../../components/activity';

// import { validateAuth } from '../../utils/validation';

export default function ForgotPassScreen({ navigation }){
    const [email, setEmail] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState('');

    // make a function for checking email if existing

    return (
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