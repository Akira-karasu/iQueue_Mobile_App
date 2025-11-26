import Button from "@/src/components/buttons/Button";
import IconButton from "@/src/components/buttons/IconButton";
import Card from "@/src/components/cards/Card";
import TransactionStatus from "@/src/components/layout/TransactionStatus";
import CancelRequestTransaction from "@/src/components/modals/CancelRequestTransaction";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import useModal from "@/src/hooks/componentHooks/useModal";
import { RequestStackParamList } from "@/src/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

export default function RequestTransaction() {
  const { params } = useRoute<TransactionRouteProp>();
  const { transaction: initialTransaction } = params;

  const { visible, open, close } = useModal();

  const personalInfoId = initialTransaction?.personalInfo?.id;

  const { 
    GoToHomeStack, 
    GoToQueueScreen, 
    transactionStatus,
    personalInfoStatus,
    handleCancelRequest,
    activeTransactions
  } = useRequestTransaction(initialTransaction.transactions, personalInfoId);

  // ✅ Split activeTransactions by type
  const requestDocuments = useMemo(() => 
    activeTransactions.filter(t => t.transactionType === "Request Document"),
    [activeTransactions]
  );

  const requestPayments = useMemo(() => 
    activeTransactions.filter(t => t.transactionType === "Payment"),
    [activeTransactions]
  );

  // ✅ Count ready-for-release documents
  const readyForReleaseCount = useMemo(() =>
    requestDocuments.filter(doc => doc.status?.toLowerCase() === "ready-for-release").length,
    [requestDocuments]
  );

  // ✅ Total cost (excluding cancelled)
  const nonCancelledItems = useMemo(() =>
    activeTransactions.filter(item => item.status?.toLowerCase() !== "cancelled"),
    [activeTransactions]
  );

  const totalCost = useMemo(() =>
    nonCancelledItems.reduce((sum, item) => {
      const fee = parseFloat(item.fee) || 0;
      const copies = item.copies || 1;
      return sum + (item.transactionType === "Request Document" ? fee * copies : fee);
    }, 0),
    [nonCancelledItems]
  );

  // ✅ Payment status (from individual transactions)
  const allCancelled = nonCancelledItems.length === 0;
  const allNonCancelledPaid = nonCancelledItems.every(item => item.paymentStatus?.toLowerCase() === "paid");
  const summaryPaymentStatus = allCancelled
    ? "All Canceled"
    : allNonCancelledPaid
      ? "Fully Paid"
      : "Not Fully Paid";
  const summaryStatusColor = allCancelled ? "#d32f2f" : allNonCancelledPaid ? "#19AF5B" : "#ff6f00";

  // ✅ REMOVED useMemo - use value directly for real-time updates
  const currentPersonalInfoStatus = personalInfoStatus || initialTransaction.personalInfo.status;

  console.log("📊 Current Status (Direct):", {
    personalInfoStatus,
    transactionStatus,
    activeTransactionsCount: activeTransactions.length,
    currentPersonalInfoStatus,
    timestamp: new Date().toLocaleTimeString()
  });

  // ✅ Check if personalInfo status is pending - NO useMemo
  const isPersonalInfoPending = currentPersonalInfoStatus?.toLowerCase() === "pending";

  // ✅ Check if personalInfo status is cancelled - NO useMemo
  const isPersonalInfoCancelled = currentPersonalInfoStatus?.toLowerCase() === "cancelled";

  // ✅ Get transaction and payment statuses - NO useMemo, use IIFE
  const transactionStatusSummary = (() => {
    if (activeTransactions.length === 0) return "No Transactions";
    
    const statuses = activeTransactions.map(t => t.status?.toLowerCase());
    const allCompleted = statuses.every(s => s === "completed");
    const allPending = statuses.every(s => s === "pending");
    const allCancelled = statuses.every(s => s === "cancelled");
    
    if (allCompleted) return "All Completed";
    if (allPending) return "All Pending";
    if (allCancelled) return "All Cancelled";
    return "Mixed Status";
  })();

  const paymentStatusSummary = (() => {
    if (activeTransactions.length === 0) return "No Payments";
    
    const paymentStatuses = activeTransactions.map(t => t.paymentStatus?.toLowerCase());
    const allPaid = paymentStatuses.every(s => s === "paid");
    const allUnpaid = paymentStatuses.every(s => s === "unpaid");
    
    if (allPaid) return "All Paid";
    if (allUnpaid) return "All Unpaid";
    return "Partially Paid";
  })();

  // ✅ QR Button: Show if there are ready-for-release or pending unpaid documents, AND status is NOT pending/cancelled
  const shouldShowQRButton = useMemo(() => {
    const hasReadyForRelease = requestDocuments.some(d => d.status?.toLowerCase() === "ready-for-release");
    const hasPendingUnpaid = requestDocuments.some(d => 
      d.status?.toLowerCase() === "pending" && d.paymentStatus?.toLowerCase() === "unpaid"
    );
    
    const show = (hasReadyForRelease || hasPendingUnpaid) && !isPersonalInfoPending && !isPersonalInfoCancelled;
    
    console.log('🔍 shouldShowQRButton:', {
      hasReadyForRelease,
      hasPendingUnpaid,
      isPersonalInfoPending,
      isPersonalInfoCancelled,
      show
    });
    
    return show;
  }, [requestDocuments, isPersonalInfoPending, isPersonalInfoCancelled]);

  // ✅ Cancel Button: Show ONLY if personalInfo status is pending
  const shouldShowCancelButton = isPersonalInfoPending;

  console.log('🔍 shouldShowCancelButton:', {
    currentPersonalInfoStatus,
    isPersonalInfoPending,
    show: shouldShowCancelButton
  });

  // ✅ Full name and createdAt
  const fullName = [initialTransaction.personalInfo.firstName, initialTransaction.personalInfo.middleName, initialTransaction.personalInfo.lastName]
    .filter(Boolean)
    .join(" ");

  const createdAt = initialTransaction.personalInfo.createdAt
    ? new Date(initialTransaction.personalInfo.createdAt).toLocaleString("en-US", {
        month: "long", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
      })
    : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton onPress={GoToHomeStack} icon={require("../../../assets/icons/arrowWhite.png")} />
          <Text style={styles.headerTitle}>Request Transaction Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Transaction Status & Buttons */}
          <View style={styles.statusContainer}>
            <TransactionStatus
              status={currentPersonalInfoStatus || null}
              count_readyForRelease={readyForReleaseCount}
              goback={GoToHomeStack}
            />

            {/* ✅ QR Button */}
            {shouldShowQRButton && (
              <View style={styles.buttonContainer}>
                <Button
                  title="View QR code"
                  onPress={() => {
                    console.log('📋 Navigating to Queue:', {
                      documents: requestDocuments.length,
                      payments: requestPayments.length,
                      personalInfoStatus: currentPersonalInfoStatus,
                      transactionStatus
                    });
                    GoToQueueScreen({ 
                      ...initialTransaction, 
                      transactions: activeTransactions,
                      personalInfo: {
                        ...initialTransaction.personalInfo,
                        status: currentPersonalInfoStatus
                      }
                    });
                  }}
                  fontSize={18}
                />
              </View>
            )}

            {/* ✅ Cancel Button - Show ONLY when personalInfo status is pending */}
            {shouldShowCancelButton && (
              <View style={styles.buttonContainer}>
                <Button 
                  title="Cancel Request" 
                  onPress={open} 
                  fontSize={18}
                />
              </View>
            )}
          </View>

          {/* Personal Info Card */}
          <Card>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {[
              ["Transaction Id", initialTransaction.personalInfo.id],
              ["Full Name", fullName],
              ["Email", initialTransaction.personalInfo.email],
              ["Grade", initialTransaction.personalInfo.grade],
              ["Section", initialTransaction.personalInfo.section],
              ["School Year", initialTransaction.personalInfo.schoolYear],
              ["Student LRN", initialTransaction.personalInfo.studentLrn],
              ["Alumni", initialTransaction.personalInfo.isAlumni ? "Yes" : "No"],
              ["Created At", createdAt],
            ].map(([key, value]) => (
              <View style={styles.infoRow} key={key as string}>
                <Text style={styles.infoKey}>{key}</Text>
                <Text style={[styles.infoValue, key === "Request Status" && { color: 
                  currentPersonalInfoStatus?.toLowerCase() === "pending" ? "#ff6f00" : 
                  currentPersonalInfoStatus?.toLowerCase() === "cancelled" ? "#d32f2f" : 
                  currentPersonalInfoStatus?.toLowerCase() === "completed" ? "#19AF5B" :
                  "#666"
                }]}>{value || "-"}</Text>
              </View>
            ))}
          </Card>

          {/* Transaction Summary */}
          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Transaction Summary</Text>
            <Text style={styles.total}>Total: ₱{totalCost.toFixed(2)}</Text>
            <Text style={styles.status}>
              Payment Status: <Text style={[styles.statusValue, { color: summaryStatusColor }]}>{summaryPaymentStatus}</Text>
            </Text>
          </Card>

          {/* Request Documents */}
          {requestDocuments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>
                Request Documents {readyForReleaseCount > 0 && <Text style={{ color: "#19AF5B" }}>({readyForReleaseCount} ready)</Text>}
              </Text>
              {requestDocuments.map((doc) => (
                <View key={doc.id} style={styles.transactionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionItem}>{doc.transactionDetails || "-"}</Text>
                    <Text style={styles.smallText}>Copies: {doc.copies || 1}</Text>
                    <Text style={[styles.smallText, { 
                      color: doc.status?.toLowerCase() === "completed" ? "#19AF5B" :
                             doc.status?.toLowerCase() === "cancelled" ? "#d32f2f" :
                             doc.status?.toLowerCase() === "ready-for-release" ? "#19AF5B" :
                             "#ff6f00"
                    }]}>Status: {doc.status || "-"}</Text>
                    <Text style={[styles.smallText, { 
                      color: doc.paymentStatus?.toLowerCase() === "paid" ? "#19AF5B" :
                             doc.paymentStatus?.toLowerCase() === "unpaid" ? "#d32f2f" :
                             "#666"
                    }]}>Payment: {doc.paymentStatus || "-"}</Text>
                  </View>
                  <View style={styles.feeColumn}>
                    <Text style={styles.transactionFee}>₱{(parseFloat(doc.fee) || 0).toFixed(2)} x {doc.copies || 1}</Text>
                    <Text style={[styles.transactionFee, { color: "#19AF5B", fontWeight: "700" }]}>
                      ₱{((parseFloat(doc.fee) || 0) * (doc.copies || 1)).toFixed(2)}
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
              {requestPayments.map((pay) => (
                <View key={pay.id} style={styles.transactionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionItem}>{pay.transactionDetails || "-"}</Text>
                    <Text style={[styles.smallText, { 
                      color: pay.status?.toLowerCase() === "completed" ? "#19AF5B" :
                             pay.status?.toLowerCase() === "cancelled" ? "#d32f2f" :
                             "#ff6f00"
                    }]}>Status: {pay.status || "-"}</Text>
                    <Text style={[styles.smallText, { 
                      color: pay.paymentStatus?.toLowerCase() === "paid" ? "#19AF5B" :
                             pay.paymentStatus?.toLowerCase() === "unpaid" ? "#d32f2f" :
                             "#666"
                    }]}>Payment: {pay.paymentStatus || "-"}</Text>
                  </View>
                  <Text style={styles.transactionFee}>₱{(parseFloat(pay.fee) || 0).toFixed(2)}</Text>
                </View>
              ))}
            </Card>
          )}

        </ScrollView>

        {/* Cancel Modal */}
        <CancelRequestTransaction visible={visible} onClose={close} transaction={initialTransaction} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#19AF5B" },
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#19AF5B", paddingVertical: 15, paddingHorizontal: 10 },
  buttonContainer: { padding: 20 },
  statusContainer: { alignItems: "center", backgroundColor: "#fff", padding: 15 },
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