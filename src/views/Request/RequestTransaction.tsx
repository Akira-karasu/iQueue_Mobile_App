import Button from "@/src/components/buttons/Button";
import IconButton from "@/src/components/buttons/IconButton";
import Card from "@/src/components/cards/Card";
import TransactionStatus from "@/src/components/layout/TransactionStatus";
import CancelRequestTransaction from "@/src/components/modals/CancelRequestTransaction";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import useModal from "@/src/hooks/componentHooks/useModal";
import { RequestStackParamList } from "@/src/types/navigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

const STATUS_COLORS = {
  completed: "#10B981",
  cancelled: "#EF4444",
  readyForRelease: "#10B981",
  pending: "#F59E0B",
  processing: "#3B82F6",
  paid: "#10B981",
  unpaid: "#EF4444",
  default: "#6B7280"
};

const getStatusColor = (status: string | null | undefined, type: "status" | "payment" = "status") => {
  if (!status) return STATUS_COLORS.default;
  const lower = status.toLowerCase();
  return STATUS_COLORS[lower as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

const getStatusIcon = (status: string) => {
  const lower = status?.toLowerCase() || "";
  if (lower === "completed" || lower === "paid" || lower === "ready-for-release") return "check-circle";
  if (lower === "pending") return "schedule";
  if (lower === "processing") return "hourglass-top";
  if (lower === "cancelled" || lower === "unpaid") return "cancel";
  return "info";
};

const formatFullName = (firstName: string, middleName: string, lastName: string) => {
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
};

const formatDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
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

  const { nonCancelledItems, totalCost } = useMemo(() => {
    const nonCancelled = activeTransactions.filter(item => item.status?.toLowerCase() !== "cancelled");
    const total = nonCancelled.reduce((sum, item) => {
      const fee = parseFloat(item.fee) || 0;
      const copies = item.copies || 1;
      return sum + (item.transactionType === "Request Document" ? fee * copies : fee);
    }, 0);
    return { nonCancelledItems: nonCancelled, totalCost: total };
  }, [activeTransactions]);

  const { allCancelled, allNonCancelledPaid, summaryPaymentStatus, summaryStatusColor } = useMemo(() => {
    const cancelled = nonCancelledItems.length === 0;
    const paid = nonCancelledItems.every(item => item.paymentStatus?.toLowerCase() === "paid");
    return {
      allCancelled: cancelled,
      allNonCancelledPaid: paid,
      summaryPaymentStatus: cancelled ? "All Canceled" : paid ? "Fully Paid" : "Not Fully Paid",
      summaryStatusColor: cancelled ? STATUS_COLORS.cancelled : paid ? STATUS_COLORS.paid : STATUS_COLORS.pending,
    };
  }, [nonCancelledItems]);

  const currentPersonalInfoStatus = personalInfoStatus || initialTransaction.personalInfo.status;

  const isPersonalInfoPending = useMemo(() =>
    currentPersonalInfoStatus?.toLowerCase() === "pending",
    [currentPersonalInfoStatus]
  );

  const isPersonalInfoCancelled = useMemo(() =>
    currentPersonalInfoStatus?.toLowerCase() === "cancelled",
    [currentPersonalInfoStatus]
  );

  const shouldShowQRButton = useMemo(() => {
    if (isPersonalInfoPending || isPersonalInfoCancelled) return false;
    const hasReadyForRelease = requestDocuments.some(d => d.status?.toLowerCase() === "ready-for-release");
    const hasPendingUnpaid = requestDocuments.some(d => 
      d.status?.toLowerCase() === "pending" && d.paymentStatus?.toLowerCase() === "unpaid"
    );
    const allUnpaid = activeTransactions.every(item => 
      item.paymentStatus?.toLowerCase() === "unpaid"
    );
    return hasReadyForRelease || hasPendingUnpaid || allUnpaid;
  }, [requestDocuments, activeTransactions, isPersonalInfoPending, isPersonalInfoCancelled]);

  const shouldShowCancelButton = isPersonalInfoPending;

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
        {/* ✅ Redesigned Header */}
        <View style={styles.header}>
          <IconButton onPress={GoToHomeStack} icon={require("../../../assets/icons/arrowWhite.png")} />
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#10B981"
              titleColor="#10B981"
              title="Pull to refresh"
              progressBackgroundColor="#fff"
            />
          }
        >
          {/* ✅ Status Badge Card */}
             <TransactionStatus
              status={currentPersonalInfoStatus || null}
              count_readyForRelease={readyForReleaseCount}
              goback={GoToHomeStack}
            />
          {/* ✅ Action Buttons */}
          <View style={styles.buttonsGrid}>
            {shouldShowQRButton && (
              <Button
                title="View Queue"
                onPress={handleQRPress}
                fontSize={14}
              />
            )}
            {shouldShowCancelButton && (
              <Button 
                title="Cancel Request" 
                onPress={open} 
                fontSize={14}
              />
            )}
          </View>

          {/* ✅ Personal Info Card - Redesigned */}
          <Card style={styles.personalInfoCard}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="person" size={20} color="#10B981" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.personalInfoGrid}>
              <InfoItem label="Name" value={fullName} />
              <InfoItem label="Email" value={initialTransaction.personalInfo.email} />
              <InfoItem label="Student LRN" value={initialTransaction.personalInfo.studentLrn} />
              <InfoItem label="Grade" value={initialTransaction.personalInfo.grade} />
              <InfoItem label="Section" value={initialTransaction.personalInfo.section} />
              <InfoItem label="School Year" value={initialTransaction.personalInfo.schoolYear} />
              <InfoItem label="Alumni" value={initialTransaction.personalInfo.isAlumni ? "Yes" : "No"} />
              <InfoItem label="Created" value={createdAt} />
            </View>
          </Card>

          {/* ✅ Transaction Summary - Redesigned */}
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard}>
              <View style={styles.summaryCardContent}>
                <MaterialIcons name="attach-money" size={28} color="#10B981" />
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryAmount}>₱{totalCost.toFixed(2)}</Text>
              </View>
            </Card>

            <Card style={styles.summaryCard}>
              <View style={styles.summaryCardContent}>
                <MaterialIcons name="payment" size={28} color={summaryStatusColor} />
                <Text style={styles.summaryLabel}>Payment Status</Text>
                <Text style={[styles.summaryAmount, { color: summaryStatusColor, fontSize: 16 }]}>
                  {summaryPaymentStatus}
                </Text>
              </View>
            </Card>
          </View>

          {/* ✅ Request Documents - Redesigned */}
          {requestDocuments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="description" size={20} color="#10B981" />
                <Text style={styles.cardTitle}>
                  Request Documents ({requestDocuments.length})
                </Text>
              </View>
              <View style={styles.transactionsList}>
                {requestDocuments.map((doc, index) => (
                  <TransactionItemRow 
                    key={doc.id} 
                    transaction={doc} 
                    type="document"
                    isLast={index === requestDocuments.length - 1}
                  />
                ))}
              </View>
            </Card>
          )}

          {/* ✅ Request Payments - Redesigned */}
          {requestPayments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <View style={styles.cardHeader}>
                <MaterialIcons name="receipt" size={20} color="#3B82F6" />
                <Text style={styles.cardTitle}>
                  Request Payments ({requestPayments.length})
                </Text>
              </View>
              <View style={styles.transactionsList}>
                {requestPayments.map((pay, index) => (
                  <TransactionItemRow 
                    key={pay.id} 
                    transaction={pay} 
                    type="payment"
                    isLast={index === requestPayments.length - 1}
                  />
                ))}
              </View>
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

// ✅ Info Item Component
const InfoItem = React.memo(({ label, value }: { label: string; value: string | null | undefined }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "-"}</Text>
  </View>
));

