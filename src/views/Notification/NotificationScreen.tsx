import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
     <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <Text>Notification Screen</Text>
    </View>
    </SafeAreaView>
  );
}