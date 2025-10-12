// RequestScreen.tsx
import UserBoarder from '@/src/components/layout/UserBoarder';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChooseRole from './RequestingForm/ChooseRole';
import StartForm from './RequestingForm/StartForm';


export default function RequestScreen() {

  const {
        Requestnavigation,
        formData,
        steps,
        setFormData,
        handleChange,
        setSteps
    } = useRequest();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
        <UserBoarder />

        {
          steps === 0 && (
              <StartForm setSteps={setSteps}/>
          )
        }

        {
          steps === 1 && (
              <ChooseRole setSteps={setSteps}/>
          )
        }

      </View>
    </SafeAreaView>
  );
}
