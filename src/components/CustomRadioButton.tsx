import React from 'react';
import { Image, ImageSourcePropType, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CustomRadioButtonProps {
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  direction?: 'row' | 'column';
  style?: StyleProp<ViewStyle>;
  labelStyle?: object;
  radioColor?: string;
  uncheckedColor?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: object;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  options, 
  value,
  onValueChange,
  direction = 'column',
  style = {},
  labelStyle = {},
  radioColor = '#1EBA60',
  uncheckedColor = '#ccc',
  imageSource,
  imageStyle = {},
}) => {
  return (
    <View style={[styles.container, { flexDirection: direction }, style]}>
      {options.map(option => {
        const isSelected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionRow,
              {
                backgroundColor: isSelected ? '#eafff3' : '#fff',
                padding: 20, width: '100%', borderRadius: 10, borderWidth: isSelected ? 3 : 2, borderColor: isSelected ? radioColor : uncheckedColor,
                justifyContent: 'space-evenly',
              },
            ]}
            activeOpacity={0.7}
            onPress={() => onValueChange(option.value)}
          >
            {option.image && (
              <Image
                source={option.image}
                style={[
                  { width: 40, height: 40, marginRight: 8, tintColor: isSelected ? radioColor : uncheckedColor },
                  imageStyle,
                ]}
                resizeMode="contain"
              />
            )}
            <Text
              style={[
                styles.label,
                labelStyle,
                { color: isSelected ? radioColor : '#ccc', fontWeight: isSelected ? 'bold' : 'normal' }
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8

  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 30,
    color: '#333',
    marginLeft: 4,
  },
});

export default CustomRadioButton;