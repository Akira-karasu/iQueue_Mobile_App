import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from './NotificationScreen';

const Stack = createNativeStackNavigator();

export default function NotificationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}
