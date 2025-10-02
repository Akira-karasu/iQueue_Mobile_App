import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../Button';
import Card from '../Card';
import CustomRadioButton from '../CustomRadioButton';
import IconButton from '../IconButton';
import Input from '../Input';
import Modals from '../Modal';
import CustomSelect from '../select';
import ToggleOfficeButton from '../ToggleOfficeButton';



    const roles = [
        { label: 'Student', value: 'Student', image: require('../../../assets/icons/Book.png') },
        { label: 'Visitor', value: 'Visitor', image: require('../../../assets/icons/User.png') },
        { label: 'Alumni', value: 'Alumni', image: require('../../../assets/icons/alumni.png') },
    ];


    
export function ChooseRole({ selectedRole, onChange, onNext }) {
    return (
        <View style={{ padding: 20 }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59' }}>
                    Choose Your Role
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10 }}>
                    Step 1 to 3
                </Text>
            </View>

            {roles.map(role => (
                <View key={role.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <CustomRadioButton
                        options={[role]}
                        value={selectedRole}
                        onValueChange={val => onChange('role', val)}
                        direction="row"
                        radioColor="#1EBA60"
                        uncheckedColor="#ccc"
                        imageSource={role.image}
                        imageStyle={{ width: 70, height: 70, marginRight: 8 }}
                    />
                </View>
            ))}
            <Button title="Next" onPress={() => onNext() } disabled={!selectedRole} />
        </View>
    );
}


const  yearLevels = [
        { label: '2025', value: '2025' },
        { label: '2024', value: '2024' },
        { label: '2023', value: '2023' },
        { label: '2022', value: '2022' },
        { label: '2021', value: '2021' },
        { label: '2020', value: '2020' },
    ];

const grades = [
        { label: 'Grade 1', value: 'Grade 1' },
        { label: 'Grade 2', value: 'Grade 2' },
        { label: 'Grade 3', value: 'Grade 3' },
        { label: 'Grade 4', value: 'Grade 4' },
        { label: 'Grade 5', value: 'Grade 5' },
        { label: 'Grade 6', value: 'Grade 6' },
        { label: 'Grade 7', value: 'Grade 7' },
        { label: 'Grade 8', value: 'Grade 8' },
        { label: 'Grade 9', value: 'Grade 9' },
        { label: 'Grade 10', value: 'Grade 10' },
        { label: 'Grade 11', value: 'Grade 11' },
        { label: 'Grade 12', value: 'Grade 12' },
    ];

const  section =  [
        { label: 'Section 1', value: 'Section 1' },
        { label: 'Section 2', value: 'Section 2' },
        { label: 'Section 3', value: 'Section 3' },
        { label: 'Section 4', value: 'Section 4' },
        { label: 'Section 5', value: 'Section 5' },
        { label: 'Section 6', value: 'Section 6' },
        { label: 'Section 7', value: 'Section 7' },
        { label: 'Section 8', value: 'Section 8' },
        { label: 'Section 9', value: 'Section 9' },
        { label: 'Section 10', value: 'Section 10' },
        { label: 'Section 11', value: 'Section 11' },
        { label: 'Section 12', value: 'Section 12' },
]


