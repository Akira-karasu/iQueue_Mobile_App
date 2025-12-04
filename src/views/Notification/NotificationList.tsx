import { useAuth } from '@/src/context/authContext';
import { markNotificationAsDone } from '@/src/services/OfficeService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationListProps {
  notifications: any[];
  onNotificationSeen?: () => void;
  refreshing?: boolean;  // ✅ Added
  onRefresh?: () => void; // ✅ Added
}

const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<p[^>]*>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

type NavigationProp = NativeStackNavigationProp<any>;

export default function NotificationList({ 
  notifications, 
  onNotificationSeen,
  refreshing = false,  // ✅ Added default
  onRefresh          // ✅ Added
}: NotificationListProps) {
  const navigation = useNavigation<NavigationProp>();
  const { getUser } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = getUser()?.id ? Number(getUser().id) : null;

  const handleNotificationPress = async (item: any) => {
    try {
      console.log('📲 Navigating to NotificationMessage with data:', item);
      
      if (!item.seen && userId) {
        setLoading(true);
        console.log('📤 Marking notification as seen...');
        
        await markNotificationAsDone(item.id);
        
        console.log('✅ Notification marked as seen');
        
        if (onNotificationSeen) {
          onNotificationSeen();
        }
      }
      
      navigation.navigate('NotificationMessage', {
        notificationData: item,
      });
      
    } catch (error: any) {
      console.error('❌ Error marking notification as seen:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderNotificationItem = ({ item }: { item: any }) => {
    const cleanMessage = stripHtmlTags(item.message);
    const cleanPersonalInfoName = stripHtmlTags(item.personalInfoName);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
        disabled={loading}
        style={[
          styles.notificationButton,
          { backgroundColor: item.seen ? '#F3F4F6' : '#FFFFFF' }
        ]}
      >
        <View style={styles.notificationContent}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: item.seen ? '#E5E7EB' : '#DBEAFE' }
          ]}>
            <MaterialIcons
              name={item.seen ? 'done-all' : 'notifications-active'}
              size={20}
              color={item.seen ? '#6B7280' : '#10B981'}
            />
          </View>

          <View style={styles.contentSection}>
            <Text 
              style={[
                styles.notificationTitle,
                { fontWeight: item.seen ? '500' : '700' }
              ]} 
              numberOfLines={1}
            >
              {cleanMessage}
            </Text>
            
            <Text style={styles.notificationMeta} numberOfLines={1}>
              {cleanPersonalInfoName} • {new Date(item.createdAt).toLocaleDateString()}
            </Text>

          </View>

          <View style={styles.badgeContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.seen ? '#E5E7EB' : '#10B981' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.seen ? '#6B7280' : '#fff' }
              ]}>
                {item.seen ? 'Seen' : 'New'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!notifications || notifications.length === 0) {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => 'empty'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        }
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#19AF5B"
              colors={['#19AF5B']}
            />
          ) : undefined
        }
      />
    );
  }

  return (
    // ✅ Add RefreshControl directly to FlatList
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#19AF5B"
            colors={['#19AF5B']}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 12,
    gap: 10,
  },
  notificationButton: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  contentSection: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 14,
    color: '#1F2937',
  },
  notificationMeta: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});