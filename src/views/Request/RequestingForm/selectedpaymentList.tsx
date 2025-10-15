import Card from "@/src/components/cards/Card";
import { useRequest } from "@/src/hooks/appTabHooks/useRequest";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./RequestFormStyle";

 function SelectedPaymentList() {
  const { selectedpayment, removePayment, totalPaymentCost } = useRequest();

  return (
    <Card padding={25}>
      <Text style={styles.TextTitle}>Accounting Office | Request Payment</Text>

      {selectedpayment.map((item: any) => (
        <View style={styles.selectedComponent} key={item.PaymentFees}>

            <View>
                <Text style={styles.SelectedText}>{item.PaymentFees}</Text>
                <Text style={styles.priceText}>₱{item.Price.toFixed(2)}</Text>
            </View>

          <TouchableOpacity
            onPress={() => removePayment(item.PaymentFees)}
            style={styles.removeButton}
          >
            <Text style={styles.minusText}>remove</Text>
          </TouchableOpacity>
        </View>
      ))}

    </Card>
  );
}


export default React.memo(SelectedPaymentList);
