import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../styles/style';
import { LinearGradient } from 'expo-linear-gradient';
import  IconBar  from '../../components/IconBar';
import  LogoTitle  from '../../components/LogoTitle';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Activity from '../../components/activity';
import PasswordPolicy from '../../components/PasswordPolicy';

import { validatePassword, validateConfirmPassword } from '../../utils/validation';
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
