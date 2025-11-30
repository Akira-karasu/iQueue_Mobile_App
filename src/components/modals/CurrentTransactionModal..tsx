import Button from "@/src/components/buttons/Button";
import React, { useEffect, useRef } from "react";
import { Image, Modal, StyleSheet, Text, Vibration, View } from "react-native";

interface CurrentTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  queueNumber?: string;
}

export default function CurrentTransactionModal({
  visible,
  onClose,
  queueNumber,
}: CurrentTransactionModalProps) {
  const vibrationIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      
      // ✅ Vibrate immediately
      Vibration.vibrate(500);
      
      // ✅ Continue vibrating every 1 second until modal closes
      vibrationIntervalRef.current = setInterval(() => {
        Vibration.vibrate(500);
      }, 1000);

      return () => {
        // ✅ STOP vibration when modal closes or component unmounts
        if (vibrationIntervalRef.current) {
          clearInterval(vibrationIntervalRef.current);
        }
        Vibration.cancel();
      };
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/icons/Vibrate.png')}
            style={styles.icon}
          />
          <Text style={styles.subtitle}>Queue Number</Text>
          <Text style={styles.title}>{queueNumber}</Text>
          <Text style={styles.message}>
            You are next, please proceed to the office
          </Text>
          <Button onPress={onClose} title="Confirm" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#19AF5B",
    marginBottom: 16,
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
  },
});