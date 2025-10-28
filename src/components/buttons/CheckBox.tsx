import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Option {
  id: string | number;
  paymentfees?: string;
  price?: string;
  disabled?: boolean;
}

interface CheckboxProps {
  options: Option[];
  selected?: (string | number)[];
  defaultSelected?: (string | number)[];
  onChange?: (selected: (string | number)[]) => void;
  multiple?: boolean;
  containerStyle?: any;
  optionStyle?: any;
}

export default function CheckBox({
  options,
  selected,
  defaultSelected = [],
  onChange,
  multiple = true,
  containerStyle,
  optionStyle,
}: CheckboxProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isControlled = selected !== undefined;
  const current = isControlled ? selected! : internalSelected;

  const toggle = (id: string | number, disabled?: boolean) => {
    if (disabled) return;

    let next: (string | number)[];
    if (multiple) {
      next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];
    } else {
      next = current.includes(id) ? [] : [id];
    }

    if (!isControlled) setInternalSelected(next);
    onChange?.(next);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map(({ id, paymentfees, price, disabled }) => (
        <TouchableOpacity
          key={id}
          onPress={() => toggle(id, disabled)}
          disabled={disabled}
          style={[
            styles.option,
            optionStyle,
            disabled && styles.disabled,
          ]}
        >
          <View
            style={[
              styles.checkbox,
              current.includes(id) && styles.checked,
            ]}
          >
            {current.includes(id) && (
              <Text style={styles.checkText}>✓</Text>
            )}
          </View>

          {/* ✅ show PaymentFees and Price */}
          <View style={styles.labelContainer}>
            <Text style={styles.feeText}>{paymentfees}</Text>
            <Text style={styles.priceText}>₱{price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  option: { 
    flexDirection: 'row', 
    alignItems: 'center',
    borderColor: '#E2E2E2',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#19AF5B',
    borderColor: '#19AF5B',
  },
  checkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  feeText: {
    fontSize: 16,
    color: '#b5b5b5ff',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    color: '#19AF5B',
    fontWeight: '600',
  },
  disabled: { opacity: 0.5 },
});
