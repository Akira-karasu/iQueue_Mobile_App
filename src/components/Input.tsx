import React, { useState } from "react";
import { TextInput, Text, View, TouchableOpacity, Image } from "react-native";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  className?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  required = false,
  showPasswordToggle = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const isPasswordField = secureTextEntry && showPasswordToggle;

  return (
    <View style={{ width: '100%', marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            marginBottom: 4,
            fontWeight: '500',
            color: isFocused ? '#16a34a' : '#374151',
          }}
        >
          {label}
          {required && <Text style={{ color: '#ef4444' }}> *</Text>}
        </Text>
      )}
      <View style={{ width: '100%', position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isFocused ? '#22c55e' : '#d1d5db',
            color: '#1f2937',
            backgroundColor: '#fff',
            paddingRight: isPasswordField ? 40 : 16, // extra space for icon
          }}
          placeholder={placeholder}
          value={value ?? ""}
          onChangeText={onChangeText ?? (() => {})}
          secureTextEntry={isPasswordField ? !showPassword : secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ position: 'absolute', right: 15, top: 0, height: '100%', justifyContent: 'center', alignItems: 'center' }}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            activeOpacity={1}
          >
            <Image
              source={require('../../assets/icons/eye.png')}
              style={{ width: 20, height: 20, tintColor: showPassword ? '#22c55e' : '#878787'}}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;