export function StudentForm({ onBack, onNext,

    StudentNameValue,
    setStudentNameValue,

    StudentLrnNumber,
    setLrnNumberValue,

    StudentYearLevel,
    setYearLevelValue,

    StudentGradeLevel,
    setGradeLevelValue,

    StudentSection,
    setSectionValue,

    handleCancel

 }){
    return (
        <View style={{ padding: 20 }}>
                    <View style={styles.Header}>
                        <IconButton onPress={onBack} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Personal Information
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 2 to 3
                            </Text>
                        </View>
                    </View>
                    

            <Card padding={25}>
                 <Input
                    label="Student Name"
                    placeholder="Enter Student Name"
                    value={StudentNameValue}
                    onChangeText={setStudentNameValue}
                    required
                />
                <Input
                    label="LRN"
                    placeholder="Enter Learner Reference Number"
                    value={StudentLrnNumber}
                    onChangeText={setLrnNumberValue}
                    keyboardType='numeric'
                    required
                />
                
            
                    <CustomSelect
                        label="School Level"
                        options={yearLevels}
                        value={StudentYearLevel}
                        onValueChange={setYearLevelValue}
                        placeholder="Select Year Level"
                        required
                    />

                    <CustomSelect
                        label="Grade Level"
                        options={grades}
                        value={StudentGradeLevel}
                        onValueChange={setGradeLevelValue}
                        placeholder="Select Grade Level"
                        required
                    />

                    <CustomSelect
                        label="Section"
                        options={section}
                        value={StudentSection}
                        onValueChange={setSectionValue}
                        placeholder="Select Section"
                        required
                    />
                
                 <View style={styles.buttonsContainer}>
                    <Button
                        title="Cancel"
                        onPress={handleCancel}
                        fontSize={15}
                        color='#393939'
                        backgroundColor="#CBCACA"
                        width="45%"
                    />
                    <Button title="Next" onPress={onNext} width="45%" fontSize={15} disabled={!StudentNameValue || !StudentLrnNumber || !StudentYearLevel || !StudentGradeLevel || !StudentSection}/>
                </View>

            </Card>
        </View>
    );
}

export function VisitorForm({ 
    onBack, onNext,

    VisitorNameValue,
    setVisitorNameValue,

    StudentNameValue,
    setStudentNameValue,

    StudentLrnNumber,
    setLrnNumberValue,

    StudentYearLevel,
    setYearLevelValue,

    StudentGradeLevel,
    setGradeLevelValue,

    StudentSection,
    setSectionValue,

    handleCancel
}){
    return (
       <View style={{ padding: 20 }}>

                    <View style={styles.Header}>
                        <IconButton onPress={onBack} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Personal Information
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 2 to 3
                            </Text>
                        </View>
                    </View>

            <Card padding={25}>
                <Input
                    label="Visitor Name"
                    placeholder="Enter Visitor Name"
                    value={VisitorNameValue}
                    onChangeText={setVisitorNameValue}
                    required
                />
                 <Input
                    label="Student of Name"
                    placeholder="Enter Student Name"
                    value={StudentNameValue}
                    onChangeText={setStudentNameValue}
                    required
                />
                <Input
                    label="LRN"
                    placeholder="Enter Learner Reference Number"
                    value={StudentLrnNumber}
                    onChangeText={setLrnNumberValue}
                    keyboardType='numeric'
                    required
                />
                
            
                    <CustomSelect
                        label="School Level"
                        options={yearLevels}
                        value={StudentYearLevel}
                        onValueChange={setYearLevelValue}
                        placeholder="Select Year Level"
                        required
                    />

                    <CustomSelect
                        label="Grade Level"
                        options={grades}
                        value={StudentGradeLevel}
                        onValueChange={setGradeLevelValue}
                        placeholder="Select Grade Level"
                        required
                    />

                    <CustomSelect
                        label="Section"
                        options={section}
                        value={StudentSection}
                        onValueChange={setSectionValue}
                        placeholder="Select Section"
                        required
                    />
                
                 <View style={styles.buttonsContainer}>
                    <Button
                        title="Cancel"
                        onPress={handleCancel}
                        fontSize={15}
                        color='#393939'
                        backgroundColor="#CBCACA"
                        width="45%"
                    />
                    <Button title="Next" width="45%"onPress={onNext} fontSize={15} disabled={!StudentNameValue || !StudentLrnNumber || !StudentYearLevel || !StudentGradeLevel || !StudentSection}/>
                </View>

            </Card>
        </View>
    );
}

