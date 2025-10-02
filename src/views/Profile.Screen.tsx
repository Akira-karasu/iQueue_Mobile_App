import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import UserBoarder from '../components/UserBoarder';
import ViewScroller from '../components/ViewScroller';


export default function ProfileScreen() {

  const [subPage, setSubPage] = React.useState(null);

  const [accountInfo, setAccountInfo] = React.useState({
    accountID: "31245433",
    email: "user010@gmail.com",
  });

  const [passwords, setPasswords] = React.useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [deviceFunction, setDeviceFunction] = React.useState({
    notification: false,
    media: false,
    mobileData: false,
  });


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B", position: 'relative' }} edges={['top']}>

    {!subPage ? (
      <View style={ style.container }>
           <Image source={require('../../assets/icons/shapeCircle.png')} style={style.shapeCircleImage} />

        <View style={style.profileContainer}>
          <Image source={require('../../assets/icons/boy.png')} style={style.Profileimage}/>
          <View>
            <Text style={style.userName}>Jose P. Rizal</Text>
            <Text style={style.userId}>ID: 31245433</Text>
          </View>
          <View style={style.containerButton}>
             <Pressable 
              style={style.pressableButton}
              onPress={() => setSubPage("Account Settings")}
             >
                <Image source={require('../../assets/icons/profileCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>Account Settings</Text>
             </Pressable>
             <Pressable 
               style={style.pressableButton}
               onPress={() => setSubPage("App Settings")}>
                <Image source={require('../../assets/icons/settingsCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>App Settings</Text>
             </Pressable>
             <Pressable style={style.pressableButton}>
                <Image source={require('../../assets/icons/LogoutCirc.png')} style={style.iconImage} />
                <Text style={style.pressableText}>Logout</Text>
             </Pressable>
          </View>
        </View>
    </View>
    ) : null}


    {subPage === "Account Settings" && (
      <View style={ style.container }>
        <UserBoarder />
        <KeyboardAvoidingView style={{ flex: 1 }}
          behavior={Platform.OS === "android" ? "padding" : "height"}
        >
        <ViewScroller>
        <View style={style.Header}>
          <IconButton 
          icon={require('../../assets/icons/ArrowBack.png')}
          size={30}
          onPress={() => setSubPage(null)}
          />
          <Text style={style.Headertext}>Account Settings</Text>
        </View>
        <View style={style.mainContainer}>
          <Card style={style.cardInput}>
            <Text style={style.cardText}>Account Information</Text>
            <Input
                label="Account ID"
                value={accountInfo.accountID}
                editable={false}
            />
            <Input
              label="Email Address"
              value={accountInfo.email}
              onChangeText={(text) => setAccountInfo({ ...accountInfo, email: text })}
              keyboardType='email-address'
              required
            />
            <Button title="Update contact" fontSize={20} onPress={() => {}} />
          </Card>
          <Card  style={style.cardInput}>
            <Text style={style.cardText}>Change Password</Text>
            <Input
              label="Current Password"
              value={passwords.current}
              onChangeText={(text) => setPasswords({ ...passwords, current: text })}
              keyboardType='default'
              secureTextEntry = {true}
              showPasswordToggle = {true}
              editable={true}
              required
            />

            <Input
              label="New Password"
              value={passwords.new}
              onChangeText={(text) => setPasswords({ ...passwords, new: text })}
              keyboardType='default'
              secureTextEntry = {true}
              showPasswordToggle = {true}
              editable={true}
            />

            <Input
              label="Re-enter Password"
              value={passwords.confirm}
              onChangeText={(text) => setPasswords({ ...passwords, confirm: text })}
              keyboardType='default'
              secureTextEntry = {true}
              showPasswordToggle = {true}
              editable={true}
            />

            <Button title="Change password" fontSize={20} onPress={() => {}} />
          </Card>
          
        </View>
        
        
      </ViewScroller>
      </KeyboardAvoidingView>

      </View>
    )}

    {subPage === "App Settings" && (
      <View style={ style.container }>
        <UserBoarder />
        <View style={style.Header}>
          <IconButton 
          icon={require('../../assets/icons/ArrowBack.png')}
          size={30}
          onPress={() => setSubPage(null)}
          />
          <Text style={style.Headertext}>App Settings</Text>
        </View>
        <View style={style.mainContainer}>
         <Card  style={style.cardInput}>  
            <View style={style.switchCont}>  
              <Image source={require('../../assets/icons/notifbell.png')} style={style.iconImage} />
              <Text style={style.switchText}>Notifications</Text>
              <Switch
                value={deviceFunction.notification}
                onValueChange={(value) => setDeviceFunction({ ...deviceFunction, notification: value })}
                trackColor={{ false: '#ccc', true: '#F6F6F6'}}
                thumbColor={deviceFunction.notification ? '#19AF5B' : '#fff'}
              />
            </View>
            <View style={style.switchCont}>  
              <Image source={require('../../assets/icons/folder.png')} style={style.iconImage} />
              <Text style={style.switchText}>Media Access</Text>
              <Switch
                value={deviceFunction.media}
                onValueChange={(value) => setDeviceFunction({ ...deviceFunction, media: value })}
                trackColor={{ false: '#ccc', true: '#F6F6F6'}}
                thumbColor={deviceFunction.media? '#19AF5B' : '#fff'}
              />
            </View>
            <View style={style.switchCont}>  
              <Image source={require('../../assets/icons/mobileData.png')} style={style.iconImage} />
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
    )}


    </SafeAreaView>
  );
}


const style = StyleSheet.create({

  switchText:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AEAEAE',
    width: '60%',
  },

  switchCont:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  cardText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19AF5B',
  },

  cardInput:{
    flexDirection: 'column',
    gap: 15,
  },

  mainContainer:{
    flexGrow: 1,
    width: '100%',
    padding: 25,

  },

  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
  },

  Headertext:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#19AF5B',
    textAlign: 'center',
    width: '90%',
  },
  

  iconImage: {
    width: 35,
    height: 35

  },

  pressableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19AF5B',
    textAlign: 'center',
    width: '100%',
  },

  pressableButton:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 10,
  },

  containerButton:{
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 50,
    width: '80%',
    paddingHorizontal: 10,
    gap: 15
  },

  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F9F9F9",

  },

  shapeCircleImage: {
    position: 'absolute',
    top: -220,
    left: 0,
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
    zIndex: 1,
  },

  Profileimage: {
        width: 150,
        height: 150,        
        borderColor: '#73B46D',
        borderRadius: 100,
        borderWidth: 5,
        backgroundColor: '#fff',
    },
  userName: {
    fontSize: 35,
    fontWeight: '600',
    marginTop: 10,
    color: '#19AF5B',
    textAlign: 'center',
  },

  userId: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
    color: '#9A9A9A',
    textAlign: 'center',
  },

  profileContainer: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  }

});