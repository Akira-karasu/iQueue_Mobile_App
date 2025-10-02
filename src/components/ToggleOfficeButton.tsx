import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ToggleOfficeButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const ToggleOfficeButton: React.FC<ToggleOfficeButtonProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, active ? styles.activeButton : styles.inactiveButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconLabelRow}>
        <Image
          source={
            active
              ? require('../../assets/icons/minus.png')
              : require('../../assets/icons/plus.png')
          }
          style={[styles.icon, active ? styles.activeIcon : styles.inactiveIcon]}
        />
        <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    width: '100%',
  },
  activeButton: {
    backgroundColor: '#14AD59',
  },
  inactiveButton: {
    backgroundColor: '#F3F4F6',
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },

  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
  },
  inactiveLabel: {
    color: '#A3A3A3',
  },
});

export default ToggleOfficeButton;