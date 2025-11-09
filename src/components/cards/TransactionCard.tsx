// src/components/TransactionCard.tsx
import Card from "@/src/components/cards/Card";
import { RequestStackParamList } from "@/src/types/navigation";
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



  return (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={GoToRequestTransaction}
        style={styles.personalInfoContainer}
      >
        <Text style={styles.name}>{item.personalInfo.firstName}, {item.personalInfo.middleName}, {item.personalInfo.lastName}</Text>

        <Text style={styles.sectionLabel}>Request Transactions</Text>

        <View style={{ marginBottom: 8 }}>
          {uniqueTypes.map((type, index) => (
            <Text key={index} style={styles.bulletItem}>
              • {type}
            </Text>
          ))}
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.status}>{item.personalInfo.status}</Text>
        </View>

        <Text style={styles.date}>
          Created: {new Date(item.personalInfo.createdAt).toLocaleDateString()} •{" "}
          {new Date(item.personalInfo.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    </Card>
  );
}

export default React.memo(TransactionCard); // ✅ <--- prevents re-renders

const styles = StyleSheet.create({
  card: { marginBottom: 10, borderRadius: 8, backgroundColor: "#DDFFEC", elevation: 2 },
  personalInfoContainer: { padding: 6 },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 5, color: "#00A15D" },
  sectionLabel: { fontSize: 15, fontWeight: "600", marginTop: 5, color: "#333" },
  bulletItem: { fontSize: 14, color: "#444", marginLeft: 10 },
  statusLabel: { fontSize: 15, fontWeight: "600" },
  status: { fontSize: 14, fontWeight: "600", color: "#C68E00" },
  date: { fontSize: 12, color: "#999", marginTop: 5 },
});
