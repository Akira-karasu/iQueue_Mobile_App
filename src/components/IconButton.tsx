import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const IconButton = ({ onPress, icon, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image
        source={icon}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default IconButton;