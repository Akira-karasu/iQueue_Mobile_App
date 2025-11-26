import { cancelTransactionRequest, getQueueStatusByPersonalId, getRequestTransactionRequest } from "@/src/services/OfficeService";
import {
  disconnectRequestTransactionProcessSocket,
  getRequestTransactionProcessSocket
} from "@/src/services/socket";
import { AppTabsParamList } from "@/src/types/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type HomeTabNavigationProp = BottomTabNavigationProp<AppTabsParamList, "HomeStack">;

export const useRequestTransaction = (transactions: any[], personalInfoId: number) => {

  // ✅ STATE
  const [isCancelling, setIsCancelling] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [personalInfoStatus, setPersonalInfoStatus] = useState<string | null>(null);
  const [refreshedTransactions, setRefreshedTransactions] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any>(null);

  // ✅ REFS (for cleanup & socket management)
  const socketRef = useRef<any>(null);
  const reconnectAttemptRef = useRef(0);
  const refetchTimeoutRef = useRef<any>(null);
  const connectTimeoutRef = useRef<any>(null);

  // ✅ NAVIGATION
  const TabNavigation = useNavigation<HomeTabNavigationProp>();

  // ✅ INITIALIZE refreshedTransactions with transactions on mount
  useEffect(() => {
    if (refreshedTransactions.length === 0 && transactions.length > 0) {
      console.log("📥 Initializing refreshedTransactions with:", transactions.length, "items");
      setRefreshedTransactions(transactions);
    }
  }, [transactions]);

  // ✅ MEMOIZATION - activeTransactions from socket OR initial
  const activeTransactions = useMemo(() => {
    const result = refreshedTransactions.length > 0 ? refreshedTransactions : transactions;
    console.log("🔄 activeTransactions computed:", result.length, "items");
    return result;
  }, [refreshedTransactions, transactions]);

  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    activeTransactions.forEach((t) => {
      const type = t.transactionType || "Other";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(t);
    });
    console.log("📊 Grouped transactions:", Object.keys(grouped));
    return grouped;
  }, [activeTransactions]);

  const totalCost = useMemo(() => {
    const total = activeTransactions.reduce((sum, t) => {
      const fee = parseFloat(t.fee || "0") || 0;
      const copies = parseInt(t.copies || "1") || 1;
      const isPayment = t.transactionType === "Payment";
      return sum + (isPayment ? fee : fee * copies);
    }, 0);
    console.log("💰 Total cost:", total);
    return total;
  }, [activeTransactions]);

  const paymentStatus = useMemo(() => {
    if (activeTransactions.length === 0) return "No Items";
    const allPaid = activeTransactions.every((t) => t.paymentStatus?.toLowerCase() === "paid");
    const allUnpaid = activeTransactions.every((t) => t.paymentStatus?.toLowerCase() === "unpaid");
    const status = allPaid ? "Fully Paid" : allUnpaid ? "Not Fully Paid" : "Partially Paid";
    console.log("💳 Payment status:", status);
    return status;
  }, [activeTransactions]);

  // ✅ Fetch queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      console.log("📊 Fetching queue status for personalInfoId:", personalInfoId);
      const status = await getQueueStatusByPersonalId(personalInfoId);
      
      if (status) {
        console.log("✅ Queue status fetched:", status);
        setQueueStatus(status);
      }
    } catch (error) {
      console.error("❌ Failed to fetch queue status:", error);
      setQueueStatus(null);
    }
  }, [personalInfoId]);

  // ✅ Refetch function
  const refetchData = useCallback(async (statusMessage: string) => {
    try {
      console.log("🔄 Refetching data...", statusMessage);
      const response = await getRequestTransactionRequest(personalInfoId);
      const updatedTransactions = response?.transactions || response || [];
      const updatedStatus = response?.personalInfo?.status || null;
      
      if (Array.isArray(updatedTransactions) && updatedTransactions.length > 0) {
        console.log("✅ Data refetched:", updatedTransactions.length, "items");
        
        // ✅ Verify transaction details are preserved
        console.log("📄 Refetched transactions details:", updatedTransactions.map(t => ({
          id: t.id,
          name: t.transactionDetails,
          fee: t.fee,
          copies: t.copies,
          status: t.status,
          paymentStatus: t.paymentStatus,
        })));
        
        setRefreshedTransactions(updatedTransactions);
        
        if (updatedStatus) {
          console.log("✅ Updated personalInfoStatus:", updatedStatus);
          setPersonalInfoStatus(updatedStatus);
        }
      }

      // ✅ Also fetch queue status after refetch
      await fetchQueueStatus();
    } catch (error) {
      console.error("❌ Refetch error:", error);
    }
  }, [personalInfoId, fetchQueueStatus]);

  // ✅ Update individual transaction - FIXED: Only update specified fields
  const updateSingleTransaction = useCallback((transactionId: number, updates: any) => {
    console.log("🔄 updateSingleTransaction called:", { 
      transactionId, 
      updates: {
        status: updates.status,
        paymentStatus: updates.paymentStatus,
      }
    });
    
    setRefreshedTransactions((prevTransactions) => {
      const validTransactions = prevTransactions.length > 0 ? prevTransactions : transactions;
      
      if (validTransactions.length === 0) {
        console.warn("⚠️ No transactions to update!");
        return prevTransactions;
      }
      
      const updated = validTransactions.map((transaction) => {
        if (transaction.id === transactionId) {
          // ✅ FIX: Only update the specified fields, preserve everything else
          const updatedTransaction = { 
            ...transaction, 
            ...updates 
          };
          
          console.log("📝 Updated transaction details:", {
            id: updatedTransaction.id,
            transactionDetails: updatedTransaction.transactionDetails,
            fee: updatedTransaction.fee,
            copies: updatedTransaction.copies,
            status: updatedTransaction.status,
            paymentStatus: updatedTransaction.paymentStatus,
          });
          
          return updatedTransaction;
        }
        return transaction;
      });
      
      return updated;
    });
  }, [transactions]);

  // ✅ SOCKET CONNECTION - MAIN EFFECT
  useEffect(() => {
    if (!personalInfoId) {
      console.warn("⚠️ Missing personalInfoId");
      return;
    }

    console.log("📡 STEP 1: Setting up socket for personalInfoId:", personalInfoId);
    setSocketConnected(false);

    // ✅ Fetch queue status on mount
    fetchQueueStatus();

    const socket = getRequestTransactionProcessSocket(personalInfoId);
    socketRef.current = socket;

    console.log("🔍 Socket info:", {
      connected: socket.connected,
      id: socket.id,
      personalInfoId
    });

    // ✅ STEP 2: On socket connect
    const handleConnect = () => {
      console.log("✅ STEP 2: Socket connected:", socket.id);
      reconnectAttemptRef.current = 0;
      setSocketConnected(true);
      
      console.log("📤 STEP 3: Emitting joinUserRoom with personalInfoId:", personalInfoId);
      socket.emit('joinUserRoom', { personalInfoId });
    };

    // ✅ STEP 4: On room joined
    const handleRoomJoined = (data: any) => {
      console.log("✅ STEP 4: Joined room:", data.roomName);
      
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };

    // ✅ STEP 5a: Personal Info Status Updated
    const handlePersonalInfoStatusUpdated = (data: any) => {
      console.log("📡 STEP 5a: PersonalInfo status updated:", data.status);
      setPersonalInfoStatus(data.status);

      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = setTimeout(() => {
        refetchData(`Status changed to ${data.status}`);
      }, 500);
    };

    // ✅ STEP 5b: Walkin Status Updated
    const handleWalkinStatusUpdated = (data: any) => {
      console.log("📡 STEP 5b: Walkin status updated:", data.status);
      setPersonalInfoStatus(data.status);

      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = setTimeout(() => {
        refetchData(`Updated: ${data.status}`);
      }, 500);
    };

    // ✅ STEP 5c: Transaction Status Changed - REAL-TIME UPDATE
    const handleTransactionStatusChanged = (data: any) => {
      console.log("📡 STEP 5c: Transaction status changed:", {
        transactionId: data.transactionId,
        oldStatus: "previous",
        newStatus: data.status
      });
      
      // ✅ Update the transaction immediately
      updateSingleTransaction(data.transactionId, {
        status: data.status,
      });
      
      setTransactionStatus(data.status);
      
      console.log("✅ Transaction status updated in UI");
    };

    // ✅ STEP 5d: Single Transaction Updated - REAL-TIME UPDATE
    const handleSingleTransactionUpdated = (data: any) => {
      console.log("📡 STEP 5d: Single transaction updated:", {
        id: data.transactionId || data.id,
        oldStatus: "previous",
        newStatus: data.status,
        oldPaymentStatus: "previous",
        newPaymentStatus: data.paymentStatus
      });
      
      const transactionId = data.transactionId || data.id;
      
      // ✅ Update both status and paymentStatus
      updateSingleTransaction(transactionId, {
        status: data.status,
        paymentStatus: data.paymentStatus,
      });
      
      console.log("✅ Single transaction updated in UI");
    };

    // ✅ STEP 5d2: Payment Status Changed - REAL-TIME UPDATE
    const handlePaymentStatusChanged = (data: any) => {
      console.log("📡 STEP 5d2: Payment status changed:", {
        id: data.transactionId || data.id,
        oldPaymentStatus: "previous",
        newPaymentStatus: data.paymentStatus
      });
      
      const transactionId = data.transactionId || data.id;
      
      // ✅ Update paymentStatus only
      updateSingleTransaction(transactionId, {
        paymentStatus: data.paymentStatus,
      });
      
      console.log("✅ Payment status updated in UI");
    };

    // ✅ STEP 5e: All Transactions Updated
    const handleAllTransactionsUpdated = (data: any) => {
      console.log("📡 STEP 5e: All transactions updated:", data.transactions?.length || 0);
      
      const updatedTransactions = data.transactions || data;
      if (Array.isArray(updatedTransactions)) {
        console.log("📄 All transactions refetched, verifying details:", 
          updatedTransactions.map(t => ({
            id: t.id,
            name: t.transactionDetails,
            fee: t.fee,
            status: t.status,
            paymentStatus: t.paymentStatus,
          }))
        );
        setRefreshedTransactions(updatedTransactions);
      }
      
      if (data.personalInfoStatus) {
        setPersonalInfoStatus(data.personalInfoStatus);
      }
    };

    // ✅ STEP 5f: Personal Info Changed
    const handlePersonalInfoChanged = (data: any) => {
      console.log("📡 STEP 5f: PersonalInfo changed:", data);
      
      if (data.status) {
        setPersonalInfoStatus(data.status);
      }

      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = setTimeout(() => {
        refetchData("Updated");
      }, 500);
    };

    // ✅ On disconnect
    const handleDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setSocketConnected(false);
    };

    // ✅ Error handling
    const handleConnectError = (error: any) => {
      console.error("❌ Connection error:", error);
    };

    // ✅ Register all listeners
    socket.on("connect", handleConnect);
    socket.on('roomJoined', handleRoomJoined);
    socket.on('personalInfoStatusUpdated', handlePersonalInfoStatusUpdated);
    socket.on('walkinStatusUpdated', handleWalkinStatusUpdated);
    socket.on('transactionStatusChanged', handleTransactionStatusChanged);
    socket.on('singleTransactionUpdated', handleSingleTransactionUpdated);
    socket.on('paymentStatusChanged', handlePaymentStatusChanged);
    socket.on('allTransactionsUpdated', handleAllTransactionsUpdated);
    socket.on('personalInfoChanged', handlePersonalInfoChanged);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // ✅ If already connected, call handleConnect immediately
    if (socket.connected) {
      console.log("✅ Socket already connected, calling handleConnect immediately");
      handleConnect();
    }

    // ✅ Timeout: If connection takes too long, show error
    connectTimeoutRef.current = setTimeout(() => {
      if (!socketConnected) {
        console.error("⏱️ Socket connection timeout");
      }
    }, 10000); // 10 second timeout

    // ✅ CLEANUP
    return () => {
      console.log("🧹 Cleaning up socket");
      
      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off('roomJoined', handleRoomJoined);
      socket.off('personalInfoStatusUpdated', handlePersonalInfoStatusUpdated);
      socket.off('walkinStatusUpdated', handleWalkinStatusUpdated);
      socket.off('transactionStatusChanged', handleTransactionStatusChanged);
      socket.off('singleTransactionUpdated', handleSingleTransactionUpdated);
      socket.off('paymentStatusChanged', handlePaymentStatusChanged);
      socket.off('allTransactionsUpdated', handleAllTransactionsUpdated);
      socket.off('personalInfoChanged', handlePersonalInfoChanged);
      socket.off("connect_error", handleConnectError);
      
      disconnectRequestTransactionProcessSocket(personalInfoId);
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [personalInfoId, updateSingleTransaction, refetchData, fetchQueueStatus]);

  // ✅ NAVIGATION ACTIONS
  const GoToHomeStack = useCallback(() => {
    TabNavigation.navigate("HomeStack");
  }, [TabNavigation]);

  const GoToQueueScreen = useCallback((queueData: any) => {
    TabNavigation.navigate("RequestStack", {
      screen: "Queue",
      params: { queueData, queueStatus },
    });
  }, [TabNavigation, queueStatus]);

  // ✅ CANCEL REQUEST
  const handleCancelRequest = useCallback(
    async (id: number) => {
      try {
        setIsCancelling(true);

        await cancelTransactionRequest(id);
        await refetchData("Cancelled!");
        
        return true;
      } catch (error: any) {
        console.error('❌ Cancel error:', error);
        throw error;
      } finally {
        setIsCancelling(false);
      }
    },
    [refetchData]
  );

  return {
    groupedTransactions,
    activeTransactions,
    totalCost,
    paymentStatus,
    transactionStatus,
    personalInfoStatus,
    queueStatus,
    socketConnected,
    isCancelling,
    GoToHomeStack,
    GoToQueueScreen,
    handleCancelRequest,
    refetchData,
    updateSingleTransaction,
    fetchQueueStatus,
  };
};