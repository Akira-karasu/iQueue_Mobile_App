
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, Image, Text, View } from 'react-native';
import { AppTabsParamList } from '../types/navigation';
import HomeStack from '../views/Home/HomeStack';
import ProfileStack from '../views/Profile/ProfileStack';
import RequestScreen from '../views/Request/RequestScreen';


const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
  return (
    <>
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

          if (route.name === "HomeStack") {
            iconSource = require('../../assets/icons/home.png');
            label = 'Home';
          } else if (route.name === 'Request') {
            iconSource = require('../../assets/icons/request.png');
            label = 'Request';
          } else if (route.name === 'ProfileStack') {
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
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Request" component={RequestScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>

  </>
  );
}
