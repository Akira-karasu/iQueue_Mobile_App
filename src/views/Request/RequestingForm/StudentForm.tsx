import Button from '@/src/components/buttons/Button';
import CustomSelect from '@/src/components/buttons/select';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import StepBar from '@/src/components/layout/stepBar';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { View } from 'react-native';
import styles from './RequestFormStyle';

type StudentFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  open: () => void;
  step: number;
  studentName: string;
  studentLrnNumber: string;
  studentYearLevel: string;
  studentGradeLevel: string;
  studentSection: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (key: string, value: any) => void;
};

export default function StudentForm({
  setSteps,
  open,
  step,
  studentName,
  studentLrnNumber,
  studentYearLevel,
  studentGradeLevel,
  studentSection,
  setFormData,
  handleChange,
}: StudentFormProps) {
  const { DataYearLevel, setYearLevel, DataGradeLevel, setGradeLevel } = useRequest();

  return (
    <>
      <StepBar start={step} end={3} title="Fill your information" display={true} onBack={() => setSteps(1)} />
      <View style={styles.mainContainer}>
        <Card padding={25}>
          <Input
            label="Student Name"
            placeholder="Enter Student Name"
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

          <Input
            label="Section"
            placeholder="Enter Student Section"
            value={studentSection}
            onChangeText={(value) => handleChange('studentSection', value)}
            required
          />

          <CustomSelect
            label="School Level"
            options={DataYearLevel}
            value={studentYearLevel}
            onValueChange={(value) => handleChange('studentYearLevel', value)}            placeholder="Select Year Level"
            required
          />

          <CustomSelect
            label="Grade Level"
            options={DataGradeLevel}
            value={studentGradeLevel}
            onValueChange={(value) => handleChange('studentGradeLevel', value)}
            placeholder="Select Grade Level"
            required
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
            <Button title="Next" fontSize={18} width="45%" onPress={() => setSteps(3)} />
          </View>
        </Card>
      </View>
    </>
  );
}
