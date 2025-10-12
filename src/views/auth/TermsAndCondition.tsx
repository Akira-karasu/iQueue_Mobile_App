import Button from "@/src/components/buttons/Button";
import Modal from "@/src/components/modals/Modal";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";

type TermsAndConditionsProps = {
  visible: boolean;
  onClose: () => void;
  setHasAcceptedTerms: (accepted: boolean) => void;
};

function TermsAndConditions({ visible, onClose, setHasAcceptedTerms}: TermsAndConditionsProps) {
  const [checked, setChecked] = useState(false);


  return (
    <Modal
      visible={visible}
      onClose={onClose}
      height={"85%"}
      width={"95%"}
      title="Terms and Conditions"
      message="IQUEUE: Smart Queue Management with Mobile Application for Pastorelle – Jesus Good Shepherd School"
    >
      <ScrollView
        style={styles.Scrollcontainer}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.heading}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading or using the IQUEUE app, you agree to these Terms and
            Conditions. If you disagree with any part, do not use the app.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.heading}>2. Use of the Service</Text>
          <Text style={styles.paragraph}>
            IQUEUE helps manage queues for institutional services at Jesus Good
            Shepherd School.
          </Text>
          <Text style={styles.subHeading}>You may use the app to</Text>
          <Text style={styles.list}>• Schedule appointments for school transactions</Text>
          <Text style={styles.list}>• Generate and scan QR codes at kiosks</Text>
          <Text style={styles.list}>• Receive real-time queue and document updates</Text>
          <Text style={styles.list}>
            • Misuse of the app or submission of false information may lead to
            account suspension.
          </Text>
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
            You are responsible for keeping your login details secure and
            ensuring all information is accurate.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.heading}>4. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We collect limited personal data to support core app functions like
            queue tracking and notifications. Data is securely stored and not
            shared without consent.
          </Text>
          <Text style={styles.paragraph}>
            The app uses Firebase for authentication and data handling. By using
            the app, you agree to Firebase&apos;s privacy policies.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.checkboxContainer}>
        <Switch
          value={checked}
          onValueChange={setChecked}
          trackColor={{ false: "#ccc", true: "#FFCE00" }}
          thumbColor={checked ? "#fff" : "#f4f3f4"}
          style={styles.switch}
        />
        <Text style={styles.checkboxLabel}>
          I accept the Terms and Conditions
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Decline"
          onPress={onClose}
          width={"48%"}
          fontSize={18}
          color="#393939"
          backgroundColor="#CBCACA"
        />
        <Button
          title="Accept"
          onPress={() => {
            setHasAcceptedTerms(true);
            onClose();
          }}
          disabled={!checked}
          fontSize={18}
          style={[!checked && { opacity: 0.5 }]}
          width={"48%"}
        />
      </View>
    </Modal>
  );
}

export default React.memo(TermsAndConditions);


export const styles = StyleSheet.create({

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