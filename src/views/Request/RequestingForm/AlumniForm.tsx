import Button from '@/src/components/buttons/Button';
import Dropdown from '@/src/components/buttons/Dropdown';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import StepBar from '@/src/components/layout/stepBar';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { View } from 'react-native';
import styles from './RequestFormStyle';

type VisitorFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  open: () => void;
  step: number;
  studentName: string;
  studentLrnNumber: string;
  studentYearLevel: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (key: string, value: any) => void;
};

function StudentForm({
  setSteps,
  open,
  step,
  studentName,
  studentLrnNumber,
  studentYearLevel,
  setFormData,
  handleChange,
}:  VisitorFormProps) {
  const { DataYearLevel, setYearLevel } = useRequest();

  return (
    <>
      <StepBar start={step} end={3} title="Fill your information" display={true} onBack={() => setSteps(1)} />
      <View style={styles.mainContainer}>
        <Card padding={25}>
          <Input
            label="Alumni Name"
            placeholder="Enter alumni Name"
            value={studentName}
            onChangeText={(value) => handleChange('studentName', value)}
            required
          />
          <Input
            label="LRN"
            placeholder="Enter Learner Reference Number"
            value={studentLrnNumber}
            onChangeText={(value) => handleChange('studentLrnNumber', value)}
            keyboardType="numeric"
            maxLength={12}
            required
          />

          <Dropdown
            selectedValue={studentYearLevel}
            onSelect={(value) => {
              handleChange('studentYearLevel', value);
            }}
            data={DataYearLevel}
            label='Select school year batch'
            title='School Year Batch'
            required={true}
          />

            
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              backgroundColor="#AEAEAE"
              width="45%"
              color="#191919ff"
              fontSize={18}
              onPress={open}
            />
            <Button title="Next" fontSize={18} width="45%" onPress={() => setSteps(3)} disabled={studentName === '' || studentLrnNumber === '' || studentYearLevel === ''}/>
          </View>
        
        </Card>
      </View>
    </>
  );
}

export default React.memo(StudentForm);