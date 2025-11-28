import Button from "@/src/components/buttons/Button";
import React, { useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface CancelRequestTransactionProps {
  visible: boolean;
  onClose: () => void;
  transaction: any;
  onCancel: (id: number) => Promise<boolean>; // ✅ Receive as prop
  isCancelling: boolean; // ✅ Receive as prop
}

export default function CancelRequestTransaction({
  visible,
  onClose,
  transaction,
  onCancel,
  isCancelling,
}: CancelRequestTransactionProps) {
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    try {
      setError(null);
      const result = await onCancel(transaction.personalInfo.id);
      
      if (result) {
        console.log("✅ Request cancelled successfully");
        onClose();
      }
    } catch (err: any) {
      console.error("❌ Cancel failed:", err);
      setError(err.message || "Failed to cancel request");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Cancel Request?</Text>
          <Text style={styles.message}>
            Are you sure you want to cancel this request? This action cannot be undone.
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <Button
              title="Keep Request"
              onPress={onClose}
              disabled={isCancelling}
              style={styles.button}
            />
            <Button
              title={isCancelling ? "Cancelling..." : "Cancel Request"}
              onPress={handleCancel}
              disabled={isCancelling}
              style={[styles.button, styles.dangerButton]}
            />
          </View>

          {isCancelling && <ActivityIndicator size="large" color="#19AF5B" />}
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
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
  dangerButton: {
    backgroundColor: "#d32f2f",
  },
});