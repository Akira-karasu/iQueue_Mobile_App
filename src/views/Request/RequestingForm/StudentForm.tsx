import Button from '@/src/components/buttons/Button';
import Dropdown from '@/src/components/buttons/Dropdown';
import { RadioButton } from '@/src/components/buttons/Radiobutton';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import StepBar from '@/src/components/layout/stepBar';
import { options } from '@/src/constant/data';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { Text, View } from 'react-native';
import styles from './RequestFormStyle';
import { useRequestStore } from "@/src/store/requestStore";

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

function StudentForm({
  setSteps,
  open,
  step,
  studentName,
  studentLrnNumber,
  studentYearLevel,
  studentGradeLevel,
  studentSection,
  handleChange,
}: StudentFormProps) {
  const { DataYearLevel, DataGradeLevel, selectedOption, setSelectedOption } = useRequest();
  const { formData } = useRequestStore();

  return (
    <>
      <StepBar title="Fill your information" display={false} />
      <View style={styles.mainContainer}>
        <Card padding={25}>
          <Input
            label="Full Name"
            placeholder="Enter Full Name"
            value={studentName}
            onChangeText={(value) => handleChange('studentName', value)}
            required
          />

          {/* <Input
            label="LRN"
            placeholder="Enter Learner Reference Number"
            value={studentLrnNumber}
            onChangeText={(value) => handleChange('studentLrnNumber', value)}
            keyboardType="numeric"
            maxLength={12}
            required
          /> */}

          <Input
            label="Section"
            placeholder="Enter Student Section"
            value={studentSection}
            onChangeText={(value) => handleChange('studentSection', value)}
            required
          />

          <Dropdown
            selectedValue={studentYearLevel}
            onSelect={(value) => {
              handleChange('studentYearLevel', value);
            }}
            data={DataYearLevel}
            label='Select school year level'
            title='School Year Level'
            required={true}
          />

          <Dropdown
            selectedValue={studentGradeLevel}
            title='Grade Level'
            onSelect={(value) => {
              handleChange('studentGradeLevel', value);
            }}
            data={DataGradeLevel}
            label='Select grade level'
            required={true}
          />
          <Text>Alumni student?</Text>
          <View style={styles.radioButtonContainer}>
            {options.map((option: { label: string; value: string | number | boolean }) => (
              <RadioButton
                key={option.value}
                label={option.label}
                value={option.value}
                selected={formData.isAlumni === option.value}
                onSelect={(value) => handleChange('isAlumni', value)}
              />

            ))}
          </View>
            
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              backgroundColor="#AEAEAE"
              width="45%"
              color="#191919ff"
              fontSize={18}
              onPress={open}
            />
            <Button title="Next" fontSize={18} width="45%" onPress={() => setSteps(2)} disabled={studentName === '' || studentYearLevel === '' || studentGradeLevel === '' || studentSection === '' || formData.isAlumni === null} />
          </View>
        </Card>
      </View>
    </>
  );
}

export default React.memo(StudentForm);