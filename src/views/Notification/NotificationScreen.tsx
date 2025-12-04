import IconButton from '@/src/components/buttons/IconButton';
import { useAuth } from '@/src/context/authContext';
import { useNotification } from '@/src/hooks/appTabHooks/useNotification';
import { mobileTransactionRequestNotification } from '@/src/services/OfficeService';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationList from './NotificationList';
import type { NotificationStackParamList } from './NotificationStack';
import style from './NotificationStyle';

type NotificationScreenProps = NativeStackScreenProps<NotificationStackParamList, 'Notification'>;

export default function NotificationScreen({ route }: NotificationScreenProps) {
  const { goTotabs } = useNotification();
  const { getUser } = useAuth();
  
  const userId = getUser()?.id ? Number(getUser().id) : null;
  const notificationData = route.params?.notificationData;
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  console.log('📬 Received notification data:', notificationData);

  const fetchNotifications = useCallback(async () => {
    try {
      if (userId) {
        console.log('📲 Fetching notifications for user:', userId);
        
        const freshData = await mobileTransactionRequestNotification(userId);
        console.log('✅ Fresh notifications fetched:', freshData);
        
        setNotifications(freshData?.data || []);
      }
    } catch (error: any) {
      console.error('❌ Error fetching notifications:', error.message);
      
      if (notificationData?.data) {
        setNotifications(notificationData.data);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, notificationData]);

  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Notification screen focused - Refreshing data');
      setLoading(true);
      fetchNotifications();
    }, [fetchNotifications])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationSeen = useCallback(() => {
    console.log('🔄 Notification marked as seen, refreshing...');
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }} edges={['top']}>
      {/* ✅ Header - Outside of FlatList */}
      <View style={style.notificationBorder}>
        <IconButton 
          icon={require('../../../assets/icons/ArrowBack.png')}
          onPress={() => goTotabs()}
        />
        <Text style={style.notificationText}>Notifications</Text>
      </View>

      {/* ✅ Show loading state on first load */}
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#19AF5B" />
          <Text style={{ marginTop: 12, color: '#6B7280', fontWeight: '600' }}>
            Loading notifications...
          </Text>
        </View>
      ) : (
        // ✅ NotificationList with FlatList (NO ScrollView wrapper)
        <NotificationList 
          notifications={notifications}
          onNotificationSeen={handleNotificationSeen}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}