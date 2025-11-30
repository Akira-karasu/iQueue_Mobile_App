import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

// Android Notification Channel (required)
Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Ask permission if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn("Permission not granted for notifications!");
        return;
      }

      // Get token (Expo Push Token)
      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);
      console.log("Expo Push Token:", tokenData.data);

      return tokenData.data;
    } catch (error) {
      console.error("Error getting push token:", error);
    }
  }

  return {
    expoPushToken,
  };
}
