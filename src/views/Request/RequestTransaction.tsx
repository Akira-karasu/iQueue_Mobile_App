import { RequestStackParamList } from "@/src/types/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TransactionRouteProp = RouteProp<RequestStackParamList, "Transaction">;

export default function RequestTransaction() {
  const { params } = useRoute<TransactionRouteProp>();
  const { transaction } = params;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Transaction Details</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{transaction.personalInfo.fullName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{transaction.personalInfo.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>School Year:</Text>
          <Text style={styles.value}>{transaction.personalInfo.schoolYear}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#19AF5B",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: 120,
  },
  value: {
    color: "#222",
    flexShrink: 1,
  },
});
