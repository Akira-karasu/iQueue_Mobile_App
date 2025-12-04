import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IconButtonProps = {
  onPress: () => void;
  icon: any; 
  style?: object;
  count?: number;
};

const IconButton = ({ onPress, icon, style, count = 0   }: IconButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={icon}
        style={[styles.icon , style]}
        resizeMode="contain"
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    padding: 8,
  },
    badge: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 13,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default IconButton;