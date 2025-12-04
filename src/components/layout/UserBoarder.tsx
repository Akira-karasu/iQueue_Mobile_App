import { useAuth } from '@/src/context/authContext';
import { authService } from '@/src/services/authService';
import { countTransactionRequestNotification, mobileTransactionRequestNotification } from '@/src/services/OfficeService';
import type { AppStackParamList, AppTabsParamList } from '@/src/types/navigation';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../buttons/IconButton';

type UserBoarderProp = BottomTabNavigationProp<AppTabsParamList, 'HomeStack'>;
type NavProp = NativeStackNavigationProp<AppStackParamList, 'Tabs'>;

export default function UserBoarder() {

  const { getUser } = useAuth();

  const userId = getUser()?.id ? Number(getUser()?.id) : null;

  // ✅ State for notifications
  const [notifications, setNotifications] = useState<any>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [username, setUsername] = useState<string>('User');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log('User ID:', userId);
  
  // ✅ Fetch notifications function
  const fetchNotifications = useCallback(async () => {
    try {
      if (userId !== null) {
        setLoading(true);
        setError(null);

        // ✅ Fetch mobile notifications
        const notificationData = await mobileTransactionRequestNotification(userId);
        console.log('✅ Notifications:', notificationData);
        setNotifications(notificationData);

        // ✅ Fetch notification count
        const countData = await countTransactionRequestNotification(userId);
        console.log('📊 Notification Count:', countData);
        setNotificationCount(countData?.unseenCount || 0);

        // ✅ Fetch username
        const getUsername = await authService().getUserInfo(userId);
        console.log('👤 Fetched Username:', getUsername.data.username);
        setUsername(getUsername.data.username || 'User');

      }
    } catch (error: any) {
      console.error('❌ Error fetching notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ✅ Use useFocusEffect to refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Screen focused - Fetching notifications');
      fetchNotifications();
    }, [fetchNotifications])
  );

  const AppTabnavigation = useNavigation<UserBoarderProp>();
  const AppStacknavigation = useNavigation<NavProp>();

const handleNotificationPress = useCallback(() => {
  console.log('📲 Navigating to notifications with data:', notifications);
  
  // ✅ Navigate to the Notification screen (not NotificationStack)
  AppStacknavigation.navigate('NotificationStack' as any, {
    screen: 'Notification',  // ✅ Add this
    params: {
      notificationData: notifications,
    }
  });
}, [notifications, AppStacknavigation]);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <IconButton
          icon={require('../../../assets/icons/boy.png')}
          onPress={() => AppTabnavigation.navigate('ProfileStack')}
          style={styles.image}
        />
        <Text style={styles.title}>
          Welcome {username}
        </Text>
      </View>
      <IconButton
        icon={require('../../../assets/icons/notifications.png')}
        onPress={() => {handleNotificationPress()}}
        count={notificationCount}
      />
      
      {/* ✅ Optional: Debug info */}
      {/* {error && (
        <Text style={{ color: 'red', fontSize: 50 }}>
          {error}
        </Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    backgroundColor: '#19AF5B',
    width: '100%',
  },
  image: {
    width: 40,
    height: 40,        
    borderColor: '#73B46D',
    borderRadius: 60,
    borderWidth: 2,
    marginRight: 15,
    backgroundColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});