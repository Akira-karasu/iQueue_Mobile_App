import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from "../../components/Button";
import IconBar from '../../components/IconBar';
import Input from "../../components/Input";
import LogoTitle from '../../components/LogoTitle';
import PasswordPolicy from '../../components/PasswordPolicy';
import { GlobalStyles } from '../../styles/style';

import { validateConfirmPassword, validatePassword } from '../../utils/validation';
export default function ChangePassScreen({ navigation }){
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [validationMessage, setValidationMessage] = React.useState("");

    const handleChangePass = () => {
        
        const passwordResult = validatePassword(password);
        if (!passwordResult.valid) {
          setValidationMessage(passwordResult.message || "");
          return;
        }
        const confirmResult = validateConfirmPassword(password, confirmPassword);
        if (!confirmResult.valid) {
          setValidationMessage(confirmResult.message || "");
          return;
        }
        setValidationMessage("");
        // TODO: handle successful sign up
      };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
        <LinearGradient
              colors={['#C3F9E0', '#FFF']}
              style={GlobalStyles.container}
            >
              <IconBar />
              <LogoTitle title='Change Password'/>

              <View style={styles.container}>
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    showPasswordToggle
                    value={password}
                    onChangeText={setPassword}
                    required
                    />
                <Input
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    secureTextEntry
                    showPasswordToggle
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    required
                    />
                {validationMessage ? (
                                <Text style={{ color: 'red', marginTop: 2 }}>{validationMessage}</Text>
                              ) : null}
                <PasswordPolicy />
                <Button
                    title="Change"
                    onPress={handleChangePass}
                    style={{ marginTop: 60, width: "100%" }}
                />
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
