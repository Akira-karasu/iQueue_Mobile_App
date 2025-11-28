import Button from "@/src/components/buttons/Button";
import IconButton from "@/src/components/buttons/IconButton";
import Card from "@/src/components/cards/Card";
import TransactionStatus from "@/src/components/layout/TransactionStatus";
import CancelRequestTransaction from "@/src/components/modals/CancelRequestTransaction";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import useModal from "@/src/hooks/componentHooks/useModal";
import { RequestStackParamList } from "@/src/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

// ✅ OPTIMIZATION: Extract color logic into constants
const STATUS_COLORS = {
  completed: "#19AF5B",
  cancelled: "#d32f2f",
  readyForRelease: "#19AF5B",
  pending: "#ff6f00",
  paid: "#19AF5B",
  unpaid: "#d32f2f",
  default: "#666"
};

// ✅ OPTIMIZATION: Extract helper functions
const getStatusColor = (status: string | null | undefined, type: "status" | "payment" = "status") => {
  if (!status) return STATUS_COLORS.default;
  const lower = status.toLowerCase();
  
  if (type === "status") {
    return STATUS_COLORS[lower as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
  } else {
    return lower === "paid" ? STATUS_COLORS.paid : lower === "unpaid" ? STATUS_COLORS.unpaid : STATUS_COLORS.default;
  }
};

const formatFullName = (firstName: string, middleName: string, lastName: string) => {
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
};

const formatDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
};

