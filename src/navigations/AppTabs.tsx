import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import AppointmentScreen from '../views/AppointmentScreen';
import HomeScreen from '../views/HomeScreen';
import NotificationScreen from '../views/Notification';
import ProfileScreen from '../views/Profile.Screen';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // we'll make custom labels under icons
        tabBarStyle: {
        height: height * 0.10, // 10% of screen height
        paddingTop: height * 0.03,
        paddingBottom: height * 0.02,
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
  <View
    style={{
      width: width * 0.10,
      height: width * 0.10,
      borderRadius: width * 0.05,
      backgroundColor: focused ? '#F2C40C' : '#1EBA60',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    }}
  >
    <Image
      source={iconSource}
      style={{
        width: width * 0.05,
        height: width * 0.05,
        tintColor: '#fff',
      }}
      resizeMode="contain"
    />
  </View>
  <Text
    style={{
      fontSize: width * 0.03,
      color: focused ? '#F2C40C' : '#999',
      width: width * 0.18,
      textAlign: 'center',
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
