// RequestScreen.tsx
import TransactionCost from '@/src/components/layout/TransactionCost';
import UserBoarder from '@/src/components/layout/UserBoarder';
import CancelTransaction from '@/src/components/modals/CancelTransaction';
import SubmitTransaction from '@/src/components/modals/SubmidModal';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import useModal from '@/src/hooks/componentHooks/useModal';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlumniForm from './RequestingForm/AlumniForm';
import ChooseRole from './RequestingForm/ChooseRole';
import RequestForm from './RequestingForm/RequestForm';
import StartForm from './RequestingForm/StartForm';
import StudentForm from './RequestingForm/StudentForm';
import VisitorForm from './RequestingForm/VisitorForm';


export default function RequestScreen() {

  const {
        Requestnavigation,
        formData,
        steps,
        setFormData,
        handleDebug,
        handleChange,
        setSteps,
        handleSubmitTransaction,
        handleResetTransaction
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

        {
          steps === 2 && formData.role === "Student" && (
            <StudentForm 
              setSteps={setSteps} 
              open={cancelModal.open} 
              step={steps} 
              studentName={formData.studentName}
              studentLrnNumber={formData.studentLrnNumber}
              studentYearLevel={formData.studentYearLevel}
              studentGradeLevel={formData.studentGradeLevel}
              studentSection={formData.studentSection}
              setFormData={setFormData} 
              handleChange={handleChange}/>
          )
        }

        {
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
        }

        {
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
        }

      {
        steps === 3 && (
          <>
            <RequestForm 
              setSteps={setSteps} 
              step={steps}
            />
            <TransactionCost
              TransactionCost={formData.TotalCost}
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