// ✅ Redesigned Transaction Row
const TransactionItemRow = React.memo(({ 
  transaction, 
  type, 
  isLast 
}: { 
  transaction: any; 
  type: "document" | "payment";
  isLast: boolean;
}) => {
  const fee = parseFloat(transaction.fee) || 0;
  const copies = transaction.copies || 1;
  const total = fee * copies;
  const statusColor = getStatusColor(transaction.status, "status");
  const paymentColor = getStatusColor(transaction.paymentStatus, "payment");

  // ✅ Format estimated date - ONLY for documents
  const estimatedDate = type === "document" && transaction.estimatedDate 
    ? new Date(transaction.estimatedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : type === "document" ? "No Schedule" : null;

  return (
    <>
      <View style={styles.transactionItemContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.transactionItemTitle}>{transaction.transactionDetails || "-"}</Text>
          
          {/* ✅ Show Estimated Date ONLY for documents */}
          {type === "document" && (
            <View style={styles.estimatedDateContainer}>
              <MaterialIcons name="calendar-today" size={14} color="#666" />
              <Text style={styles.estimatedDateText}>{estimatedDate}</Text>
            </View>
          )}
          
          <View style={styles.transactionMeta}>
            {type === "document" && (
              <View style={styles.metaTag}>
                <MaterialIcons name="content-copy" size={14} color="#666" />
                <Text style={styles.metaText}>×{copies}</Text>
              </View>
            )}
            
            <View style={[styles.metaTag, { backgroundColor: statusColor + "20" }]}>
              <MaterialIcons name={getStatusIcon(transaction.status) as any} size={12} color={statusColor} />
              <Text style={[styles.metaText, { color: statusColor, fontWeight: "600" }]}>
                {transaction.status}
              </Text>
            </View>

            <View style={[styles.metaTag, { backgroundColor: paymentColor + "20" }]}>
              <MaterialIcons name={getStatusIcon(transaction.paymentStatus) as any} size={12} color={paymentColor} />
              <Text style={[styles.metaText, { color: paymentColor, fontWeight: "600" }]}>
                {transaction.paymentStatus}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.priceColumn}>
          {type === "document" && (
            <Text style={styles.unitPrice}>₱{fee.toFixed(2)}/pc</Text>
          )}
          <Text style={styles.totalPrice}>₱{total.toFixed(2)}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#10B981" },
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  
  // ✅ Header
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    backgroundColor: "#10B981", 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    elevation: 2,
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700", 
    flex: 1,
    textAlign: "center",
  },

  estimatedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F0F9FF",
    borderRadius: 6,
    width: "auto",
  },
  estimatedDateText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0369A1",
  },
  
  // ✅ Content
  content: { 
    padding: 16, 
    gap: 16,
  },

  // ✅ Status Badge Card
  statusBadgeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  statusBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadgeLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statusBadgeValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
    textTransform: "capitalize",
  },
  readyBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  readyBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // ✅ Buttons
  buttonsGrid: {
    gap: 12,
  },

  // ✅ Cards
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },

    // ✅ Personal Info
  personalInfoCard: {
    backgroundColor: "#fff",
  },
  personalInfoGrid: {
    flexDirection: "column",
    gap: 12,
  },
  infoItem: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },


  // ✅ Summary
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  summaryCardContent: {
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
  },

  // ✅ Transactions
  transactionsCard: {
    backgroundColor: "#fff",
  },
  transactionsList: {
    gap: 0,
  },
  transactionItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 12,
  },
  transactionItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  transactionMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  metaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  metaText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceColumn: {
    alignItems: "flex-end",
    gap: 4,
  },
  unitPrice: {
    fontSize: 12,
    color: "#6B7280",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});