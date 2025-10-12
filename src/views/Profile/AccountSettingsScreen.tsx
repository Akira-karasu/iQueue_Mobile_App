import Button from '@/src/components/buttons/Button';
import IconButton from '@/src/components/buttons/IconButton';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import UserBoarder from '@/src/components/layout/UserBoarder';
import ViewScroller from '@/src/components/scroller/ViewScroller';
import { useProfile } from '@/src/hooks/appTabHooks/useProfile';
import React from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from './ProfileStyle';


export default function AccountSettingsScreen() {

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
        <KeyboardAvoidingView style={{ flex: 1 }}
          behavior={Platform.OS === "android" ? "padding" : "height"}
        >
        <ViewScroller 
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
        <View style={style.Header}>
          <IconButton 
          icon={require('../../../assets/icons/ArrowBack.png')}
          onPress={() => onGoToProfile()}
          />
          <Text style={style.Headertext}>Account Settings</Text>
        </View>
        <View style={style.mainContainer}>
          <Card style={style.cardInput}>
            <Text style={style.cardText}>Account Information</Text>
            <Input
                label="Account ID"
                onChangeText={(text) => setAccountInfo({ ...accountInfo, accountID: text })}
                value={accountInfo.accountID}
                editable={false}
            />
            <Input
              label="Email Address"
              value={accountInfo.email}
              onChangeText={(text) => setAccountInfo({ ...accountInfo, email: text })}
              keyboardType='email-address'
              editable={true}
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
    </SafeAreaView>
  );
}
