import Button from '@/src/components/buttons/Button';
import Dropdown from '@/src/components/buttons/Dropdown';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import StepBar from '@/src/components/layout/stepBar';
import ViewScroller from '@/src/components/scroller/ViewScroller';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { View } from 'react-native';
import styles from './RequestFormStyle';

type VisitorFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  open: () => void;
  step: number;
  visitorName: string;
  studentName: string;
  studentLrnNumber: string;
  studentYearLevel: string;
  studentGradeLevel: string;
  studentSection: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (key: string, value: any) => void;
};

function VisitorForm({
  setSteps,
  open,
  step,
  visitorName,
  studentName,
  studentLrnNumber,
  studentYearLevel,
  studentGradeLevel,
  studentSection,
  setFormData,
  handleChange,
}: VisitorFormProps) {
  const { DataYearLevel, setYearLevel, DataGradeLevel, setGradeLevel } = useRequest();

  return (
    <>
    <ViewScroller
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
    >
      <StepBar start={step} end={3} title="Fill your information" display={true} onBack={() => setSteps(1)} />
      <View style={styles.mainContainer}>
        <Card padding={25}>
            <Input
            label="Visitor Name"
            placeholder="Enter Visitor Name"
            value={visitorName}
            onChangeText={(value) => handleChange('visitorName', value)}
            required
          />
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
            
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              backgroundColor="#AEAEAE"
              width="45%"
              color="#191919ff"
              fontSize={18}
              onPress={open}
            />
            <Button title="Next" fontSize={18} width="45%" onPress={() => setSteps(3)} disabled={studentName === '' || studentLrnNumber === '' || studentYearLevel === '' || studentGradeLevel === '' || studentSection === ''} />
          </View>

        </Card>
      </View>
      </ViewScroller>
    </>
  );
}

export default React.memo(VisitorForm);