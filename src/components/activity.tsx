import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

interface ActivityLinkProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  underline?: boolean;
  color?: string;
}

const Activity: React.FC<ActivityLinkProps> = ({
  label,
  onPress,
  style,
  textStyle,
  underline = true,
  color = '#2196F3',
}) => {
  return (
    <Pressable onPress={onPress} style={style}>
      <Text
        style={[
          styles.link,
          { color, textDecorationLine: underline ? 'underline' : 'none' },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Activity;
