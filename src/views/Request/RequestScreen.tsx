// RequestScreen.tsx
import UserBoarder from '@/src/components/layout/UserBoarder';
import CancelTransaction from '@/src/components/modals/CancelTransaction';
import SubmitTransaction from '@/src/components/modals/SubmidModal';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import useModal from '@/src/hooks/componentHooks/useModal';
import React, { useEffect } from 'react';
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
        handleDebug,
        handleChange,
        setSteps
    } = useRequest();

    const cancelModal = useModal();
    const submitModal = useModal();

    useEffect(() => {
        handleDebug();
    }, [handleDebug]);

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
              <ChooseRole 
                setSteps={setSteps} 
                open={cancelModal.open} 
                step={steps}
                selectedRole={formData.role}
                handleChange={handleChange}
              />
          )
          
        }

        <CancelTransaction visible={cancelModal.visible} onClose={cancelModal.close} handleResetTransaction={() => {}}/>
        <SubmitTransaction visible={submitModal.visible} onClose={submitModal.close} handleSubmitTransaction={() => {}}/>
      </View>
    </SafeAreaView>
  );
}
