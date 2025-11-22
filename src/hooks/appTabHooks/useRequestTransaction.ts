import { cancelTransactionRequest } from "@/src/services/OfficeService";
import { AppTabsParamList } from "@/src/types/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";

type HomeTabNavigationProp = BottomTabNavigationProp<AppTabsParamList, "HomeStack">;

export const useRequestTransaction = (transactions: any[]) => {

  // fetching data and socket listeners can be added here
  useEffect(() => {
  setLoading(true);
  setLoadingMessage("Loading request transaction...");

  // simulate fetch or initialization
  setTimeout(() => {
    setLoading(false);
  }, 1500);
}, []);


  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const TabNavigation = useNavigation<HomeTabNavigationProp>();
  const [isCancelling, setIsCancelling] = useState(false);

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

  // ✅ Handle cancel request transaction
  const handleCancelRequest = React.useCallback(
    async (personalInfoId: number) => {
      try {
        setIsCancelling(true);
        const result = await cancelTransactionRequest(personalInfoId);
        console.log('✅ Cancelled:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Cancel error:', error);
        throw new Error(error.message || 'Failed to cancel request');
      } finally {
        setIsCancelling(false);
      }
    },
    []
  );

  return {
    GoToHomeStack,
    groupedTransactions,
    totalCost,
    paymentStatus,
    GoToQueueScreen,
    handleCancelRequest,
    isCancelling,
    loading, setLoading, 
    loadingMessage, setLoadingMessage
  };
};