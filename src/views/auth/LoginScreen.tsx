
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
import { validateAuth } from '../../utils/validation';


export default function LoginScreen({ navigation }) {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [validationMessage, setValidationMessage] = React.useState('');

  const handleLogin = async () => {

    const authValidation = validateAuth(email, password);

    if (!authValidation.valid) {
      setValidationMessage(authValidation.message);
      return;
    }

    setValidationMessage('');
    // setLoading(true);
    // ...login logic...
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={['top']}>
    <LinearGradient
      colors={['#C3F9E0', '#FFF']}
      style={GlobalStyles.container}
    >
      <IconBar />
      <LogoTitle title='Login'/>

      <View style={styles.container}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          showPasswordToggle
        />

        {validationMessage ? (
          <Text style={{ color: 'red', marginTop: 8 }}>{validationMessage}</Text>
        ) : null}
        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Activity
            label="Forgot Password?"
            onPress={() => {
             navigation.navigate('Forgot')
            }}
            color="#FFCE00"
            underline={false}
          />
        </View>

        <Button
          title="Login"
          onPress={handleLogin}
          style={{ marginTop: 60, width: "100%" }}
        />

        <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
          <Text >Don&apos;t have an account? </Text>
          <Activity
            label="Sign Up"
            onPress={() => navigation.navigate('Register')}
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

