import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationMessage from './NotificationMessage';
import NotificationScreen from './NotificationScreen';

export type NotificationStackParamList = {
  Notification: {
    notificationData?: {
      data: any[];
    };
  };
  NotificationMessage: {
    notificationData?: any;
  };
};

const Stack = createNativeStackNavigator<NotificationStackParamList>();

export default function NotificationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen 
        name="NotificationMessage" 
        component={NotificationMessage}
      />
    </Stack.Navigator>
  );
}