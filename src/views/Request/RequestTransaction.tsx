import Card from "@/src/components/cards/Card";
import TransactionStatus from "@/src/components/layout/TransactionStatus";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import { RequestStackParamList } from "@/src/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

export default function RequestTransaction() {
  const { params } = useRoute<TransactionRouteProp>();
  const { transaction } = params;

  const { GoToHomeStack, groupedTransactions, totalCost } =
    useRequestTransaction(transaction.transactions);

  const requestDocuments = groupedTransactions["Request Document"] || [];
  const requestPayments = groupedTransactions["Payment"] || [];

  // Combine firstName, middleName, lastName into Full Name
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

  // ----------------------------------------------------------
  // ✅ PAYMENT STATUS LOGIC (Fully Paid / Not Fully Paid)
  // ----------------------------------------------------------

  const allPaid = [...requestDocuments, ...requestPayments].every(
    (item) => item.paymentStatus?.toLowerCase() === "paid"
  );

  const summaryPaymentStatus = allPaid ? "Fully Paid" : "Not Fully Paid";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Request Transaction Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <TransactionStatus
            status={transaction.personalInfo.status || null}
            goback={GoToHomeStack}
          />

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
                  { color: allPaid ? "green" : "red" },
                ]}
              >
                {summaryPaymentStatus}
              </Text>
            </Text>
          </Card>

          {/* Request Documents */}
          {requestDocuments.length > 0 && (
            <Card style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>Request Documents</Text>
              {requestDocuments.map((req, i) => (
                <View key={i} style={styles.transactionRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transactionItem}>
                      {req.transactionDetails || null}
                    </Text>
                    <Text style={styles.smallText}>Copies: {req.copies || 1}</Text>
                    <Text style={styles.smallText}>
                      Status: {req.status || null}
                    </Text>
                    <Text style={styles.smallText}>
                      Payment: {req.paymentStatus || null}
                    </Text>
                  </View>
                  <Text style={styles.transactionFee}>
                    ₱{req.fee || "0.00"}
                  </Text>
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
                    ₱{req.fee || "0.00"}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </ScrollView>
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
  total: { fontWeight: "700", fontSize: 16, color: "#222", marginBottom: 8 },
  status: { fontWeight: "600", marginTop: 3, color: "#333" },
  statusValue: { fontWeight: "700" },
  transactionsCard: { marginTop: 10 },
  summaryCard: { marginTop: 10 },
});
