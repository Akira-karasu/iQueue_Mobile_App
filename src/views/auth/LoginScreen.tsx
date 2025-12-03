import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Activity from '@/src/components/buttons/activity';
import Button from '@/src/components/buttons/Button';
import Input from '@/src/components/inputs/Input';
import IconBar from '@/src/components/layout/IconBar';
import LogoTitle from '@/src/components/layout/LogoTitle';
import { useLogin } from '@/src/hooks/autHooks/useLogin';
import styles from './authStyle';

export default function LoginScreen() {
const {
emailOrUsername,
setEmailOrUsername,
password,
setPassword,
validationMessage,
handleLogin,
goToForgotPassword,
goToRegister,
isLoading,
} = useLogin();

return (
<SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
<LinearGradient colors={['#C3F9E0', '#FFF']} style={styles.LinearGradient}> 
  <IconBar />
  <LogoTitle title="Login" />
    <View style={styles.FormContainer}>
      <View style={styles.InputContainer}>
        <Input
          label="Email or Username"
          placeholder="Enter your email or username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          keyboardType="email-address"
          editable={!isLoading}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showPasswordToggle
          editable={!isLoading}
        />
      </View>

      <View style={styles.ValidationContainer}>
        {validationMessage ? (
          <Text style={styles.ValidationText}>{validationMessage}</Text>
        ) : null}

        <Activity label="Forgot Password?" onPress={goToForgotPassword} />
      </View>

      <Button title={"Login"} onPress={handleLogin} disabled={isLoading} style={{ width: "100%" }} />

      <View style={styles.ActiveContainer}>
        <Text>Don&apos;t have an account? </Text>
        <Activity label="Sign Up" onPress={goToRegister} />
      </View>
    </View>
  </LinearGradient>
</SafeAreaView>


);
}
