import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

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
  editable?: boolean;
  maxLength?: number; // ✅ New prop for character limit
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
  editable = true,
  maxLength, // ✅ add it to destructuring
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  const isPasswordField = secureTextEntry && showPasswordToggle;

  return (
    <View style={{ width: '100%', marginBottom: 10 }}>
      {label && (
        <Text
          style={{
            marginBottom: 4,
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
            borderRadius: 5,
            borderWidth: 1,
            borderColor: !editable
              ? '#e5e7eb'
              : isFocused
              ? '#22c55e'
              : '#d1d5db',
            color: !editable ? '#a3a3a3' : '#1f2937',
            backgroundColor: !editable ? '#f3f4f6' : '#fff',
            paddingRight: isPasswordField ? 40 : 16,
          }}
          editable={editable}
          placeholder={placeholder}
          value={value ?? ""}
          onChangeText={onChangeText ?? (() => {})}
          secureTextEntry={isPasswordField ? !showPassword : secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength} // ✅ enforce character limit
        />

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 15,
              top: 0,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            activeOpacity={1}
          >
            <Image
              source={require('../../../assets/icons/eye.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: showPassword ? '#22c55e' : '#878787',
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
