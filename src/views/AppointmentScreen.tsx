import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlumniForm, CancelModal, ChooseRole, OfficeTransaction, StudentForm, VisitorForm } from '../components/forms/AppointmentForm';
import UserBoarder from '../components/UserBoarder';
import ViewScroller from '../components/ViewScroller';

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

const payment = [
  {
    PaymentFees: 'School books',
    Price: 300.00
  },
  {
    PaymentFees: 'Tuition Fee',
    Price: 5000.00
  },
  {
    PaymentFees: 'Miscellaneous Fee',
    Price: 2500.00
  },
  {
    PaymentFees: 'Testing Fee',
    Price: 1000.00
  }
]




export default function AppointmentScreen() {

  
  
  // Step state
  const [step, setStep] = React.useState(1);

  const navigation = useNavigation();

  const [accountingPayment, setAccountingPayment] = React.useState(payment);

  const [registrarDocuments, setRegistrarDocuments] = React.useState(documents);


  // Form input state
  const [VisitorNameValue, setVisitorNameValue] = React.useState('');
  const [StudentNameValue, setStudentNameValue] = React.useState('');
  const [StudentLrnNumber, setLrnNumberValue] = React.useState('');
  const [StudentYearLevel, setYearLevelValue] = React.useState('');
  const [StudentGradeLevel, setGradeLevelValue] = React.useState('');
  const [StudentSection, setSectionValue] = React.useState('');
  const [Transaction, setTransactionValue] = React.useState({});

  
  const [registrarOffice, setTransactionRegistrar] = React.useState(
    {
        Transction: "Document Request",
        requestedDocument: [],
        total: 0
    }
);

  const [accountingOffice, setTransactionAccounting] = React.useState(
    {
        Transction: "Payment",
        requestedPayment: [],
        total: 0
    }
);

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleCancel = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);


   const resetTransaction = () => {
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

        setAccountingPayment(payment);

        setTransactionAccounting(prev => ({
            ...prev,
            requestedPayment: [],
            total: 0
        }))

        setTransactionValue({
            ...registrarOffice,
            requestedDocument: [],
            total: 0,
            ...accountingOffice,
            requestedPayment: [],
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
    transaction: {},
    });
    setModalVisible(false);
    setStep(1);
    navigation.navigate('Home');
    resetTransaction();

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
    transaction: {},
  });

  const handleChange = (field, value) => {
    setFormData(prev => {
      if (field === 'role' && prev.role !== value) {
        // Reset other fields if role changes
        return { role: value, visitorName: "", studentName: "", studentLrnNumber: "", studentYearLevel: "", studentGradeLevel: "", studentSection: "", transaction: {} };
      }
      return { ...prev, [field]: value };
    });
  };

  const Debug = () => {
    console.log("Step:", step);
    console.log("Form Data:");
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    console.log('\n');

    Object.entries(registrarOffice).forEach(([key, value]) => {
      if (key === 'requestedDocument' && Array.isArray(value)) {
        console.log(`${key}:`);
        value.forEach((doc, index) => {
          console.log(`  Reuqest Document ${index + 1}:`, doc);
        });
      } else {
        console.log(`${key}:`, value);
      }
    });

    console.log('\n');

    Object.entries(accountingOffice).forEach(([key, value]) => {
      if (key === 'requestedPayment' && Array.isArray(value)) {
        console.log(`${key}:`);
        value.forEach((pay, index) => {
          console.log(`  Request Payment ${index + 1}:`, pay);
        });
      } else {
        console.log(`${key}:`, value);
      }
    });


  }





  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <UserBoarder/>

      {step === 1 && (
          <ChooseRole 
            onChange={handleChange}
            onNext={() => setStep(2)}
            selectedRole={formData.role}
        />
        )}


      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >

      <ViewScroller >

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
          <>
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
          <CancelModal
            modalvisible={modalVisible}
            onBack={handleCloseModal}
            onConfirmCancel={handleCancelAppointment}
          />
          </>
        )}

        

        {step === 3 && (
          <>
          
            <OfficeTransaction
              onBack={() => setStep(2)}
              handleCancel={handleCancel}
              transactionValue={formData.transaction}
              setTransactionValue={val => handleChange('transaction', val)}


              registrarDocuments={registrarDocuments}
              setRegistrarDocuments={setRegistrarDocuments}
              registrarOffice={registrarOffice}
              setTransactionRegistrar={setTransactionRegistrar}

              accountingPayment = {accountingPayment}
              setAccountingPayment = {setAccountingPayment}
              accountingOffice = {accountingOffice}
              setTransactionAccounting = {setTransactionAccounting}
            />
          <CancelModal
            modalvisible={modalVisible}
            onBack={handleCloseModal}
            onConfirmCancel={handleCancelAppointment}
          />
          </>
        )}


        {/* steps in transaction process */}

        
        

        <Button title="Debug" onPress={Debug}  />
      </ViewScroller>
      </KeyboardAvoidingView>
    </View>
    </SafeAreaView>
  );
}