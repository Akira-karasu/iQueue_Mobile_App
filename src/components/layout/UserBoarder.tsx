import type { AppStackParamList, AppTabsParamList } from '@/src/types/navigation';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../buttons/IconButton';


type UserBoarderProp = BottomTabNavigationProp<AppTabsParamList, 'Home'>;

type NavProp = NativeStackNavigationProp<AppStackParamList, 'Tabs'>;



export default function UserBoarder() {

  const AppTabnavigation = useNavigation<UserBoarderProp>();
  const AppStacknavigation = useNavigation<NavProp>();


  return (
     <View style={styles.container}>
      <View style={styles.userContainer}>
        <IconButton
          icon={require('../../../assets/icons/boy.png')}
          onPress={() => AppTabnavigation.navigate('ProfileStack')}
          style={styles.image}
        />
        <Text style={styles.title}>
          Welcome User!
        </Text>
      </View>
      <IconButton
        icon={require('../../../assets/icons/notifications.png')}
        onPress={() => AppStacknavigation.navigate('NotificationStack')}
        count={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
     container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#19AF5B',
        width: '100%',
    },
    image: {
        width: 40,
        height: 40,        
        borderColor: '#73B46D',
        borderRadius: 60,
        borderWidth: 2,
        marginRight: 15,
        backgroundColor: '#fff',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
 
});