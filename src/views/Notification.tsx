import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserBoarder from '../components/UserBoarder';
import Notification from '../components/functionalComponents/Notification';

export default function NotificationScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
     <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <UserBoarder />
      <Notification />
    </View>
    </SafeAreaView>
  );
}