export function AlumniForm({ 
    onBack, onNext,

    StudentNameValue,
    setStudentNameValue,

    StudentLrnNumber,
    setLrnNumberValue,

    StudentYearLevel,
    setYearLevelValue,

    handleCancel
}){
    return (
        <View style={{ padding: 20 }}>
            <View style={styles.Header}>
                        <IconButton onPress={onBack} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Personal Information
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 2 to 3
                            </Text>
                        </View>
            </View>

            <Card padding={25}>
                 <Input
                    label="Student of Name"
                    placeholder="Enter Student Name"
                    value={StudentNameValue}
                    onChangeText={setStudentNameValue}
                    required
                />
                <Input
                    label="LRN"
                    placeholder="Enter Learner Reference Number"
                    value={StudentLrnNumber}
                    onChangeText={setLrnNumberValue}
                    keyboardType='numeric'
                    required
                />
                
            
                    <CustomSelect
                        label="School Level"
                        options={yearLevels}
                        value={StudentYearLevel}
                        onValueChange={setYearLevelValue}
                        placeholder="Select Year Level"
                        required
                    />
                
                 <View style={styles.buttonsContainer}>
                    <Button
                        title="Cancel"
                        onPress={handleCancel}
                        fontSize={15}
                        color='#393939'
                        backgroundColor="#CBCACA"
                        width="45%"
                    />
                    <Button title="Next" width="45%" onPress={onNext} fontSize={15} disabled={!StudentNameValue || !StudentLrnNumber || !StudentYearLevel }/>
                </View>

            </Card>
        </View>
    );
}




