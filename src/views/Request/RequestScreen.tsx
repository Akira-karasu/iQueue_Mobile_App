
import UserBoarder from '@/src/components/layout/UserBoarder';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';





export default function AppointmentScreen() {



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <UserBoarder />

    </View>
    </SafeAreaView>
  );
}