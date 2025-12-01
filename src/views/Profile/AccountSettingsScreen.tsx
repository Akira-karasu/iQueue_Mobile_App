import Button from '@/src/components/buttons/Button';
import IconButton from '@/src/components/buttons/IconButton';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import UserBoarder from '@/src/components/layout/UserBoarder';
import ViewScroller from '@/src/components/scroller/ViewScroller';
import { useProfile } from '@/src/hooks/appTabHooks/useProfile';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import style from './ProfileStyle';

export default function AccountSettingsScreen() {
  const {
    accountInfo,
    passwords,
    editedEmail,
    setEditedEmail,
    handleChangeEmail,
    setPasswords,
    onGoToProfile,
  } = useProfile();

    // ✅ Create a handler that passes the email
  const handleUpdateEmail = useCallback(() => {
    console.log("🔘 Button pressed, email:", editedEmail);
    handleChangeEmail(editedEmail);
  }, [editedEmail, handleChangeEmail]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B", position: 'relative' }} edges={['top']}>
      <View style={style.container}>
        <UserBoarder />

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "android" ? "padding" : "height"}>
          <ViewScroller showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

            {/* Header */}
            <View style={style.Header}>
              <IconButton icon={require('../../../assets/icons/ArrowBack.png')} onPress={onGoToProfile} />
              <Text style={style.Headertext}>Account Settings</Text>
            </View>

            {/* Account Info */}
            <View style={style.mainContainer}>
              <Card style={style.cardInput}>
                <Text style={style.cardText}>Account Information</Text>

                <Input label="Account ID" value={accountInfo.accountID} editable={false} />

                <Input
                  label="Email Address"
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  keyboardType="email-address"
                  editable
                  required
                />

                <Button title="Update contact" fontSize={20} onPress={handleUpdateEmail} />
              </Card>

              {/* Password Change */}
              <Card style={style.cardInput}>
                <Text style={style.cardText}>Change Password</Text>

                <Input label="Current Password" value={passwords.current} onChangeText={text => setPasswords(prev => ({ ...prev, current: text }))} secureTextEntry showPasswordToggle />
                <Input label="New Password" value={passwords.new} onChangeText={text => setPasswords(prev => ({ ...prev, new: text }))} secureTextEntry showPasswordToggle />
                <Input label="Re-enter Password" value={passwords.confirm} onChangeText={text => setPasswords(prev => ({ ...prev, confirm: text }))} secureTextEntry showPasswordToggle />

                <Button title="Change password" fontSize={20} onPress={() => {}} />
              </Card>
            </View>

          </ViewScroller>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
