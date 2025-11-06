import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RadioButtonProps {
  label: string;
  value: string | number | boolean;
  selected: boolean;
  onSelect: (value: string | number | boolean) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  selected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={() => onSelect(value)}
    >
      <View style={[styles.outerCircle, selected && styles.selectedOuterCircle]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  outerCircle: {
    height: 15,
    width: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: '#19AF5B',
  },
  innerCircle: {
    height: 5,
    width: 5,
    borderRadius: 4,
    backgroundColor: '#19AF5B',
  },
  label: {
    fontSize: 16,
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
