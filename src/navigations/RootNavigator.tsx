import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';


import AppStack from './AppStack';
import AuthStack from './AuthStack';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const user = true; // later: replace with your real auth state

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
  );
}


