import { markNotificationAsDone } from '@/src/services/OfficeService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationMessageScreenProps = NativeStackScreenProps<any, 'NotificationMessage'>;

const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<p[^>]*>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// ✅ Helper function to parse and extract links from text
const extractLinksFromText = (text: string): (string | { type: 'link'; url: string; text: string })[] => {
  if (!text) return [];
  
  // ✅ Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: (string | { type: 'link'; url: string; text: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link
    parts.push({
      type: 'link',
      url: match[0],
      text: match[0],
    });
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

// ✅ Component to render message with clickable links
const MessageWithLinks = ({ message }: { message: string }) => {
  const parts = extractLinksFromText(message);

  return (
    <Text style={styles.messageBody}>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return (
            <Text key={index} style={styles.messageBody}>
              {part}
            </Text>
          );
        }
        
        // ✅ Render link as clickable
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => {
              console.log('🔗 Opening link:', part.url);
              Linking.openURL(part.url).catch(err =>
                console.error('❌ Error opening link:', err)
              );
            }}
          >
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
};

export default function NotificationMessage({ route }: NotificationMessageScreenProps) {
  const navigation = useNavigation();
  const notificationData = route.params?.notificationData;

  console.log('📨 Full notification data:', notificationData);

  useEffect(() => {
    const markAsDone = async () => {
      if (notificationData && !notificationData.seen) {
        try {
          console.log('✅ Marking notification as done:', notificationData.id);
          await markNotificationAsDone(notificationData.id);
        } catch (error) {
          console.error('❌ Error marking notification as done:', error);
        }
      }
    };

    markAsDone();
  }, [notificationData]);

  if (!notificationData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No notification data available</Text>
      </SafeAreaView>
    );
  }

  const cleanMessage = stripHtmlTags(notificationData.message);

  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['top', 'left', 'right']}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color='#19AF5B' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ✅ Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ✅ Main Card - Message Content */}
        <View style={styles.mainCard}>
          {/* ✅ Header with Status and Date */}
          <View style={styles.messageHeader}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: notificationData.seen ? '#E5E7EB' : '#10B981' }
            ]}>
              <MaterialIcons 
                name={notificationData.seen ? 'done-all' : 'notifications-active'} 
                size={16} 
                color={notificationData.seen ? '#6B7280' : '#fff'} 
              />
              <Text style={[
                styles.statusBadgeText,
                { color: notificationData.seen ? '#6B7280' : '#fff' }
              ]}>
                {notificationData.seen ? 'Seen' : 'New'}
              </Text>
            </View>
            <Text style={styles.timestamp}>
              {new Date(notificationData.createdAt).toLocaleString()}
            </Text>
          </View>

          {/* ✅ Main Message with Clickable Links */}
          <MessageWithLinks message={cleanMessage} />

          {/* ✅ Message Footer - From */}
          <View style={styles.messageFooter}>
            <View style={styles.fromBadge}>
              <MaterialIcons name="admin-panel-settings" size={16} color="#10B981" />
              <Text style={styles.fromText}>
                from {notificationData.sendedBy?.name || 'Administrator'} #{notificationData.sendedBy?.id || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* ✅ Details Section */}
        <View style={styles.detailsSection}>
          {/* ✅ Student Info */}
          {notificationData.personalInfoName && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="person" size={18} color="#0369A1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Student Name</Text>
                <Text style={styles.detailValue}>
                  {stripHtmlTags(notificationData.personalInfoName)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    color: '#19AF5B',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  
  // ✅ Main Message Card
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  // ✅ Message body with regular text
  messageBody: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    lineHeight: 22,
  },
  // ✅ Clickable link styling
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369A1',
    textDecorationLine: 'underline',
  },
  messageFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fromBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fromText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },

  // ✅ Details Section
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomColor: '#F3F4F6',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

  // ✅ Action Button
  actionButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});