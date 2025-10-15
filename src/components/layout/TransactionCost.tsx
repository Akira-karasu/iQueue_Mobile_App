import { useRequestStore } from "@/src/store/requestStore";
import { StyleSheet, Text, View } from "react-native";
import Button from "../buttons/Button";

export type TransactionCostProps = {
  openCancel: () => void;
  openSubmit: () => void;
};

function TransactionCost({ openCancel, openSubmit }: TransactionCostProps) {
  // 🧠 Get both request lists directly from the store
  const registrarRequestList = useRequestStore(
    (state) => state.RegistrarRequestList.requestList
  );

  const accountingRequestList = useRequestStore(
    (state) => state.AccountingRequestList.requestList
  );

  // 🧮 Compute Registrar total
  const registrarTotal = registrarRequestList.reduce(
    (sum, item) => sum + item.Price * item.Quantity,
    0
  );

  // 💵 Compute Accounting total
  const accountingTotal = accountingRequestList.reduce(
    (sum, item) => sum + item.Price,
    0
  );

  // 🧾 Compute grand total
  const grandTotal = registrarTotal + accountingTotal;

  return (
    <View style={styles.container}>
      {/* 🧮 Show both subtotals */}
      <View style={styles.TransactCostContainer}>
        <Text style={styles.transactText}>Registrar Total</Text>
        <Text style={styles.priceText}>₱ {registrarTotal.toFixed(2)}</Text>
      </View>

      <View style={styles.TransactCostContainer}>
        <Text style={styles.transactText}>Accounting Total</Text>
        <Text style={styles.priceText}>₱ {accountingTotal.toFixed(2)}</Text>
      </View>

      {/* 🧾 Grand total summary */}
      <View style={[styles.TransactCostContainer, styles.grandTotalContainer]}>
        <Text style={styles.grandTotalText}>Total Cost</Text>
        <Text style={styles.grandTotalPrice}>₱ {grandTotal.toFixed(2)}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          backgroundColor="#AEAEAE"
          width="45%"
          color="#191919ff"
          fontSize={18}
          onPress={openCancel}
        />
        <Button
          title="Submit"
          fontSize={18}
          width="45%"
          onPress={openSubmit}
          disabled={grandTotal === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#ccc",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  TransactCostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  transactText: {
    color: "#A3A3A3",
    fontWeight: "600",
    fontSize: 18,
  },
  priceText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 18,
  },
  grandTotalContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 8,
  },
  grandTotalText: {
    color: "#191919",
    fontWeight: "700",
    fontSize: 20,
  },
  grandTotalPrice: {
    color: "#19AF5B",
    fontWeight: "800",
    fontSize: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
});

export default TransactionCost;
