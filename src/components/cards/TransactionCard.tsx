import Card from "@/src/components/cards/Card";
import { RequestStackParamList } from "@/src/types/navigation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RequestScreenNavigationProp = NativeStackNavigationProp<
  RequestStackParamList,
  "Request"
>;

function TransactionCard({ item }: { item: any }) {
  const uniqueTypes = React.useMemo(
    () => [...new Set(item.transactions.map((t: any) => t.transactionType))],
    [item.transactions]
  );

  const Requestnavigation = useNavigation<RequestScreenNavigationProp>();

  const GoToRequestTransaction = React.useCallback(() => {
    Requestnavigation.navigate("RequestStack", {
      screen: "Transaction",
      params: { transaction: item },
    });
  }, [Requestnavigation, item]);

  // ✅ Status badge colors
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "pending":
        return { bg: "#FFF3E0", text: "#E65100", icon: "schedule" };
      case "processing":
        return { bg: "#E3F2FD", text: "#1565C0", icon: "hourglass-top" };
      case "completed":
        return { bg: "#E8F5E9", text: "#2E7D32", icon: "check-circle" };
      default:
        return { bg: "#F5F5F5", text: "#666", icon: "info" };
    }
  };

  const statusColor = getStatusColor(item.personalInfo.status);

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={GoToRequestTransaction}
        activeOpacity={0.7}
      >
        {/* ✅ Header with name and status badge */}
        <View style={styles.headerContainer}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>
              {item.personalInfo.firstName} {item.personalInfo.middleName} {item.personalInfo.lastName} {item.personalInfo.suffix}
            </Text>
            <Text style={styles.email}>{item.personalInfo.email}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
            <MaterialIcons name={statusColor.icon as any} size={16} color={statusColor.text} />
            <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
              {item.personalInfo.status}
            </Text>
          </View>
        </View>

        {/* ✅ Divider */}
        <View style={styles.divider} />

        {/* ✅ Transaction types section */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionLabel}>Request Transaction</Text>
          <View style={styles.typesContainer}>
            {uniqueTypes.map((type, index) => (
              <View key={index} style={styles.typeTag}>
                <MaterialIcons name="description" size={14} color="#1EBA60" />
                <Text style={styles.typeText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ✅ Footer with date and arrow */}
        <View style={styles.footerContainer}>
          <View>
            <Text style={styles.dateLabel}>Created</Text>
            <Text style={styles.date}>
              {new Date(item.personalInfo.createdAt).toLocaleDateString()} •{" "}
              {new Date(item.personalInfo.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={18} color="#1EBA60" />
        </View>
      </TouchableOpacity>
    </Card>
  );
}

export default React.memo(TransactionCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },

  // ✅ Header styles
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1EBA60",
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: "#999",
  },

  // ✅ Status badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // ✅ Divider
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },

  // ✅ Transaction section
  transactionSection: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#D4F0E8",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1EBA60",
  },

  // ✅ Footer styles
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  dateLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
});