export function OfficeTransaction({
    onBack, handleCancel,
    transactionValue, setTransactionValue,
    registrarDocuments, setRegistrarDocuments,
    registrarOffice, setTransactionRegistrar,
    accountingPayment, setAccountingPayment,
    accountingOffice, setTransactionAccounting
}){

    const [subPage, setSubPage] = React.useState(null);



const addDocu = (idx) => {
  setRegistrarDocuments(prevDocs => {
    const newDocs = prevDocs.map((d, i) => {
      if (i !== idx) return { ...d };
      return { ...d, Quantity: (d.Quantity || 0) + 1 };
    });

    // update registrarOffice based on newDocs
    const requested = newDocs.filter(doc => (doc.Quantity || 0) > 0);
    setTransactionRegistrar(prev => ({
      ...prev,
      requestedDocument: requested,
      total: requested.reduce((sum, doc) => sum + (doc.Price || 0) * (doc.Quantity || 0), 0),
    }));

    return newDocs;
  });
};

const minusDocu = (idx) => {
  setRegistrarDocuments(prevDocs => {
    const newDocs = prevDocs.map((d, i) => {
      if (i !== idx) return { ...d };
      const newQuantity = Math.max(0, (d.Quantity || 0) - 1);
      return {
        ...d,
        Quantity: newQuantity,
        Purpose: newQuantity === 0 ? "" : (d.Purpose || "")
      };
    });

    const requested = newDocs.filter(doc => (doc.Quantity || 0) > 0);
    setTransactionRegistrar(prev => ({
      ...prev,
      requestedDocument: requested,
      total: requested.reduce((sum, doc) => sum + (doc.Price || 0) * (doc.Quantity || 0), 0),
    }));

    return newDocs;
  });
};





    

const addPaymentFee = (idx) => {
  setTransactionAccounting(prev => {
    const selected = accountingPayment[idx];
    if (!selected) return prev; // guard

    const exists = prev.requestedPayment.some(p => p.PaymentFees === selected.PaymentFees);

    let newRequested;
    let newTotal = prev.total || 0;

    if (exists) {
      newRequested = prev.requestedPayment.filter(p => p.PaymentFees !== selected.PaymentFees);
      newTotal = Math.max(0, newTotal - (selected.Price || 0));
    } else {
      newRequested = [...(prev.requestedPayment || []), selected];
      newTotal = (newTotal || 0) + (selected.Price || 0);
    }

    return {
      ...prev,
      requestedPayment: newRequested,
      total: newTotal
    };
  });
};

const handleSubmitTransaction = () => {
  const transactionObj = {};
  const regTotal = (registrarOffice?.total) || 0;
  const accTotal = (accountingOffice?.total) || 0;
  const totalCost = regTotal + accTotal;

  if (Array.isArray(registrarOffice?.requestedDocument) && registrarOffice.requestedDocument.length) {
    transactionObj.registrarOffice = registrarOffice;
  }

  if (Array.isArray(accountingOffice?.requestedPayment) && accountingOffice.requestedPayment.length) {
    transactionObj.accountingOffice = accountingOffice;
  }

  transactionObj.total = totalCost;

  // set this into form data as object
  setTransactionValue(transactionObj);
  console.log('Submitted transaction:', transactionObj);
};


    return (
        <View style={{ padding: 10, flex: 1 }}>
        {!subPage ? (
            <>     
            <View style={styles.Header}>
                        <IconButton onPress={onBack} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Select Office Transaction
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 3 to 3
                            </Text>
                        </View>
            </View>

            <Card padding={25}>
                <View style={{ marginBottom: 15 }}>
                    <ToggleOfficeButton
                        label="Registrar Office"
                        active={
                            registrarOffice.Office === "Registrar Office" && Array.isArray(registrarOffice.requestedDocument) &&
                            registrarOffice.requestedDocument.some(doc => doc.Quantity > 0)
                        }
                        onPress={() => setSubPage("Registrar Office")}
                    />
                    <ToggleOfficeButton
                        label="Accounting Office"
                        active={
                            accountingOffice.Office === "Accounting Office" && Array.isArray(accountingOffice.requestedPayment) &&
                            accountingOffice.requestedPayment.length > 0
                        }
                        onPress={() => setSubPage("Accounting Office")}
                    />
                </View>
                
            </Card>

            <Card style={{ padding: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#14AD59', marginBottom: 20 }}>
                    Registrar's Office | Request Document
                </Text>
                    
                {registrarOffice.requestedDocument && registrarOffice.requestedDocument.some(doc => doc.Quantity > 0) ? (
                   registrarOffice.requestedDocument.filter(doc => doc.Quantity > 0).map((doc, idx) => {
                        const docIdx = registrarDocuments.findIndex(d => d.DocumentName === doc.DocumentName);

                        return (
                            <View key={doc.DocumentName} style={{ marginBottom: 18, borderColor: '#d6d6d6ff', borderRadius: 5, borderWidth: 1, padding: 8 }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center', 
                                        padding: 10,
                                        justifyContent: 'space-between',
                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#A3A3A3', fontWeight: '500' }}>{doc.DocumentName}</Text>
                                            <Text style={{ color: '#A3A3A3', fontSize: 12 }}>₱ {doc.Price.toFixed(2)}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                            <IconButton
                                                icon={require('../../../assets/icons/minus.png')}
                                                style={{ borderRadius: 12, marginRight: 10 }}
                                                onPress={() => {
                                                    minusDocu(docIdx);
                                                }}
                                            />
                                            <Text style={{ minWidth: 5, textAlign: 'center', fontWeight: '700', color: '#A3A3A3' }}>
                                                {doc.Quantity}
                                            </Text>
                                            <IconButton
                                                icon={require('../../../assets/icons/plus.png')}
                                                style={{ borderRadius: 12, marginLeft: 10 }}
                                                onPress={() => {
                                                    addDocu(docIdx);
                                                }}
                                            />
                                        </View>
                                        
                                    </View>
                                    <View style={{ marginTop: 8 }}>
                                            <Input
                                                placeholder="Enter purpose of requesting"
                                                value={doc.Purpose}
                                                onChangeText={text => {
                                                const newDocs = [...registrarDocuments];
                                                if (docIdx >= 0) {
                                                    newDocs[docIdx].Purpose = text;
                                                    setRegistrarDocuments(newDocs);
                                                }
                                                }}

                                                style={{ fontSize: 13, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 8 }}
                                                editable={doc.Quantity > 0}
                                            />
                                        </View>
                                    </View>
                                    
                        )}
                    )
                    ) : (
                        <View style={{ alignItems: 'center', height: 100, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#A3A3A3'}}>No request document found</Text>
                        </View>
                    )}
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#A3A3A3', textAlign: 'right'}}>Total: ₱ {registrarOffice.total ? registrarOffice.total.toFixed(2) : "0.00"}</Text>
            </Card>

            <Card style={{ padding: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#14AD59', marginBottom: 20 }}>
                    Accounting Office | Payment
                </Text>

                {accountingOffice.requestedPayment && accountingOffice.requestedPayment.length > 0 ? (
                    accountingOffice.requestedPayment.filter(fee => fee.Price > 0).map((fee, idx) => {
                        const feeIdx = accountingPayment.findIndex(f => f.PaymentFees === fee.PaymentFees);

                    return (
                        <Pressable
                            key={fee.PaymentFees}
                            onPress={() => addPaymentFee(feeIdx)}
                            style={{
                                padding: 12,
                                marginBottom: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#14AD59',
                                backgroundColor: '#14AD59',
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                {fee.PaymentFees} {'\n'}
                                ₱{fee.Price.toFixed(2)}
                            </Text>
                        </Pressable>
                    );
                })

                

                ) : (
                    <View style={{ alignItems: 'center', height: 100, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#A3A3A3' }}>No payment found</Text>
                    </View>
                )}
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#A3A3A3', textAlign: 'right' }}>
                    Total: ₱ {accountingOffice.total ? accountingOffice.total.toFixed(2) : "0.00"}
                </Text>
            </Card>

                    <Card style={{ padding: 15}}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{color: '#A3A3A3', fontWeight: '600', fontSize: 20}}>Transaction Cost</Text>
                            <Text style={{color: '#ef4444', fontWeight: '700', fontSize: 22}}>
                                ₱ {registrarOffice.total + accountingOffice.total > 0 ? (registrarOffice.total + accountingOffice.total).toFixed(2) : '0.00'}
                            </Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <Button
                                title="Cancel"
                                width={"48%"}
                                onPress={handleCancel}
                                fontSize={15}
                                color='#393939'
                                backgroundColor="#CBCACA"
                            />
                            {/* next transaction phase */}
                            <Button
                                title="Submit"
                                width={"48%"}
                                onPress={handleSubmitTransaction}
                                
                                
                                disabled={
                                    (!Array.isArray(registrarOffice.requestedDocument) || registrarOffice.requestedDocument.length === 0) &&
                                    (!Array.isArray(accountingOffice.requestedPayment) || accountingOffice.requestedPayment.length === 0)
                                }
                                fontSize={15}
                            />
                        </View>
                </Card>

            
            </>
        ) : null}

        {subPage === "Registrar Office" && (
            <>
            <View style={styles.Header}>
                        <IconButton onPress={() => setSubPage(null)} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Registrar Office
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 3 to 3
                            </Text>
                        </View>
            </View>

            <Card style={{ padding: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#14AD59', marginBottom: 20,  textAlign: 'center' }}>
                        Request Documents
                    </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontWeight: '700', color: '#14AD59' }}>Document</Text>
                    <Text style={{ fontWeight: '700', color: '#14AD59' }}>Number of Copy/s</Text>
                </View>
                    {registrarDocuments.map((doc, idx) => (
                        <View key={doc.DocumentName} style={{ marginBottom: 18, borderColor: '#d6d6d6ff', borderRadius: 5, borderWidth: 1, padding: 8 }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center', 
                                padding: 10,
                                justifyContent: 'space-between',
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#A3A3A3', fontWeight: '500' }}>{doc.DocumentName}</Text>
                                    <Text style={{ color: '#A3A3A3', fontSize: 12 }}>₱ {doc.Price.toFixed(2)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <IconButton
                                        icon={require('../../../assets/icons/minus.png')}
                                        style={{ borderRadius: 12, marginRight: 10 }}
                                        onPress={() => {
                                        minusDocu(idx);
                                        }}
                                    />
                                    <Text style={{ minWidth: 5, textAlign: 'center', fontWeight: '700', color: '#A3A3A3' }}>
                                        {doc.Quantity}
                                    </Text>
                                    <IconButton
                                        icon={require('../../../assets/icons/plus.png')}
                                        style={{ borderRadius: 12, marginLeft: 10 }}
                                        onPress={() => {
                                            addDocu(idx);
                                        }}
                                    />
                                </View>
                                
                            </View>
                            <View style={{ marginTop: 8 }}>
                                    <Input
                                        placeholder="Enter purpose of requesting"
                                        value={doc.Purpose}
                                        onChangeText={text => {
                                            const newDocs = [...registrarDocuments];
                                            newDocs[idx].Purpose = text;
                                            setRegistrarDocuments(newDocs);
                                        }}
                                        style={{ fontSize: 13, backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 8 }}
                                        editable={doc.Quantity > 0}
                                    />
                                </View>
                        </View>
                    ))}
            </Card>
            </>
        )}

        {subPage === "Accounting Office" && (
            <>
            <View style={styles.Header}>
                        <IconButton onPress={() => setSubPage(null)} 
                                icon={require('../../../assets/icons/ArrowBack.png')} />
                        <View style={styles.Headertext}>
                            <Text style={{ fontSize: 24, fontWeight: '700', color: '#14AD59', textAlign: 'center' }}>
                                Accounting Office
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: '400', marginBottom: 10, textAlign: 'center' }}>
                                Step 3 to 3
                            </Text>
                        </View>
            </View>
            <Card padding={25}>
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#14AD59', marginBottom: 20,  textAlign: 'center' }}>
                        Payment Fee's
                    </Text>
                    {accountingPayment.map((fee, idx) => {
                        const isActive = accountingOffice.requestedPayment.some(
                            item => item.PaymentFees === fee.PaymentFees
                        );

                        return (
                            <Pressable
                            key={idx}
                            onPress={() => {
                                addPaymentFee(idx);
                            }}
                            style={{
                                padding: 12,
                                marginBottom: 10,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: isActive ? '#14AD59' : "#ccc",
                                backgroundColor: isActive ? '#14AD59' : "#fff",
                            }}
                            >
                            <Text
                                style={{
                                color: isActive ? "#fff" : '#A3A3A3',
                                fontWeight: isActive ? "800" : "400",
                                }}
                            >
                                {fee.PaymentFees} {'\n'}
                                ₱{fee.Price.toFixed(2)}
                            </Text>
                            </Pressable>
                        );
                        })}

                </View>
            </Card>
            
            </>
        )}

        
        </View>
    );
}



export function CancelModal({ modalvisible, onBack,  onConfirmCancel}) {
    
    return (
        
        <Modals
            visible={modalvisible}
            onClose={onBack}
            width={"85%"}
            title="Cancel Appointment"
            message="Are you sure you want to cancel your appointment?"
        >
            <View  style={styles.buttonsContainer}>
                <Button title="No" fontSize={20}  backgroundColor='#FF0000' width={"40%"} onPress={onBack} />
                <Button title="Yes" fontSize={20} backgroundColor='#14AD59' width={"40%"} onPress={() => {onConfirmCancel();}} />
            </View>
        </Modals>
    );
}






export const styles = StyleSheet.create({

buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20
  },

Header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
  },

Headertext:{
    fontSize: 25,
    fontWeight: 'bold',
    color: '#19AF5B',
    textAlign: 'center',
    width: '90%',
  },

});

