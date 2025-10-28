import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type NumberInputProps = {
  label?: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

const NumberInput: React.FC<NumberInputProps> = ({
  label = 'Quantity',
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
}) => {
  const increase = () => {
    if (value + step <= max) onChange(value + step);
  };

  const decrease = () => {
    if (value - step >= min) onChange(value - step);
  };

  const handleInputChange = (text: string) => {
    const numericValue = parseInt(text) || 0;
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, isMin && styles.disabledButton]}
          onPress={decrease}
          disabled={isMin}
        >
          <Text style={[styles.buttonText, isMin && styles.disabledText]}>−</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={value.toString()}
          onChangeText={handleInputChange}
          editable={!isMin && !isMax}
        />

        <TouchableOpacity
          style={[styles.button, isMax && styles.disabledButton]}
          onPress={increase}
          disabled={isMax}
        >
          <Text style={[styles.buttonText, isMax && styles.disabledText]}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NumberInput;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#19AF5B',
  },
  disabledButton: {
    backgroundColor: '#e6e6e6',
  },
  disabledText: {
    color: '#aaa',
  },
  input: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 6,
    flexGrow: 1,
  },
});
