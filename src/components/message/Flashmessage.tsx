// FlashMessage.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type FlashMessageProps = {
  message: string;
  type?: "success" | "error" | "info";
};

const FlashMessage: React.FC<FlashMessageProps> = ({ message, type = "info" }) => {
  const backgroundColors = {
    success: "#4BB543",
    error: "#FF3B30",
    info: "#007AFF",
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColors[type] }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default FlashMessage;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
