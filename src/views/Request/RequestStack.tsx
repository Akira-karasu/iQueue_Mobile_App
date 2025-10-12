import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RequestStackParamList } from '../../types/navigation';
import RequestScreen from './RequestScreen';

const Stack = createNativeStackNavigator<RequestStackParamList>();

export default function RequestStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Request" component={RequestScreen} />
        </Stack.Navigator>
    );
}