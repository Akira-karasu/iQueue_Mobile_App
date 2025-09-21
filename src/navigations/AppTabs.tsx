import React from 'react';
import { View, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../views/HomeScreen';
import NotificationScreen from '../views/Notification';
import AppointmentScreen from '../views/AppointmentScreen';
import ProfileScreen from '../views/Profile.Screen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // we'll make custom labels under icons
        tabBarStyle: {
          height: 120,
          paddingTop: 20,
          paddingBottom: 10
        },
        tabBarIcon: ({ focused }) => {
          let iconSource, label;

          if (route.name === 'Home') {
            iconSource = require('../../assets/icons/home.png');
            label = 'Home';
          } else if (route.name === 'Notification') {
            iconSource = require('../../assets/icons/notification.png');
            label = 'Notification';
          } else if (route.name === 'Appointment') {
            iconSource = require('../../assets/icons/calendaryo.png');
            label = 'Appoint';
          } else if (route.name === 'Profile') {
            iconSource = require('../../assets/icons/profile.png');
            label = 'Profile';
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              {/* Circle background */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: focused ? '#F2C40C' : '#1EBA60',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Image
                  source={iconSource}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#fff',
                  }}
                  resizeMode="contain"
                />
              </View>

              {/* Label */}
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? '#F2C40C' : '#999',
                  width: 70, textAlign: 'center',
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
