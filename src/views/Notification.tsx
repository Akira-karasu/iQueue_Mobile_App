import React from 'react';
import { View, Text } from 'react-native';
import UserBoarder from '../components/UserBoarder';
import Notification from '../components/functionalComponents/Notification';

export default function NotificationScreen() {

  return (
     <View style={{ flex: 1 }}>
      <UserBoarder />
      <Notification />
    </View>
  );
}