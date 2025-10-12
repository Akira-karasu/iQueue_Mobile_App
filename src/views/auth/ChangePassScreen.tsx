import PasswordPolicy from '@/src/components/checker/PasswordPolicy';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/buttons/Button';
import Input from '../../components/inputs/Input';
import IconBar from '../../components/layout/IconBar';
import LogoTitle from '../../components/layout/LogoTitle';
import { useChangePass } from '../../hooks/autHooks/useChangePass';
import styles from './authStyle';



export default function ChangePassScreen() {

  const {
    password, 
    setPassword,
    confirmPassword, 
    setConfirmPassword,
    validationMessage, 
    setValidationMessage,
    isLoading, 
    setIsLoading,
    handleChange
  } = useChangePass();
 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
        <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={styles.LinearGradient}
            >
            <IconBar />
            <LogoTitle title='Change Password'/>

            <View style={styles.FormContainer}>
                <View style={styles.InputContainer}>
                    <Input
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      showPasswordToggle
                      editable={!isLoading}
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        showPasswordToggle
                        editable={!isLoading}
                    />
                </View>

                {validationMessage ? (
                  <Text style={styles.ValidationText}>{validationMessage}</Text>
                ) : null}

                <PasswordPolicy password={password} confirmPassword={confirmPassword} />

                <Button
                    title="Change Password"
                    onPress={handleChange}
                    disabled={isLoading}
                />


            </View>
              
        </LinearGradient>
        </SafeAreaView>
    );
}


