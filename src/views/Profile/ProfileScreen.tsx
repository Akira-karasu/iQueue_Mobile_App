import { useProfile } from '@/src/hooks/appTabHooks/useProfile';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from './ProfileStyle';


export default function ProfileScreen() {

  const { onGoToAccountSettings, onGoToAppSettings  } = useProfile();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B", position: 'relative' }} edges={['top']}>
      <View style={ style.container }>
           <Image source={require('../../../assets/icons/shapeCircle.png')} style={style.shapeCircleImage} />

        <View style={style.profileContainer}>
          <Image source={require('../../../assets/icons/boy.png')} style={style.Profileimage}/>
          <View>
            <Text style={style.userName}>Jose P. Rizal</Text>
            <Text style={style.userId}>ID: 31245433</Text>
          </View>
          <View style={style.containerButton}>
             <Pressable 
              style={style.pressableButton}
              onPress={() => onGoToAccountSettings()}
             >
                <Image source={require('../../../assets/icons/profileCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>Account Settings</Text>
             </Pressable>
             <Pressable 
               style={style.pressableButton}
               onPress={() => onGoToAppSettings()}>
                <Image source={require('../../../assets/icons/settingsCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>App Settings</Text>
             </Pressable>
             <Pressable style={style.pressableButton}>
                <Image source={require('../../../assets/icons/LogoutCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>Logout</Text>
             </Pressable>
          </View>
        </View>
    </View>

    </SafeAreaView>
  );
}
