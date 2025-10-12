import IconButton from '@/src/components/buttons/IconButton';
import Card from '@/src/components/cards/Card';
import UserBoarder from '@/src/components/layout/UserBoarder';
import { useProfile } from '@/src/hooks/appTabHooks/useProfile';
import React from 'react';
import { Image, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from './ProfileStyle';



export default function AppSettingsScreen() {

  const {
    accountInfo,
    passwords,
    deviceFunction,
    setAccountInfo,
    setPasswords,
    setDeviceFunction,
    onGoToAppSettings,
    onGoToProfile
  } = useProfile();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B", position: 'relative' }} edges={['top']}>
      <View style={ style.container }>
        <UserBoarder />
        <View style={style.Header}>
          <IconButton 
          icon={require('../../../assets/icons/ArrowBack.png')}
          onPress={() => onGoToProfile()}
          />
          <Text style={style.Headertext}>App Settings</Text>
        </View>
        <View style={style.mainContainer}>
         <Card  style={style.cardInput}>  
            <View style={style.switchCont}>  
              <Image source={require('../../../assets/icons/notifbell.png')} style={style.iconImage} />
              <Text style={style.switchText}>Notifications</Text>
              <Switch
                value={deviceFunction.notification}
                onValueChange={(value) => setDeviceFunction({ ...deviceFunction, notification: value })}
                trackColor={{ false: '#ccc', true: '#F6F6F6'}}
                thumbColor={deviceFunction.notification ? '#19AF5B' : '#fff'}
              />
            </View>
            <View style={style.switchCont}>  
              <Image source={require('../../../assets/icons/folder.png')} style={style.iconImage} />
              <Text style={style.switchText}>Media Access</Text>
              <Switch
                value={deviceFunction.media}
                onValueChange={(value) => setDeviceFunction({ ...deviceFunction, media: value })}
                trackColor={{ false: '#ccc', true: '#F6F6F6'}}
                thumbColor={deviceFunction.media? '#19AF5B' : '#fff'}
              />
            </View>
            <View style={style.switchCont}>  
              <Image source={require('../../../assets/icons/mobileData.png')} style={style.iconImage} />
              <Text style={style.switchText}>Mobile Data</Text>
              <Switch
                value={deviceFunction.mobileData}
                onValueChange={(value) => setDeviceFunction({ ...deviceFunction, mobileData: value })}
                trackColor={{ false: '#ccc', true: '#F6F6F6'}}
                thumbColor={deviceFunction.mobileData ? '#19AF5B' : '#fff'}
              />
            </View>
         </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
