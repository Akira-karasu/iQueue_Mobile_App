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

  // ✅ INITIALIZE refreshedTransactions with transactions on mount - FIXED
  useEffect(() => {
    if (refreshedTransactions.length === 0 && transactions.length > 0) {
      console.log("📥 Initializing refreshedTransactions with:", transactions.length, "items");
      setRefreshedTransactions([...transactions]); // ✅ Create new array reference
    }
  }, []); // ✅ FIXED: Empty dependency - only run on mount

  // ✅ MEMOIZATION - activeTransactions from socket OR initial - FIXED
  const activeTransactions = useMemo(() => {
    const result = refreshedTransactions.length > 0 ? refreshedTransactions : transactions;
    console.log("🔄 activeTransactions computed:", result.length, "items", {
      fromSocket: refreshedTransactions.length > 0,
      timestamp: new Date().toLocaleTimeString()
    });
    return result;
  }, [refreshedTransactions, transactions]); // ✅ Depends on both arrays

  // ✅ Debug: Log when data changes
  useEffect(() => {
    console.log("📊 activeTransactions changed:", {
      count: activeTransactions.length,
      transactions: activeTransactions.map(t => ({
        id: t.id,
        status: t.status,
        paymentStatus: t.paymentStatus
      }))
    });
  }, [activeTransactions]);

  // ✅ OPTIMIZATION: Memoize grouped transactions separately
  const groupedTransactions = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    activeTransactions.forEach((t) => {
      const type = t.transactionType || "Other";
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(t);
    });
    return grouped;
  }, [activeTransactions]);

  // ✅ OPTIMIZATION: Calculate totalCost efficiently
  const totalCost = useMemo(() => {
    return activeTransactions.reduce((sum, t) => {
      const fee = parseFloat(t.fee || "0") || 0;
      const copies = parseInt(t.copies || "1") || 1;
      return sum + (t.transactionType === "Payment" ? fee : fee * copies);
    }, 0);
  }, [activeTransactions]);

  // ✅ OPTIMIZATION: Simplify paymentStatus calculation
  const paymentStatus = useMemo(() => {
    if (activeTransactions.length === 0) return "No Items";
    const statuses = activeTransactions.map(t => t.paymentStatus?.toLowerCase());
    if (statuses.every(s => s === "paid")) return "Fully Paid";
    if (statuses.every(s => s === "unpaid")) return "Not Fully Paid";
    return "Partially Paid";
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

  // ✅ OPTIMIZATION: Refetch function with better error handling
  const refetchData = useCallback(async (statusMessage: string) => {
    try {
      console.log("🔄 Refetching data...", statusMessage);
      const response = await getRequestTransactionRequest(personalInfoId);
      const updatedTransactions = Array.isArray(response?.transactions) 
        ? response.transactions 
        : Array.isArray(response) 
          ? response 
          : [];
      const updatedStatus = response?.personalInfo?.status || null;

      if (updatedTransactions.length > 0) {
        console.log("✅ Data refetched:", updatedTransactions.length, "items");
        setRefreshedTransactions([...updatedTransactions]); // ✅ Create new reference
      }

      if (updatedStatus) {
        console.log("✅ Updated personalInfoStatus:", updatedStatus);
        setPersonalInfoStatus(updatedStatus);
      }

      // ✅ Fetch queue status after refetch
      await fetchQueueStatus();

      return { success: true, transactions: updatedTransactions, status: updatedStatus };
    } catch (error) {
      console.error("❌ Refetch error:", error);
      return { success: false, error };
    }
  }, [personalInfoId, fetchQueueStatus]);

  // ✅ OPTIMIZATION: Update individual transaction more efficiently
  const updateSingleTransaction = useCallback((transactionId: number, updates: any) => {
    setRefreshedTransactions((prevTransactions) => {
      const validTransactions = prevTransactions.length > 0 ? prevTransactions : transactions;

      if (validTransactions.length === 0) return prevTransactions;

      return validTransactions.map((transaction) =>
        transaction.id === transactionId 
          ? { ...transaction, ...updates }
          : transaction
      );
    });
  }, [transactions]);

  // ✅ OPTIMIZATION: Extract socket event handlers into separate functions
  const createSocketHandlers = useCallback(() => {
    return {
      handleConnect: () => {
        console.log("✅ Socket connected");
        reconnectAttemptRef.current = 0;
        setSocketConnected(true);
        socketRef.current?.emit('joinUserRoom', { personalInfoId });
      },

      handleRoomJoined: () => {
        console.log("✅ Room joined");
        if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
      },

      handleStatusUpdate: (data: any, source: string) => {
        console.log(`📡 ${source}:`, data.status);
        setPersonalInfoStatus(data.status);
        if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
        refetchTimeoutRef.current = setTimeout(() => {
          refetchData(`${source}: ${data.status}`);
        }, 500);
      },

      handleTransactionUpdate: (data: any) => {
        const transactionId = data.transactionId || data.id;
        console.log("📝 Updating single transaction:", transactionId, {
          status: data.status,
          paymentStatus: data.paymentStatus
        });
        updateSingleTransaction(transactionId, {
          status: data.status,
          paymentStatus: data.paymentStatus,
        });
      },

      handleAllTransactionsUpdated: (data: any) => {
        const updatedTransactions = data.transactions || data;
        if (Array.isArray(updatedTransactions) && updatedTransactions.length > 0) {
          console.log("✅ Updating all transactions from socket:", updatedTransactions.length);
          setRefreshedTransactions([...updatedTransactions]); // ✅ Create new reference
        }
        if (data.personalInfoStatus) {
          console.log("✅ Updating personalInfoStatus:", data.personalInfoStatus);
          setPersonalInfoStatus(data.personalInfoStatus);
        }
      },

      handleQueueStatusUpdated: (data: any) => {
        console.log("📊 Queue status updated:", data);
        setQueueStatus(data);
      },

      handleDisconnect: () => {
        console.log("❌ Socket disconnected");
        setSocketConnected(false);
      },
    };
  }, [personalInfoId, refetchData, updateSingleTransaction]);

 // ✅ SOCKET CONNECTION - MAIN EFFECT (FULLY FIXED)
useEffect(() => {
  if (!personalInfoId) {
    console.warn("⚠️ Missing personalInfoId");
    return;
  }

  console.log("📡 Setting up socket for personalInfoId:", personalInfoId);
  setSocketConnected(false);
  fetchQueueStatus();

  const socket = getRequestTransactionProcessSocket(personalInfoId);
  socketRef.current = socket;

  const handlers = createSocketHandlers();
  const registeredHandlers: Array<[string, any]> = [];

  // ✅ FIX 1: Proper listener registration with tracking
  const registerListener = (event: string, handler: any) => {
    socket.on(event, handler);
    registeredHandlers.push([event, handler]);
  };

  try {
    // ✅ Register all listeners
    registerListener("connect", handlers.handleConnect);
    registerListener("roomJoined", handlers.handleRoomJoined);
    registerListener("personalInfoStatusUpdated", (data: any) => 
      handlers.handleStatusUpdate(data, "PersonalInfo Updated")
    );
    registerListener("walkinStatusUpdated", (data: any) => 
      handlers.handleStatusUpdate(data, "Walkin Updated")
    );
    registerListener("transactionStatusChanged", (data: any) => 
      handlers.handleTransactionUpdate({ ...data, paymentStatus: data.paymentStatus })
    );
    registerListener("singleTransactionUpdated", handlers.handleTransactionUpdate);
    registerListener("paymentStatusChanged", (data: any) => 
      handlers.handleTransactionUpdate({ ...data, status: data.status })
    );
    registerListener("allTransactionsUpdated", handlers.handleAllTransactionsUpdated);
    registerListener("queueStatusUpdated", handlers.handleQueueStatusUpdated);
    registerListener("personalInfoChanged", (data: any) => {
      if (data.status) setPersonalInfoStatus(data.status);
      if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = setTimeout(() => refetchData("PersonalInfo Changed"), 500);
    });
    registerListener("disconnect", handlers.handleDisconnect);
    registerListener("connect_error", (error: any) => {
      console.error("❌ Connection error:", error);
      setSocketConnected(false);
    });
    registerListener("error", (error: any) => {
      console.error("❌ Socket error:", error);
    });

    // ✅ FIX 2: Handle already connected socket
    if (socket.connected) {
      console.log("✅ Socket already connected");
      handlers.handleConnect();
    }

    // ✅ FIX 3: Better timeout handling
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    
    connectTimeoutRef.current = setTimeout(() => {
      if (!socketRef.current?.connected) {
        console.error("⏱️ Socket connection timeout - attempting reconnect");
        try {
          socket.connect();
        } catch (err) {
          console.error("❌ Reconnect failed:", err);
        }
      }
    }, 10000);

  } catch (error) {
    console.error("❌ Error setting up socket listeners:", error);
    setSocketConnected(false);
  }

  // ✅ FIX 4: Proper cleanup with tracked handlers
  return () => {
    console.log("🧹 Cleaning up socket");
    
    // Clear timeouts
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
      refetchTimeoutRef.current = null;
    }
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }

    // Remove all registered listeners
    registeredHandlers.forEach(([event, handler]) => {
      try {
        socket.off(event, handler);
      } catch (err) {
        console.error(`❌ Error removing listener for ${event}:`, err);
      }
    });
    registeredHandlers.length = 0; // Clear array

    // Disconnect socket
    try {
      disconnectRequestTransactionProcessSocket(personalInfoId);
    } catch (err) {
      console.error("❌ Error disconnecting socket:", err);
    }

    socketRef.current = null;
    setSocketConnected(false);
  };
}, [personalInfoId, refetchData, createSocketHandlers, fetchQueueStatus]);

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

  // ✅ PUBLIC REFETCH FUNCTION
  const refetch = useCallback(async () => {
    console.log("🔄 Refetch called from component");
    return await refetchData("Manual refresh");
  }, [refetchData]);

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
    refetch,
  };
};