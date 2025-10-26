import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PasswordPolicyProps {
  password: string;
  confirmPassword: string;
}

const PasswordPolicy: React.FC<PasswordPolicyProps> = ({ password, confirmPassword }) => {
  const rules = [
    { label: 'Must contain 8-12 characters', test: (pw: string) => pw.length >= 8 && pw.length <= 12 },
    { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
    { label: 'One digit', test: (pw: string) => /\d/.test(pw) },
    { label: 'One special character (!@#$%^&*)', test: (pw: string) => /[!@#$%^&*(),.?":{}|<>\[\]\/\\_+=;'`~-]/.test(pw) },
    { label: 'Passwords match', test: () => password !== '' && confirmPassword !== '' && password === confirmPassword },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Requirements</Text>
      <View style={styles.listContainer}>
        {rules.map((rule, index) => {
          const isValid = rule.test(password);
          return (
            <Text key={index} style={[styles.item, { color: isValid ? '#14AD59' : '#878787' }]}>
              • {rule.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#14AD59',
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PasswordPolicy;
