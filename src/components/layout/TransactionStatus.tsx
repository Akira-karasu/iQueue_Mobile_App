import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface TransactionStatusProps {
  status: string | null;
  goback: () => void;
  count_readyForRelease?: number;
}

export default function TransactionStatus({ status, goback, count_readyForRelease }: TransactionStatusProps) {

  // If there are ready-for-release documents, override status
  const effectiveStatus = count_readyForRelease && count_readyForRelease > 0 
    ? "ready-for-release"
    : status;

  if (!effectiveStatus) {
    return (
      <View style={styles.container}>
        <Text style={[styles.infoText, { color: "#666" }]}>
          Status not available
        </Text>
      </View>
    );
  }

  const statusConfig: Record<
    string,
    { title: string; image: any; infoText: string; button?: { title: string } }
  > = {
    'pending': {
      title: "Verifying Transaction",
      image: require("@/assets/transactionIcons/verification.png"),
      infoText:
        "We are checking your information and request. You’ll be notified once it is verified.",
    },
    'processing': {
      title: "Processing Transaction",
      image: require("@/assets/transactionIcons/processing.png"),
      infoText:
        "Your transaction is now verified, you can now proceed to payment for your transaction request",
    },
    
    "ready-for-release": {
      title: "Request is now ready for release",
      image: require("@/assets/transactionIcons/readyForRelease.png"),
      infoText: "Your requested documents are now ready for release",
    },
    'completed': {
      title: "Transaction Completed",
      image: require("@/assets/transactionIcons/completed.png"),
      infoText: "Your transaction has been completed successfully.",
    },
    'cancelled': {
      title: "Transaction Cancelled",
      image: require("@/assets/transactionIcons/cancelled.png"),
      infoText: "Your transaction has been cancelled.",
    },
  };

  const currentStatus = statusConfig[effectiveStatus.toLowerCase()] || null;

  if (!currentStatus) {
    return (
      <View style={styles.container}>
        <Text style={[styles.infoText, { color: "#666" }]}>
          Unknown status
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <IconButton
          onPress={goback}
          icon={require("../../../assets/icons/ArrowBack.png")}
        /> */}
        <Text style={styles.title}>{currentStatus.title}</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Status Image */}
      <Image
        source={currentStatus.image}
        resizeMode="contain"
        style={styles.statusImage}
      />

      {/* Info Text */}
      <Text style={styles.infoText}>{currentStatus.infoText}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#19AF5B",
    textAlign: "center",
    marginLeft: 10,
  },
  statusImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
