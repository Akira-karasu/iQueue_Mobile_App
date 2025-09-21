// LandingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import  CustomBottomSheet  from '../components/BottomSheet';
import AuthStack from './AuthStack';

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp!</Text>
      <CustomBottomSheet snapPoints={['70%']} initialIndex={0} enablePanDownToClose={false}>
        <AuthStack />
        <Text>working</Text>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
