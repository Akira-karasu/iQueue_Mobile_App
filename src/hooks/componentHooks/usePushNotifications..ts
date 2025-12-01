import * as Notifications from 'expo-notifications';
import { useState } from 'react';

// Android Notification Channel (required)
Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Retry logic with exponential backoff
  async function registerForPushNotificationsAsync(retryCount = 0, maxRetries = 3) {
    try {
      setLoading(true);
      setError(null);

      // ✅ Get permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('⚠️ Permission not granted for notifications');
        setError('Permission denied');
        setLoading(false);
        return null;
      }

      // ✅ Get token with retry logic
      try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        
        console.log('✅ Expo Push Token:', token);
        setExpoPushToken(token);
        setLoading(false);
        return token;
      } catch (tokenError: any) {
        const errorMessage = tokenError.message || '';
        const isTransient = errorMessage.includes('SERVICE_UNAVAILABLE') || 
                           errorMessage.includes('temporarily unavailable');

        if (isTransient && retryCount < maxRetries) {
          // ✅ Exponential backoff: wait 2s, 4s, 8s
          const waitTime = Math.pow(2, retryCount + 1) * 1000;
          console.warn(`⏳ Retrying push token (attempt ${retryCount + 1}/${maxRetries}) in ${waitTime}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return registerForPushNotificationsAsync(retryCount + 1, maxRetries);
        } else {
          console.error('❌ Failed to get push token after retries:', tokenError);
          setError('Failed to get push token. App will work without notifications.');
          setLoading(false);
          return null;
        }
      }
    } catch (error: any) {
      console.error('❌ Error in push notification setup:', error);
      setError(error.message || 'Unknown error');
      setLoading(false);
      return null;
    }
  }

  // ✅ Trigger on mount
  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  return {
    expoPushToken,
    loading,
    error,
    retry: registerForPushNotificationsAsync,
  };
}