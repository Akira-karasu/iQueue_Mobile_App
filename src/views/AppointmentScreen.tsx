import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, View } from 'react-native';
import UserBoarder from '../components/UserBoarder';
import { AlumniForm, CancelModal, ChooseRole, OfficeTransaction, StudentForm, VisitorForm } from '../components/forms/AppointmentForm';


export default function AppointmentScreen() {

  const documents = [
  {
    DocumentName: "Certificate of Candidacy for Completion",
    Price: 150.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "Certificate of Enrollment",
    Price: 150.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "Copy of Diploma (For Graduates Only)",
    Price: 500.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "Form 137 / School Form 10",
    Price: 300.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "Good Moral Certificate",
    Price: 150.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "ESC Certificate",
    Price: 150.00,
    Purpose: "",
    Quantity: 0,
  },
  {
    DocumentName: "Certification Authentication Verification",
    Price: 700.00,
    Purpose: "",
    Quantity: 0,
  },
];
  
  // Step state
  const [step, setStep] = React.useState(1);

  const navigation = useNavigation();


  // Form input state
  const [VisitorNameValue, setVisitorNameValue] = React.useState('');
  const [StudentNameValue, setStudentNameValue] = React.useState('');
  const [StudentLrnNumber, setLrnNumberValue] = React.useState('');
  const [StudentYearLevel, setYearLevelValue] = React.useState('');
  const [StudentGradeLevel, setGradeLevelValue] = React.useState('');
  const [StudentSection, setSectionValue] = React.useState('');
  const [Transaction, setTransactionValue] = React.useState([]);
  const [TotalCost, setTotalCost] = React.useState(0);

  const [registrarDocuments, setRegistrarDocuments] = React.useState(documents);
  
  const [registrarOffice, setTransactionRegistrar] = React.useState(
    {
        Office: "Registrar Office",
        Transction: "Document Request",
        requestedDocument: [],
        total: 0
    }
);

  const [accountingOffice, setTransactionAccounting] = React.useState(
    {
        Office: "Accounting Office",
        Transction: "Document Request",
        requestedDocument: [],
        total: 0
    }
);

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleCancel = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

   const resetRegistrarDocuments = () => {
        const resetDocs = registrarDocuments.map(doc => ({
            ...doc,
            Quantity: 0,
            Purpose: "",
        }));
        setRegistrarDocuments(resetDocs);

        setTransactionRegistrar(prev => ({
            ...prev,
            requestedDocument: [],
            total: 0,
        }));
        setTransactionValue({
            ...registrarOffice,
            requestedDocument: [],
            total: 0,
        });
    };

  const handleCancelAppointment = () => {
    // Reset appointment state here if needed
    setFormData({ 
    role: "",
    visitorName: "",
    studentName: "",
    studentLrnNumber: "",
    studentYearLevel: "",
    studentGradeLevel: "",
    studentSection: "",
    transaction: [],
    totalCost: 0,
    });
    setModalVisible(false);
    setStep(1);
    navigation.navigate('Home');
    resetRegistrarDocuments();

  };

  // Form data state
  const [formData, setFormData] = React.useState({
    role: "",
    visitorName: "",
    studentName:  "",
    studentLrnNumber: "",
    studentYearLevel: "",
    studentGradeLevel: "",
    studentSection: "",
    transaction: [],
    totalCost: 0,
  });

  const handleChange = (field, value) => {
    setFormData(prev => {
      if (field === 'role' && prev.role !== value) {
        // Reset other fields if role changes
        return { role: value, visitorName: "", studentName: "", studentLrnNumber: "", studentYearLevel: "", studentGradeLevel: "", studentSection: "", transaction: [], totalCost: 0 };
      }
      return { ...prev, [field]: value };
    });
  };

  const Debug = () => {
    console.log(formData);
    console.log(step);
    console.log(formData.transaction.requestedDocument);
  }





  return (
    <View style={{ flex: 1 }}>
      <UserBoarder/>

      {step === 1 && (
        <ChooseRole 
          onChange={handleChange}
          onNext={() => setStep(2)}
          selectedRole={formData.role}
       />
      )}

      {step === 2 && formData.role === "Student" && (
        <>
          <StudentForm  
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}    
          StudentNameValue={formData.studentName}
          setStudentNameValue={val => handleChange('studentName', val)}
          StudentLrnNumber={formData.studentLrnNumber}
          setLrnNumberValue={val => handleChange('studentLrnNumber', val)}
          StudentYearLevel={formData.studentYearLevel}
          setYearLevelValue={val => handleChange('studentYearLevel', val)}
          StudentGradeLevel={formData.studentGradeLevel}
          setGradeLevelValue={val => handleChange('studentGradeLevel', val)}
          StudentSection={formData.studentSection}
          setSectionValue={val => handleChange('studentSection', val)}
          handleCancel={handleCancel}
        />
        <CancelModal
          modalvisible={modalVisible}
          onBack={handleCloseModal}
          onConfirmCancel={handleCancelAppointment}
        />
        </>
      )}

      {step === 2 && formData.role === "Visitor" && (
        
        <>
          <VisitorForm 
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}  
          VisitorNameValue={formData.visitorName}
          setVisitorNameValue={val => handleChange('visitorName', val)}
          StudentNameValue={formData.studentName}
          setStudentNameValue={val => handleChange('studentName', val)}
          StudentLrnNumber={formData.studentLrnNumber}
          setLrnNumberValue={val => handleChange('studentLrnNumber', val)}
          StudentYearLevel={formData.studentYearLevel}
          setYearLevelValue={val => handleChange('studentYearLevel', val)}
          StudentGradeLevel={formData.studentGradeLevel}
          setGradeLevelValue={val => handleChange('studentGradeLevel', val)}
          StudentSection={formData.studentSection}
          setSectionValue={val => handleChange('studentSection', val)}
          handleCancel={handleCancel}
        />
        <CancelModal
          modalvisible={modalVisible}
          onBack={handleCloseModal}
          onConfirmCancel={handleCancelAppointment}
        />
        </>
      )}

      {step === 2 && formData.role === "Alumni" && (
        <AlumniForm 
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}  
          StudentNameValue={formData.studentName}
          setStudentNameValue={val => handleChange('studentName', val)}
          StudentLrnNumber={formData.studentLrnNumber}
          setLrnNumberValue={val => handleChange('studentLrnNumber', val)}
          StudentYearLevel={formData.studentYearLevel}
          setYearLevelValue={val => handleChange('studentYearLevel', val)}
          handleCancel={handleCancel}
        />
      )}

      {step === 3 && (
        <>
          <OfficeTransaction
            onBack={() => setStep(2)}
            handleCancel={handleCancel}
            transactionValue={formData.transaction}
            setTransactionValue={val => handleChange('transaction', val)}
            totalCostValue={formData.totalCost}
            setTotalCostValue={val => handleChange('totalCost', val)}
            registrarDocuments={registrarDocuments}
            setRegistrarDocuments={setRegistrarDocuments}
            registrarOffice={registrarOffice}
            setTransactionRegistrar={setTransactionRegistrar}
          />
         <CancelModal
          modalvisible={modalVisible}
          onBack={handleCloseModal}
          onConfirmCancel={handleCancelAppointment}
        />
        </>
      )}




      
      <Button title="Debug" onPress={Debug}  />

    </View>
  );
}