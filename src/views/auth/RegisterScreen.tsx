
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Activity from "@/src/components/buttons/activity";
import Button from "@/src/components/buttons/Button";
import Input from "@/src/components/inputs/Input";
import IconBar from "@/src/components/layout/IconBar";
import LogoTitle from "@/src/components/layout/LogoTitle";
import { useRegister } from "@/src/hooks/autHooks/useRegister";
import useModal from "@/src/hooks/componentHooks/useModal";
import styles from "./authStyle";
import TermsAndConditions from "./TermsAndCondition";

export default function RegisterScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    validationMessage,
    handleSignUp,
    goToLogin,
    isLoading,
    hasAcceptedTerms,
    setHasAcceptedTerms,
    username,
    setUsername,
    checked, 
    setChecked
  } = useRegister();

  // Shared modal control
  const { visible, open, close } = useModal(false);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#C3F9E0" }} edges={["top"]}>
      <LinearGradient colors={["#C3F9E0", "#FFF"]} style={styles.LinearGradient}>
        <IconBar />
        <LogoTitle title="Sign up" />

        <View style={styles.FormContainer}>
          <View style={styles.InputContainer}>

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
              required
            />
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              editable={!isLoading}
              required
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              editable={!isLoading}
              required
            />
            <Input
              label="Re-Password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              editable={!isLoading}
              required
            />
          </View>

          {validationMessage ? (
            <Text style={styles.ValidationText}>{validationMessage || " "}</Text>
          ) : null}

          <View style={styles.TermsContainer}>
              <View>
                <Text>By signing up, you accept to our </Text>
              </View>

              <Activity
                label={"Terms & Conditions"}
                onPress={open}
              />
          </View>

          <Button
            title={"Verify & Sign Up"}
            onPress={() => handleSignUp()}
            style={{ width: "100%" }}
          />

          <View style={styles.ActiveContainer}>
              <Text>Already have an account? </Text>
              <Activity label="Login" onPress={goToLogin} />
            </View>
        </View>

        {/* Terms & Conditions modal */}
        
      </LinearGradient>
      <TermsAndConditions visible={visible} onClose={close} setHasAcceptedTerms={setHasAcceptedTerms}/>
    </SafeAreaView>
  );
}
