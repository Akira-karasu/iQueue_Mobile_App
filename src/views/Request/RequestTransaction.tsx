import Button from "@/src/components/buttons/Button";
import IconButton from "@/src/components/buttons/IconButton";
import Card from "@/src/components/cards/Card";
import TransactionStatus from "@/src/components/layout/TransactionStatus";
import LoadingOverlay from "@/src/components/LoadingOverlay/loadingOverlay.";
import CancelRequestTransaction from "@/src/components/modals/CancelRequestTransaction";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import useModal from "@/src/hooks/componentHooks/useModal";
import { RequestStackParamList } from "@/src/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

export default function RequestTransaction() {
  const { params } = useRoute<TransactionRouteProp>();
  const { transaction } = params;

  const {     
    visible,
    open,
    close
  } = useModal();

  const { 
    GoToHomeStack, 
    groupedTransactions, 
    GoToQueueScreen, 
    loading, 
    loadingMessage,
    handleCancelRequest
  } = useRequestTransaction(transaction.transactions);

  // ✅ useEffect to monitor loading state
  useEffect(() => {
    console.log('📡 Loading state changed:', { loading, loadingMessage });
  }, [loading, loadingMessage]);

  const requestDocuments = groupedTransactions["Request Document"] || [];
  const requestPayments = groupedTransactions["Payment"] || [];

  // Count "ready-for-release" documents
  const readyForReleaseCount = requestDocuments.filter(
    (doc) => doc.status?.toLowerCase() === "ready-for-release"
  ).length;

  // Full Name
  const fullName = [
    transaction.personalInfo.firstName,
    transaction.personalInfo.middleName,
    transaction.personalInfo.lastName,
  ]
    .filter((n) => n?.trim() !== "")
    .join(" ");

  // Format createdAt
  const createdAt = transaction.personalInfo.createdAt
    ? new Date(transaction.personalInfo.createdAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  // ✅ Payment Status Logic with Canceled Handling
  const allItems = [...requestDocuments, ...requestPayments];
  
  // ✅ Filter out canceled items for total cost calculation
  const nonCancelledItems = allItems.filter(
    (item) => item.status?.toLowerCase() !== "cancelled"
  );
  
  // ✅ Calculate total cost excluding cancelled items (with copies multiplier for documents)
  const totalCost = nonCancelledItems.reduce(
    (sum, item) => {
      const baseFee = parseFloat(item.fee) || 0;
      const copies = item.copies || 1;
      // Multiply fee by copies for request documents, use base fee for payments
      const itemTotal = item.transactionType === "Request Document" 
        ? baseFee * copies 
        : baseFee;
      return sum + itemTotal;
    },
    0
  );
  
  // Check if all canceled
  const allCancelled = allItems.every(
    (item) => item.status?.toLowerCase() === "cancelled"
  );
  
  // Check if all non-canceled items are paid
  const allNonCancelledPaid = nonCancelledItems.length > 0 && nonCancelledItems.every(
    (item) => item.paymentStatus?.toLowerCase() === "paid"
  );

  const allDocumentsAndPaymentsPaid = allItems.every(
    (item) => item.paymentStatus?.toLowerCase() === "paid"
  );

  // ✅ Check if there are ready-for-release documents
  const hasReadyForReleaseDocuments = requestDocuments.some(
    (doc) => doc.status?.toLowerCase() === "ready-for-release"
  );

  // ✅ Check if there are pending documents that are unpaid
  const hasPendingAndUnpaidDocuments = requestDocuments.some(
    (doc) => 
      doc.status?.toLowerCase() === "pending" && 
      doc.paymentStatus?.toLowerCase() === "unpaid"
  );

  // ✅ Check if there are pending documents that are paid
  const hasPendingAndPaidDocuments = requestDocuments.some(
    (doc) => 
      doc.status?.toLowerCase() === "pending" && 
      doc.paymentStatus?.toLowerCase() === "paid"
  );

  // ✅ Check if all items are cancelled and unpaid
  const allCancelledAndUnpaid = allItems.every(
    (item) => 
      item.status?.toLowerCase() === "cancelled" && 
      item.paymentStatus?.toLowerCase() === "unpaid"
  );

  // ✅ Check if personal info status is pending
  const isPersonalInfoPending = transaction.personalInfo.status?.toLowerCase() === "pending";

  // ✅ Check if personal info status is cancelled
  const isPersonalInfoCancelled = transaction.personalInfo.status?.toLowerCase() === "cancelled";

  const shouldShowQRButton = 
    (hasReadyForReleaseDocuments || hasPendingAndUnpaidDocuments) && 
    !allCancelledAndUnpaid && 
    !isPersonalInfoPending &&
    !isPersonalInfoCancelled &&
    !hasPendingAndPaidDocuments;

  // ✅ Check if should show "Cancel Request" button - only if personal info status is pending AND not cancelled
  const shouldShowCancelButton = isPersonalInfoPending && !isPersonalInfoCancelled;


  let summaryPaymentStatus: string;
  let summaryStatusColor: string;

  if (allCancelled) {
    summaryPaymentStatus = "All Canceled";
    summaryStatusColor = "#d32f2f";
  } else if (allNonCancelledPaid) {
    summaryPaymentStatus = "Fully Paid";
    summaryStatusColor = "#19AF5B";
  } else {
    summaryPaymentStatus = "Not Fully Paid";
    summaryStatusColor = "#ff6f00";
  }

  // ✅ Helper function to calculate item total
  const calculateItemTotal = (item: any) => {
    const baseFee = parseFloat(item.fee) || 0;
    const copies = item.copies || 1;
    return item.transactionType === "Request Document" 
      ? baseFee * copies 
      : baseFee;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* ✅ Loading Overlay - Shows when loading is true */}
      <LoadingOverlay 
        visible={loading} 
        message={loadingMessage}
        size="large"
        color="#19AF5B"
      />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            onPress={GoToHomeStack}
            icon={require("../../../assets/icons/arrowWhite.png")}
          />
          <Text style={styles.headerTitle}>Request Transaction Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statusContainer}>
            <TransactionStatus
              status={transaction.personalInfo.status || null}
              count_readyForRelease={readyForReleaseCount}
              goback={GoToHomeStack}
            />
            
            {/* ✅ View QR code Button - shows if ready-for-release or pending+unpaid (but not pending+paid and not cancelled) */}
            {shouldShowQRButton && (
              <View style={styles.buttonContainer}>
                <Button
                  title="View QR code"
                  onPress={() => {
                    GoToQueueScreen(transaction);
                  }}
                  fontSize={18}
                />
              </View>
            )}

            {/* ✅ Cancel Request Button - shows only if personal info status is pending AND not cancelled */}
            {shouldShowCancelButton && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel Request"
                  onPress={() => {
                    open();
                  }}
                  fontSize={18}
                />
              </View>
            )}
          </View>

          {/* Personal Info Card */}
          <Card>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Transaction Id</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.id || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Full Name</Text>
              <Text style={styles.infoValue}>{fullName || null}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Email</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.email || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Grade</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.grade || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Section</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.section || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>School Year</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.schoolYear || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Student LRN</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.studentLrn || null}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Alumni</Text>
              <Text style={styles.infoValue}>
                {transaction.personalInfo.isAlumni ? "Yes" : "No"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Created At</Text>
              <Text style={styles.infoValue}>{createdAt}</Text>
            </View>
          </Card>

          {/* Summary */}
          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Transaction Summary</Text>

            <Text style={styles.total}>Total: ₱{totalCost.toFixed(2)}</Text>

            <Text style={styles.status}>
              Payment Status:{" "}
              <Text
                style={[
                  styles.statusValue,
                  { color: summaryStatusColor },
                ]}
              >
                {summaryPaymentStatus}
              </Text>
            </Text>
          </Card>

          {/* Request Documents */}
          {requestDocuments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>
                Request Documents{" "}
                {readyForReleaseCount > 0 && (
                  <Text style={{ color: "#19AF5B" }}>
                    ({readyForReleaseCount} ready)
                  </Text>
                )}
              </Text>

              {requestDocuments.map((req, i) => (
                <View key={i} style={styles.transactionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionItem}>
                      {req.transactionDetails || null}
                    </Text>
                    <Text style={styles.smallText}>
                      Copies: {req.copies || 1}
                    </Text>
                    <Text style={styles.smallText}>
                      Status: {req.status || null}
                    </Text>
                    <Text style={styles.smallText}>
                      Payment: {req.paymentStatus || null}
                    </Text>
                  </View>
                  <View style={styles.feeColumn}>
                    <Text style={styles.transactionFee}>
                      ₱{(parseFloat(req.fee) || 0).toFixed(2)} x {req.copies || 1}
                    </Text>
                    <Text style={[styles.transactionFee, { color: "#19AF5B", fontWeight: "700" }]}>
                      ₱{calculateItemTotal(req).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Request Payments */}
          {requestPayments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>Request Payments</Text>
              {requestPayments.map((req, i) => (
                <View key={i} style={styles.transactionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionItem}>
                      {req.transactionDetails || null}
                    </Text>
                    <Text style={styles.smallText}>
                      Status: {req.status || null}
                    </Text>
                    <Text style={styles.smallText}>
                      Payment: {req.paymentStatus || null}
                    </Text>
                  </View>
                  <Text style={styles.transactionFee}>
                    ₱{(parseFloat(req.fee) || 0).toFixed(2)}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </ScrollView>

        {/* ✅ Cancel Request Transaction Modal */}
        <CancelRequestTransaction 
          visible={visible} 
          onClose={close}
          transaction={transaction}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#19AF5B" },
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#19AF5B",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    padding: 20,
  },
  statusContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginLeft: 10 },
  content: { padding: 20, gap: 15 },
  sectionTitle: { fontWeight: "700", marginBottom: 8, color: "#19AF5B" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  infoKey: { fontSize: 13, fontWeight: "600", color: "#555" },
  infoValue: { fontSize: 15, color: "#222" },
  transactionRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  transactionItem: { color: "#333", fontSize: 16, fontWeight: "600" },
  smallText: { fontSize: 12, color: "#666" },
  transactionFee: { color: "#222", fontWeight: "600" },
  feeColumn: { alignItems: "flex-end", gap: 4 },
  total: { fontWeight: "700", fontSize: 16, color: "#222", marginBottom: 8 },
  status: { fontWeight: "600", marginTop: 3, color: "#333" },
  statusValue: { fontWeight: "700" },
  transactionsCard: { marginTop: 10 },
  summaryCard: { marginTop: 10 },
});