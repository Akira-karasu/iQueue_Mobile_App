import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './navigations/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1,  backgroundColor: "#ffffff"}} edges={['bottom']}>
        <RootNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}






