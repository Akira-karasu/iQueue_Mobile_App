import Button from '@/src/components/buttons/Button';
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Modals from './Modal';

interface CancelRequestTransactionProps {
  visible: boolean;
  onClose: () => void;
  transaction: any; // Replace 'any' with your actual transaction type if available
}


export default function CancelRequestTransaction({ 
  visible, 
  onClose,
  transaction 
}: CancelRequestTransactionProps) {
  const { handleCancelRequest, GoToHomeStack, isCancelling } = 
    useRequestTransaction(transaction?.transactions || []);
  
  const [error, setError] = useState("");

  const onConfirmCancel = async () => {
    try {
      setError("");
      
      // ✅ Validate transaction ID exists
      if (!transaction?.personalInfo?.id) {
        setError("Invalid transaction data");
        return;
      }
      
      await handleCancelRequest(transaction.personalInfo.id);
      
      // ✅ Close modal and navigate
      onClose();
      GoToHomeStack();
      
    } catch (error: any) {
      console.error('❌ Cancel error:', error);
      setError(error.message || 'Failed to cancel request');
    }
  };

  return (
    <Modals visible={visible} onClose={onClose}>
      <View style={styles.container}>
        
        {/* ✅ Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cancel Request</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to cancel this request?
          </Text>
        </View>

        {/* ✅ Warning Message */}
        {/* <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ This action cannot be undone. All transactions will be cancelled.
          </Text>
        </View> */}

        {/* ✅ Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        ) : null}

        {/* ✅ Loading Indicator */}
        {isCancelling && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#d32f2f" />
            <Text style={styles.loadingText}>Cancelling request...</Text>
          </View>
        )}

        {/* ✅ Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button 
            title={isCancelling ? "Cancelling..." : "Confirm Cancel"}
            onPress={onConfirmCancel}
            disabled={isCancelling}
            fontSize={16}
            width="100%"
            style={{ backgroundColor: isCancelling ? "#ccc" : "#d32f2f" }}
          />
          <Button 
            title="Go Back"
            onPress={onClose}
            disabled={isCancelling}
            fontSize={16}
            width="100%"
            style={{ backgroundColor: "#19AF5B" }}
          />
        </View>
      </View>
    </Modals>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 15,
    width: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6f00',
    padding: 10,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    padding: 10,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#c62828',
    fontWeight: '600',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 10,
    marginTop: 10,
  },
});