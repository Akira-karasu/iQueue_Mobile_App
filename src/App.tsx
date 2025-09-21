import React from 'react';
import {StyleSheet } from 'react-native';
import RootNavigator from './navigations/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
        <GestureHandlerRootView style={styles.container}>
          <RootNavigator />
        </GestureHandlerRootView>
);
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  }
});

