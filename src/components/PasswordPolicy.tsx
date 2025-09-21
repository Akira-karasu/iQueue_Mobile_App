import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PasswordPolicy = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Password Requirements</Text>
    <View style={styles.listContainer}>
      <Text style={styles.item}>• Must contain 8-12 characters</Text>
      <Text style={styles.item}>• One uppercase letter</Text>
      <Text style={styles.item}>• One lowercase letter</Text>
      <Text style={styles.item}>• One digit</Text>
      <Text style={styles.item}>• One special character (!@#$%^&*)</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#14AD59',
  },
  listContainer: {
    marginLeft: 8,
  },
  item: {
    fontSize: 14,
    color: '#878787',
    marginBottom: 4,
  },
});

export default PasswordPolicy;
