import Button from '@/src/components/buttons/Button';
import Dropdown from '@/src/components/buttons/Dropdown';
import { RadioButton } from '@/src/components/buttons/Radiobutton';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import StepBar from '@/src/components/layout/stepBar';
import ViewScroller from '@/src/components/scroller/ViewScroller';
import { options } from '@/src/constant/data';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import { useRequestStore } from "@/src/store/requestStore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './RequestFormStyle';

type StudentFormProps = {
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  open: () => void;
  step: number;
};

const StudentForm: React.FC<StudentFormProps> = ({ setSteps, open, step }) => {
  const { DataYearLevel, DataGradeLevel } = useRequest();
  const { formData, setFormData } = useRequestStore();

  const handleChange = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData({ [key]: value });
  };

  // ✅ Handle visitor checkbox toggle
  const handleVisitorToggle = () => {
    if (!formData.isVisitor) {
      // Enabling
      handleChange('isVisitor', true);
    } else {
      // Disabling - clear the name
      handleChange('isVisitor', false);
      handleChange('visitorName', '');
    }
  };

  const isNextDisabled =
    !formData.FirstName ||
    !formData.LastName ||
    !formData.Lrn ||
    !formData.studentYearLevel ||
    !formData.studentGradeLevel ||
    !formData.studentSection ||
    formData.isAlumni === null;

  return (
    <ViewScroller>
      <StepBar 
        title="Fill your information"
        displayArrowLeft={false}
        displayArrowRight={false}
      />
      <View style={styles.mainContainer}>
        <Card padding={25}>

          {/* ✅ CHECKBOX + VISITOR NAME */}
          <View style={{ marginBottom: 5 }}>


            {/* ✅ INPUT - Disabled when unchecked */}
            <Input
              label="Visitor Name"
              placeholder="Enter Visitor Name"
              value={formData.visitorName}
              onChangeText={(value) => handleChange('visitorName', value)}
              editable={formData.isVisitor}
              opacity={formData.isVisitor ? 1 : 0.5}
            />

            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
              onPress={handleVisitorToggle}
            >
              <MaterialCommunityIcons
                name={formData.isVisitor ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={formData.isVisitor ? '#19AF5B' : '#AEAEAE'}
              />
              <Text style={{ marginLeft: 5 }}>
                check if you are a visitor
              </Text>
            </TouchableOpacity>
          </View>

          <Input
            label="LRN"
            placeholder="Enter Learner Reference Number"
            value={formData.Lrn}
            onChangeText={(value) => handleChange('Lrn', value)}
            keyboardType="numeric"
            maxLength={12}
            required
          />
          <Input
            label="First Name"
            placeholder="Enter First Name"
            value={formData.FirstName}
            onChangeText={(value) => handleChange('FirstName', value)}
            required
          />
          <Input
            label="Middle Initial"
            placeholder="Enter Middle Initial"
            maxLength={1}
            value={formData.MiddleInitial}
            onChangeText={(value) => handleChange('MiddleInitial', value)}
          />
          <Input
            label="Last Name"
            placeholder="Enter Last Name"
            value={formData.LastName}
            onChangeText={(value) => handleChange('LastName', value)}
            required
          />
          <Input
            label="Suffix"
            placeholder="Enter Suffix"
            value={formData.Suffix}
            onChangeText={(value) => handleChange('Suffix', value)}
          />
          <Input
            label="Section"
            placeholder="Enter Student Section"
            value={formData.studentSection}
            onChangeText={(value) => handleChange('studentSection', value)}
          />

          <Dropdown
            selectedValue={formData.studentYearLevel}
            onSelect={(value) => handleChange('studentYearLevel', value)}
            data={DataYearLevel}
            label="Select school year level"
            title="School Year Level"
            required
          />

          <Dropdown
            selectedValue={formData.studentGradeLevel}
            onSelect={(value) => handleChange('studentGradeLevel', value)}
            data={DataGradeLevel}
            label="Select grade level"
            title="Grade Level"
            required
          />

          <Text>Alumni student?</Text>
          <View style={styles.radioButtonContainer}>
            {options.map((option) => (
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
            <Button
              title="Next"
              fontSize={18}
              width="45%"
              onPress={() => setSteps(2)}
              disabled={isNextDisabled}
            />
          </View>
        </Card>
      </View>
    </ViewScroller>
  );
};

export default React.memo(StudentForm);