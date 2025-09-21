import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { GlobalStyles } from '../../styles/style';
import { LinearGradient } from 'expo-linear-gradient';
import  IconBar  from '../../components/IconBar';
import  LogoTitle  from '../../components/LogoTitle';
import Input from "../../components/Input";
import Button from "../../components/Button";
import Activity from '../../components/activity';
import PasswordPolicy from '../../components/PasswordPolicy';

import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validation';
import Modals from '../../components/Modal';


export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [modalvisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleSignUp = () => {
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setValidationMessage(emailResult.message || "");
      return;
    }
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
    setModalVisible(true);
    // TODO: handle successful sign up
  };

  return (
    <LinearGradient
          colors={['#C3F9E0', '#FFF']}
          style={GlobalStyles.container}
        >
          <IconBar />
          <LogoTitle title="Sign up" />
          <View style={styles.container}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              required
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              required
            />
            <Input
                label="Re-Password"
                placeholder="Enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                showPasswordToggle
                required
              />
              {validationMessage ? (
                <Text style={{ color: 'red', marginTop: 2 }}>{validationMessage}</Text>
              ) : null}

              <PasswordPolicy />

              <Button
                title="Next"
                onPress={handleSignUp}
                style={{ marginTop: 5, width: "100%" }}
              />

              <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center' }}>
              <Text>Already have account? </Text>
              <Activity
                label="Login"
                onPress={() => navigation.navigate('Login')}
                color="#FFCE00"
                underline={true}
              />
              </View>

            <Modals
              visible={modalvisible}
              onClose={() => setModalVisible(false)}
              title="Terms and Conditions"
              message="IQUEUE: Smart Queue Management with Mobile Application for Pastorelle – Jesus Good Shepherd School"
            >


              <ScrollView style={styles.Scrollcontainer}>
      
                    {/* Section 1 */}
                    <View style={styles.section}>
                      <Text style={styles.heading}>1. Acceptance of Terms</Text>
                      <Text style={styles.paragraph}>
                        By downloading or using the IQUEUE app, you agree to these Terms and Conditions.
                        If you disagree with any part, do not use the app.
                      </Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Section 2 */}
                    <View style={styles.section}>
                      <Text style={styles.heading}>2. Use of the Service</Text>
                      <Text style={styles.paragraph}>
                        IQUEUE helps manage queues for institutional services at Jesus Good Shepherd School.
                      </Text>
                      <Text style={styles.subHeading}>You may use the app to</Text>
                      <Text style={styles.list}>• Schedule appointments for school transactions</Text>
                      <Text style={styles.list}>• Generate and scan QR codes at kiosks</Text>
                      <Text style={styles.list}>• Receive real-time queue and document updates</Text>
                      <Text style={styles.list}>• Misuse of the app or submission of false information may lead to account suspension.</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Section 3 */}
                    <View style={styles.section}>
                      <Text style={styles.heading}>3. User Account</Text>
                      <Text style={styles.paragraph}>
                        Users must register to access the app.
                      </Text>
                      <Text style={styles.subHeading}>User account require:</Text>
                      <Text style={styles.list}>• Email</Text>
                      <Text style={styles.list}>• Password</Text>
                      <Text style={styles.paragraph}>
                        You are responsible for keeping your login details secure and ensuring all information is accurate.
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Section 4 */}
                    <View style={styles.section}>
                      <Text style={styles.heading}>4. Privacy Policy</Text>
                      <Text style={styles.paragraph}>
                        We collect limited personal data to support core app functions like queue tracking and notifications.
                        Data is securely stored and not shared without consent.
                      </Text>
                      <Text style={styles.paragraph}>
                        The app uses Firebase for authentication and data handling.
                        By using the app, you agree to Firebase's privacy policies.
                      </Text>
                    </View>

                  </ScrollView>


              <View style={styles.checkboxContainer}>
                          <Switch
                            value={checked}
                            onValueChange={setChecked}
                            trackColor={{ false: '#ccc', true: '#FFCE00' }}
                            thumbColor={checked ? '#fff' : '#f4f3f4'}
                            style={styles.switch}
                          />
                          <Text style={styles.checkboxLabel}>
                            I accept the Terms and Condition
                          </Text>
              </View>

              <View style={styles.buttonsContainer}> 

                <Button
                  title="Decline"
                  onPress={() => setModalVisible(false)}
                  fontSize={18}
                  color='#393939'
                  backgroundColor="#CBCACA"
                />

                <Button
                  title="Accept"
                  onPress={() => setModalVisible(false)}
                  disabled={!checked}
                  fontSize={18}
                  style={[!checked && { opacity: 0.5 }]}
                />

              

              </View>
            </Modals>
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
  Scrollcontainer: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // makes the switch smaller, more like a checkbox
    marginRight: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  Checkbutton: {
    backgroundColor: '#FFCE00',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginTop: 8,
  },section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 6,
  },
  list: {
    fontSize: 14,
    color: '#444',
    marginLeft: 12,
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
});


