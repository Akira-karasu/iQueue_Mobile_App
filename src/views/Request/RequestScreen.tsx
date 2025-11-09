// RequestScreen.tsx
import TransactionCost from '@/src/components/layout/TransactionCost';
import UserBoarder from '@/src/components/layout/UserBoarder';
import CancelTransaction from '@/src/components/modals/CancelTransaction';
import SubmitTransaction from '@/src/components/modals/SubmidModal';
import { useAuth } from "@/src/context/authContext";
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import useModal from '@/src/hooks/componentHooks/useModal';
import { useRequestStore } from '@/src/store/requestStore';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequestForm from './RequestingForm/RequestForm';
import StartForm from './RequestingForm/StartForm';
import StudentForm from './RequestingForm/StudentForm';

export default function RequestScreen() {

  const {
        Requestnavigation,
        formData,
        steps,
        handleDebug,
        handleChange,
        setSteps,
        handleSubmitTransaction,
        handleResetTransaction
    } = useRequest();

    const cancelModal = useModal();
    const submitModal = useModal();

    const { getUserEmail } = useAuth();
    const email = getUserEmail();
    const setFormData = useRequestStore((state) => state.setFormData);

    

    React.useEffect(() => {
      if (email) {
        setFormData((prev) => ({
          ...prev,
          email: email, // example usage
        }));
      }
    }, [email]);

    React.useEffect(() => {
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

        {/* {
          steps === 1 && (
              <ChooseRole 
                setSteps={setSteps} 
                open={cancelModal.open} 
                step={steps}
                selectedRole={formData.role}
                handleChange={handleChange}
              />
          )
          
        } */}

        {
          steps === 1 && (
            <StudentForm 
              setSteps={setSteps} 
              open={cancelModal.open} 
              step={steps}
              />
          )
        }

        {/* {
          steps === 2 && formData.role === "Alumni" && (
            <AlumniForm 
              setSteps={setSteps} 
              open={cancelModal.open} 
              step={steps}
              studentName={formData.studentName}
              studentLrnNumber={formData.studentLrnNumber}
              studentYearLevel={formData.studentYearLevel}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          ) 
        } */}

        {/* {
          steps === 2 && formData.role === "Visitor" && (
            <VisitorForm 
              setSteps={setSteps} 
              open={cancelModal.open} 
              step={steps}
              visitorName={formData.visitorName}
              studentName={formData.studentName}
              studentLrnNumber={formData.studentLrnNumber}
              studentYearLevel={formData.studentYearLevel}
              studentGradeLevel={formData.studentGradeLevel}
              studentSection={formData.studentSection}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )
        } */}

      {
        steps === 2 && (
          <>
            <RequestForm 
              setSteps={setSteps} 
              step={steps}
            />
            <TransactionCost
              // TransactionCo st={formData.TotalCost}
              openCancel={cancelModal.open} 
              openSubmit={submitModal.open}
            />
          </>
        )
      }

        <CancelTransaction visible={cancelModal.visible} onClose={cancelModal.close} handleResetTransaction={() => handleResetTransaction(cancelModal.close)}/>
        <SubmitTransaction visible={submitModal.visible} onClose={submitModal.close} handleSubmitTransaction={() => handleSubmitTransaction(submitModal.close)}/>

      

      
      </View>
    </SafeAreaView>
    
  );
}