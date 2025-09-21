import React from 'react';
import { View, Text, Button} from 'react-native';
import UserBoarder from '../components/UserBoarder';
import { ChooseRole, StudentForm, AlumniForm, VisitorForm } from '../components/forms/AppointmentForm';



export default function AppointmentScreen() {
  const [step, setStep] = React.useState(1);

  const [formData, setFormData] = React.useState({
    role: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const Debug = () => {
    console.log(formData);
    console.log(step);
  }


  return (
    <View style={{ flex: 1 }}>
      <UserBoarder/>

      {step === 1 && (
        <ChooseRole 
          data={formData} 
          onChange={handleChange}
          onNext={() => setStep(2)}
       />
      )}

      {step === 2 && formData.role === "Student" && (
        <StudentForm  onBack={() => setStep(1)}/>
      )}

      {step === 2 && formData.role === "Visitor" && (
        <VisitorForm onBack={() => setStep(1)}/>
      )}

      {step === 2 && formData.role === "Alumni" && (
        <AlumniForm onBack={() => setStep(1)}/>
      )}


      
      <Button title="Debug" onPress={Debug}  />

    </View>
  );
}