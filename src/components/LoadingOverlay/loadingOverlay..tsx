import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export default function LoadingOverlay({ 
  visible, 
  message = "Loading...",
  size = "large",
  color = "#19AF5B"
}: LoadingOverlayProps) {
  return (
    <Modal 
      transparent 
      animationType="fade" 
      visible={visible}
      onRequestClose={() => {}} // ✅ Prevent back button from closing
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ActivityIndicator size={size} color={color} />
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 15,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});