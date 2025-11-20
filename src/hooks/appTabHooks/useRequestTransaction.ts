import { AppTabsParamList } from "@/src/types/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";


type HomeTabNavigationProp = BottomTabNavigationProp<AppTabsParamList, "HomeStack">;

export const useRequestTransaction = (transactions: any[]) => {

    const TabNavigation = useNavigation<HomeTabNavigationProp>();

      const GoToHomeStack = React.useCallback(() => {
        TabNavigation.navigate("HomeStack");
      }, [TabNavigation]);

      const GoToQueueScreen = React.useCallback((queueData: any) => {
        TabNavigation.navigate("RequestStack", {
          screen: "Queue",
          params: { queueData },
        });
      }, [TabNavigation]);
    
  // ✅ Group transactions by type
  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    transactions.forEach((t) => {
      if (!grouped[t.transactionType]) {
        grouped[t.transactionType] = [];
      }
      grouped[t.transactionType].push(t);
    });
    return grouped;
  }, [transactions]);

  // ✅ Compute total cost
  const totalCost = useMemo(() => {
    return transactions.reduce((sum, t) => {
      const fee = parseFloat(t.fee || "0");
      const copies = parseInt(t.copies || "0");
      return sum + (t.transactionType === "Payment" ? fee : fee * copies);
    }, 0);
  }, [transactions]);

  // ✅ Compute payment status
  const paymentStatus = useMemo(() => {
    const allPaid = transactions.every((t) => t.paymentStatus === "Paid");
    const allUnpaid = transactions.every((t) => t.paymentStatus === "Unpaid");
    if (allPaid) return "Fully Paid";
    if (allUnpaid) return "Not Fully Paid";
    return "Partially Paid";
  }, [transactions]);

  return {
    GoToHomeStack,
    groupedTransactions,
    totalCost,
    paymentStatus,
    GoToQueueScreen,
  };
};
