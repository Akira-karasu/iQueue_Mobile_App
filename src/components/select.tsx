import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CustomSelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  required = false,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: 'red' }}>*</Text>}
        </Text>
      )}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor="#d1d5db"
        >
          <Picker.Item label={placeholder} value="" enabled={false} />
          {options.map(opt => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    color: '#333',
    fontSize: 12,
  }
});

export default CustomSelect;