export default function RequestTransaction() {
  const { params } = useRoute<TransactionRouteProp>();
  const { transaction: initialTransaction } = params;

  const { visible, open, close } = useModal();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const personalInfoId = initialTransaction?.personalInfo?.id;

  const { 
    GoToHomeStack, 
    GoToQueueScreen, 
    personalInfoStatus,
    handleCancelRequest,
    activeTransactions,
    isCancelling,
    refetch,
  } = useRequestTransaction(initialTransaction.transactions, personalInfoId);

  // ✅ OPTIMIZATION: Remove unnecessary logs from handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch?.();
    } catch (error) {
      console.error('❌ Refresh Error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // ✅ OPTIMIZATION: Combine related filters into single memos
  const { requestDocuments, requestPayments } = useMemo(() => {
    return {
      requestDocuments: activeTransactions.filter(t => t.transactionType === "Request Document"),
      requestPayments: activeTransactions.filter(t => t.transactionType === "Payment"),
    };
  }, [activeTransactions]);

  const readyForReleaseCount = useMemo(() =>
    requestDocuments.filter(doc => doc.status?.toLowerCase() === "ready-for-release").length,
    [requestDocuments]
  );

  // ✅ OPTIMIZATION: Combine cost calculation logic
  const { nonCancelledItems, totalCost } = useMemo(() => {
    const nonCancelled = activeTransactions.filter(item => item.status?.toLowerCase() !== "cancelled");
    const total = nonCancelled.reduce((sum, item) => {
      const fee = parseFloat(item.fee) || 0;
      const copies = item.copies || 1;
      return sum + (item.transactionType === "Request Document" ? fee * copies : fee);
    }, 0);
    return { nonCancelledItems: nonCancelled, totalCost: total };
  }, [activeTransactions]);

  // ✅ OPTIMIZATION: Combine payment status logic
  const { allCancelled, allNonCancelledPaid, summaryPaymentStatus, summaryStatusColor } = useMemo(() => {
    const cancelled = nonCancelledItems.length === 0;
    const paid = nonCancelledItems.every(item => item.paymentStatus?.toLowerCase() === "paid");
    return {
      allCancelled: cancelled,
      allNonCancelledPaid: paid,
      summaryPaymentStatus: cancelled ? "All Canceled" : paid ? "Fully Paid" : "Not Fully Paid",
      summaryStatusColor: cancelled ? "#d32f2f" : paid ? "#19AF5B" : "#ff6f00",
    };
  }, [nonCancelledItems]);

  // ✅ OPTIMIZATION: Use computed value directly
  const currentPersonalInfoStatus = personalInfoStatus || initialTransaction.personalInfo.status;

  const isPersonalInfoPending = useMemo(() =>
    currentPersonalInfoStatus?.toLowerCase() === "pending",
    [currentPersonalInfoStatus]
  );

  const isPersonalInfoCancelled = useMemo(() =>
    currentPersonalInfoStatus?.toLowerCase() === "cancelled",
    [currentPersonalInfoStatus]
  );

  // ✅ OPTIMIZATION: Memoize status summaries
  const transactionStatusSummary = useMemo(() => {
    if (activeTransactions.length === 0) return "No Transactions";
    const statuses = activeTransactions.map(t => t.status?.toLowerCase());
    if (statuses.every(s => s === "completed")) return "All Completed";
    if (statuses.every(s => s === "pending")) return "All Pending";
    if (statuses.every(s => s === "cancelled")) return "All Cancelled";
    return "Mixed Status";
  }, [activeTransactions]);

  const paymentStatusSummary = useMemo(() => {
    if (activeTransactions.length === 0) return "No Payments";
    const statuses = activeTransactions.map(t => t.paymentStatus?.toLowerCase());
    if (statuses.every(s => s === "paid")) return "All Paid";
    if (statuses.every(s => s === "unpaid")) return "All Unpaid";
    return "Partially Paid";
  }, [activeTransactions]);

  // ✅ OPTIMIZATION: Memoize button visibility with cleaner logic
  const shouldShowQRButton = useMemo(() => {
    if (isPersonalInfoPending || isPersonalInfoCancelled) return false;
    const hasReadyForRelease = requestDocuments.some(d => d.status?.toLowerCase() === "ready-for-release");
    const hasPendingUnpaid = requestDocuments.some(d => 
      d.status?.toLowerCase() === "pending" && d.paymentStatus?.toLowerCase() === "unpaid"
    );
    return hasReadyForRelease || hasPendingUnpaid;
  }, [requestDocuments, isPersonalInfoPending, isPersonalInfoCancelled]);

  const shouldShowCancelButton = isPersonalInfoPending;

  // ✅ OPTIMIZATION: Precompute formatted values
  const fullName = useMemo(() =>
    formatFullName(
      initialTransaction.personalInfo.firstName,
      initialTransaction.personalInfo.middleName,
      initialTransaction.personalInfo.lastName
    ),
    [initialTransaction.personalInfo]
  );

  const createdAt = useMemo(() =>
    formatDate(initialTransaction.personalInfo.createdAt),
    [initialTransaction.personalInfo.createdAt]
  );

  // ✅ OPTIMIZATION: Extract personal info data into constant
  const personalInfoData = useMemo(() => [
    ["Transaction Id", initialTransaction.personalInfo.id],
    ["Full Name", fullName],
    ["Email", initialTransaction.personalInfo.email],
    ["Grade", initialTransaction.personalInfo.grade],
    ["Section", initialTransaction.personalInfo.section],
    ["School Year", initialTransaction.personalInfo.schoolYear],
    ["Student LRN", initialTransaction.personalInfo.studentLrn],
    ["Alumni", initialTransaction.personalInfo.isAlumni ? "Yes" : "No"],
    ["Created At", createdAt],
  ], [initialTransaction.personalInfo, fullName, createdAt]);

  const handleQRPress = useCallback(() => {
    GoToQueueScreen({ 
      ...initialTransaction, 
      transactions: activeTransactions,
      personalInfo: {
        ...initialTransaction.personalInfo,
        status: currentPersonalInfoStatus
      }
    });
  }, [initialTransaction, activeTransactions, currentPersonalInfoStatus, GoToQueueScreen]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton onPress={GoToHomeStack} icon={require("../../../assets/icons/arrowWhite.png")} />
          <Text style={styles.headerTitle}>Request Transaction Details</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#19AF5B"
              titleColor="#19AF5B"
              title="Pull to refresh"
              progressBackgroundColor="#fff"
            />
          }
        >
          {/* Transaction Status & Buttons */}
          <View style={styles.statusContainer}>
            <TransactionStatus
              status={currentPersonalInfoStatus || null}
              count_readyForRelease={readyForReleaseCount}
              goback={GoToHomeStack}
            />

            {shouldShowQRButton && (
              <View style={styles.buttonContainer}>
                <Button
                  title="View QR code"
                  onPress={handleQRPress}
                  fontSize={18}
                />
              </View>
            )}

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
            {personalInfoData.map(([key, value]) => (
              <View style={styles.infoRow} key={key as string}>
                <Text style={styles.infoKey}>{key}</Text>
                <Text style={styles.infoValue}>{value || "-"}</Text>
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
                <TransactionItemRow key={doc.id} transaction={doc} type="document" />
              ))}
            </Card>
          )}

          {/* Request Payments */}
          {requestPayments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>Request Payments</Text>
              {requestPayments.map((pay) => (
                <TransactionItemRow key={pay.id} transaction={pay} type="payment" />
              ))}
            </Card>
          )}

        </ScrollView>

        {/* Cancel Modal */}
        <CancelRequestTransaction 
          visible={visible} 
          onClose={close} 
          transaction={initialTransaction}
          onCancel={handleCancelRequest}
          isCancelling={isCancelling}
        />
      </View>
    </SafeAreaView>
  );
}

// ✅ OPTIMIZATION: Extract repeated transaction row rendering
const TransactionItemRow = React.memo(({ transaction, type }: { transaction: any; type: "document" | "payment" }) => {
  const fee = parseFloat(transaction.fee) || 0;
  const copies = transaction.copies || 1;
  const total = fee * copies;

  return (
    <View style={styles.transactionRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionItem}>{transaction.transactionDetails || "-"}</Text>
        {type === "document" && <Text style={styles.smallText}>Copies: {copies}</Text>}
        <Text style={[styles.smallText, { color: getStatusColor(transaction.status, "status") }]}>
          Status: {transaction.status || "-"}
        </Text>
        <Text style={[styles.smallText, { color: getStatusColor(transaction.paymentStatus, "payment") }]}>
          Payment: {transaction.paymentStatus || "-"}
        </Text>
      </View>
      <View style={styles.feeColumn}>
        {type === "document" && (
          <Text style={styles.transactionFee}>₱{fee.toFixed(2)} x {copies}</Text>
        )}
        <Text style={[styles.transactionFee, { color: "#19AF5B", fontWeight: "700" }]}>
          ₱{total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
});

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