import IconButton from '@/src/components/buttons/IconButton';
import { useNotification } from '@/src/hooks/appTabHooks/useNotification';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationList from './NotificationList';
import style from './NotificationStyle';


export default function NotificationScreen() {

  const { goTotabs } = useNotification();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
      <View style={style.container}>
        <View style={style.notificationBorder}>
          <IconButton 
          icon={require('../../../assets/icons/ArrowBack.png')}
          onPress={() => goTotabs()}
          />
          <Text style={style.notificationText}>Notifications</Text>
        </View>
         <NotificationList />
      </View>
    </SafeAreaView>
  );
}