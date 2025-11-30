import { cancelTransactionRequest, getQueueStatusByPersonalId, getRequestTransactionRequest } from "@/src/services/OfficeService";
import { disconnectRequestTransactionProcessSocket, getRequestTransactionProcessSocket } from "@/src/services/socket";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface RequestTransactionContextType {
  activeTransactions: any[];
  personalInfoStatus: string | null;
  queueStatus: any;
  socketConnected: boolean;
  isCancelling: boolean;
  refetch: (message: string) => Promise<any>;
  handleCancelRequest: (id: number) => Promise<boolean>;
  updateSingleTransaction: (id: number, updates: any) => void;
}

const RequestTransactionContext = createContext<RequestTransactionContextType | undefined>(undefined);

export const RequestTransactionProvider: React.FC<{ children: React.ReactNode; personalInfoId: number; initialTransactions: any[] }> = ({ 
  children, 
  personalInfoId, 
  initialTransactions 
}) => {
  // ✅ STATE
  const [isCancelling, setIsCancelling] = useState(false);
  const [personalInfoStatus, setPersonalInfoStatus] = useState<string | null>(null);
  const [refreshedTransactions, setRefreshedTransactions] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any>(null);

  // ✅ REFS
  const socketRef = useRef<any>(null);
  const refetchTimeoutRef = useRef<any>(null);
  const connectTimeoutRef = useRef<any>(null);
  const listenerCountRef = useRef(0);

  // ✅ Initialize transactions once
  useEffect(() => {
    if (refreshedTransactions.length === 0 && initialTransactions.length > 0) {
      console.log("📥 Context: Initializing transactions:", initialTransactions.length);
      setRefreshedTransactions([...initialTransactions]);
    }
  }, []);

  // ✅ Active transactions selector
  const activeTransactions = refreshedTransactions.length > 0 ? refreshedTransactions : initialTransactions;

  // ✅ Fetch queue status
  const fetchQueueStatus = useCallback(async () => {
    try {
      const status = await getQueueStatusByPersonalId(personalInfoId);
      if (status) {
        console.log("✅ Context: Queue status fetched");
        setQueueStatus(status);
      }
    } catch (error) {
      console.error("❌ Context: Failed to fetch queue status:", error);
    }
  }, [personalInfoId]);

  // ✅ Refetch data
  const refetchData = useCallback(async (statusMessage: string) => {
    try {
      console.log("🔄 Context: Refetching data...", statusMessage);
      const response = await getRequestTransactionRequest(personalInfoId);
      const updatedTransactions = Array.isArray(response?.transactions) ? response.transactions : [];
      const updatedStatus = response?.personalInfo?.status || null;

      if (updatedTransactions.length > 0) {
        console.log("✅ Context: Data refetched, updating all screens");
        setRefreshedTransactions([...updatedTransactions]);
      }

      if (updatedStatus) {
        setPersonalInfoStatus(updatedStatus);
      }

      await fetchQueueStatus();
      return { success: true, transactions: updatedTransactions, status: updatedStatus };
    } catch (error) {
      console.error("❌ Context: Refetch error:", error);
      return { success: false, error };
    }
  }, [personalInfoId, fetchQueueStatus]);

  // ✅ Update single transaction
  const updateSingleTransaction = useCallback((transactionId: number, updates: any) => {
    setRefreshedTransactions((prev) => {
      const valid = prev.length > 0 ? prev : initialTransactions;
      return valid.map((t) => t.id === transactionId ? { ...t, ...updates } : t);
    });
  }, [initialTransactions]);

  // ✅ Create socket handlers
  const createSocketHandlers = useCallback(() => {
    return {
      handleConnect: () => {
        console.log("✅ Context Socket: Connected");
        setSocketConnected(true);
        socketRef.current?.emit('joinUserRoom', { personalInfoId });
      },

      handleStatusUpdate: (data: any, source: string) => {
        console.log(`📡 Context: ${source}:`, data.status);
        setPersonalInfoStatus(data.status);
        if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
        refetchTimeoutRef.current = setTimeout(() => refetchData(`${source}: ${data.status}`), 500);
      },

      handleTransactionUpdate: (data: any) => {
        const id = data.transactionId || data.id;
        console.log("📝 Context: Single transaction updated:", id);
        updateSingleTransaction(id, {
          status: data.status,
          paymentStatus: data.paymentStatus,
        });
      },

      handleAllTransactionsUpdated: (data: any) => {
        const updated = data.transactions || data;
        if (Array.isArray(updated) && updated.length > 0) {
          console.log("✅ Context: All transactions updated from socket");
          setRefreshedTransactions([...updated]);
        }
        if (data.personalInfoStatus) {
          setPersonalInfoStatus(data.personalInfoStatus);
        }
      },

      handleQueueStatusUpdated: (data: any) => {
        console.log("📊 Context: Queue status updated");
        setQueueStatus(data);
      },

      handleDisconnect: () => {
        console.log("❌ Context Socket: Disconnected");
        setSocketConnected(false);
      },
    };
  }, [personalInfoId, refetchData, updateSingleTransaction]);

  // ✅ Socket connection - SHARED across all screens
  useEffect(() => {
    if (!personalInfoId) return;

    console.log("📡 Context: Setting up shared socket");
    listenerCountRef.current += 1;

    const socket = getRequestTransactionProcessSocket(personalInfoId);
    socketRef.current = socket;

    const handlers = createSocketHandlers();

    const eventListeners = [
      ["connect", handlers.handleConnect],
      ["personalInfoStatusUpdated", (data: any) => handlers.handleStatusUpdate(data, "PersonalInfo")],
      ["walkinStatusUpdated", (data: any) => handlers.handleStatusUpdate(data, "Walkin")],
      ["transactionStatusChanged", (data: any) => handlers.handleTransactionUpdate(data)],
      ["singleTransactionUpdated", handlers.handleTransactionUpdate],
      ["paymentStatusChanged", (data: any) => handlers.handleTransactionUpdate(data)],
      ["allTransactionsUpdated", handlers.handleAllTransactionsUpdated],
      ["queueStatusUpdated", handlers.handleQueueStatusUpdated],
      ["personalInfoChanged", (data: any) => {
        if (data.status) setPersonalInfoStatus(data.status);
        if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
        refetchTimeoutRef.current = setTimeout(() => refetchData("PersonalInfo Changed"), 500);
      }],
      ["disconnect", handlers.handleDisconnect],
      ["connect_error", (error: any) => {
        console.error("❌ Connection error:", error);
        setSocketConnected(false);
      }],
    ];

    eventListeners.forEach(([event, handler]) => {
      socket.on(event as string, handler as any);
    });

    if (socket.connected) {
      handlers.handleConnect();
    }

    fetchQueueStatus();

    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    connectTimeoutRef.current = setTimeout(() => {
      if (!socketRef.current?.connected) {
        console.error("⏱️ Socket timeout - reconnecting");
        try {
          socket.connect();
        } catch (err) {
          console.error("❌ Reconnect failed:", err);
        }
      }
    }, 10000);

    // ✅ CLEANUP - Only disconnect if this is the last listener
    return () => {
      listenerCountRef.current -= 1;
      console.log(`🧹 Context: Cleanup, remaining listeners: ${listenerCountRef.current}`);

      if (listenerCountRef.current === 0) {
        console.log("🧹 Context: All screens unmounted, disconnecting socket");
        
        if (refetchTimeoutRef.current) clearTimeout(refetchTimeoutRef.current);
        if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);

        eventListeners.forEach(([event]) => {
          try {
            socket.off(event as string);
          } catch (err) {
            console.error(`Error removing listener for ${event}:`, err);
          }
        });

        try {
          disconnectRequestTransactionProcessSocket(personalInfoId);
        } catch (err) {
          console.error("Error disconnecting:", err);
        }

        socketRef.current = null;
        setSocketConnected(false);
      }
    };
  }, [personalInfoId, createSocketHandlers, fetchQueueStatus, refetchData]);

  // ✅ Cancel request
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

  // ✅ Public refetch
  const refetch = useCallback(async (message: string = "Manual refresh") => {
    console.log("🔄 Context: Refetch called");
    return await refetchData(message);
  }, [refetchData]);

  const value: RequestTransactionContextType = {
    activeTransactions,
    personalInfoStatus,
    queueStatus,
    socketConnected,
    isCancelling,
    refetch,
    handleCancelRequest,
    updateSingleTransaction,
  };

  return (
    <RequestTransactionContext.Provider value={value}>
      {children}
    </RequestTransactionContext.Provider>
  );
};

// ✅ Custom hook to use context
export const useRequestTransactionContext = () => {
  const context = useContext(RequestTransactionContext);
  if (!context) {
    throw new Error('useRequestTransactionContext must be used within RequestTransactionProvider');
  }
  return context;
};