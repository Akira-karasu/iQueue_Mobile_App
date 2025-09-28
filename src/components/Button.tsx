import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fontSize?: number;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string; // Add this prop
  height?: number | string;
  width?: number | string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  fontSize = 25,
  disabled = false,
  color = 'white',
  backgroundColor = '#FFCE00', // Default background color
  height="auto",
  width="auto",
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, height, width  },
        style,

        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, { fontSize, color}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ffe787ff',
  },
});

export default Button;