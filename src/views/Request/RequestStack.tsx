import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RequestStackParamList } from '../../types/navigation';
import RequestScreen from './RequestScreen';
import RequestTransaction from './RequestTransaction';
import QueueScreen from './queue_screen';

const Stack = createNativeStackNavigator<RequestStackParamList>();

export default function RequestStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="Request" component={RequestScreen} />
            <Stack.Screen name="Transaction" component={RequestTransaction}/>
            <Stack.Screen name="Queue" component={QueueScreen} />
        </Stack.Navigator>
    );
}