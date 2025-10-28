import React from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

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
  underline = false,
  color = '#FFCE00',
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
    paddingVertical: 5,
  },
});

export default Activity;
