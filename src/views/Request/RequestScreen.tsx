import TransactionCost from '@/src/components/layout/TransactionCost';
import UserBoarder from '@/src/components/layout/UserBoarder';
import CancelTransaction from '@/src/components/modals/CancelTransaction';
import SubmitTransaction from '@/src/components/modals/SubmidModal';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import useModal from '@/src/hooks/componentHooks/useModal';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestForm from './RequestingForm/RequestForm';
import StartForm from './RequestingForm/StartForm';
import StudentForm from './RequestingForm/StudentForm';
import { useAuth } from "@/src/context/authContext";

export default function RequestScreen() {

  const {
        steps,
        setSteps,
        formData,
        handleDebug,
        handleSubmitTransaction,
        handleResetTransaction
    } = useRequest();

    const cancelModal = useModal();
    const submitModal = useModal();

    const { getUserEmail } = useAuth();
    const email = getUserEmail();

    const { setFormData } = useRequest(); // useRequest already exposes setFormData

    useEffect(() => {
      if (email) {
        // Correctly update the store using useRequest's setFormData
        setFormData(prev => ({ ...prev, email }));
      }
    }, [email, setFormData]);

    useEffect(() => {
      handleDebug();
    }, [handleDebug]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
        <UserBoarder />

        {steps === 0 && <StartForm setSteps={setSteps}/>}

        {steps === 1 && (
          <StudentForm 
            setSteps={setSteps} 
            open={cancelModal.open} 
            step={steps} 
          />
        )}

        {steps === 2 && (
          <>
            <RequestForm setSteps={setSteps} step={steps} />
            <TransactionCost
              openCancel={cancelModal.open} 
              openSubmit={submitModal.open}
            />
          </>
        )}

        <CancelTransaction 
          visible={cancelModal.visible} 
          onClose={cancelModal.close} 
          handleResetTransaction={() => handleResetTransaction(cancelModal.close)}
        />
        <SubmitTransaction 
          visible={submitModal.visible} 
          onClose={submitModal.close} 
          handleSubmitTransaction={() => handleSubmitTransaction(submitModal.close)}
        />
      </View>
    </SafeAreaView>
  );
}
