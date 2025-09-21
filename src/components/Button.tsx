import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { ViewStyle, TextStyle, StyleProp } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fontSize?: number;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string; // Add this prop
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
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        style,

        disabled && styles.disabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, { fontSize, color }]}>{title}</Text>
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
    backgroundColor: '#A5D6A7',
  },
});

export default Button;