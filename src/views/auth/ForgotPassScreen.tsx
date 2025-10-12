import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Activity from '../../components/buttons/activity';
import Button from '../../components/buttons/Button';
import Input from '../../components/inputs/Input';
import IconBar from '../../components/layout/IconBar';
import LogoTitle from '../../components/layout/LogoTitle';
import { useForgotPass } from '../../hooks/autHooks/useForgotPass';
import styles from './authStyle';




export default function ForgotPassScreen() {

    const {
        email,
        setEmail,
        validationMessage,
        setValidationMessage,
        isLoading,
        setIsLoading,
        handleForgot,
        goToLogin
    } = useForgotPass();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
        <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={styles.LinearGradient}
            >
            <IconBar />
            <LogoTitle title='Forgot Password'/>
              
            <View style={styles.FormContainer}>
                <View style={styles.InputContainer}>
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        editable={!isLoading}
                    />
                </View>
                {validationMessage ? (
                    <Text style={styles.ValidationText}>{validationMessage}</Text>
                ) : null}

                <Button
                title="Verify"
                onPress={() => handleForgot()}
                style={{ width: "100%" }}
                />
                <View style={styles.ActiveContainer}>
                    <Text>Remember your password? </Text>
                    <Activity label="Login" onPress={goToLogin} />
                </View>
                
            </View>
 
            </LinearGradient>
        </SafeAreaView>
    );
}

