import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fontSize?: number;
  disabled?: boolean;
  color?: string;
  backgroundColor?: string;
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
  backgroundColor = '#FFCE00',
  height = "auto",
  width = "auto",
}) => {
  const computedBackground = disabled ? '#ffe787ff' : backgroundColor;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: computedBackground, height, width },
        style,
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
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Button;
