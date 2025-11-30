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

export const useRequestTransaction = (transactions: any[] = [], personalInfoId?: number) => {
  // ---------- Local state ----------
  const [isCancelling, setIsCancelling] = useState(false);
  const [personalInfoStatus, setPersonalInfoStatus] = useState<string | null>(null);
  const [refreshedTransactions, setRefreshedTransactions] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [queueStatus, setQueueStatus] = useState<any>(null);

  // ---------- Refs ----------
  const socketRef = useRef<any | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const refetchDebounceRef = useRef<number | null>(null);
  const mountRef = useRef(true);
  const backoffTimeoutRef = useRef<any>(null);

  // ---------- Navigation ----------
  const TabNavigation = useNavigation<HomeTabNavigationProp>();

  // ---------- Initialize refreshedTransactions on mount ----------
  useEffect(() => {
    setRefreshedTransactions(prev => (prev.length === 0 && transactions.length > 0 ? [...transactions] : prev));
    mountRef.current = true;

    return () => {
      mountRef.current = false;
      if (refetchDebounceRef.current) window.clearTimeout(refetchDebounceRef.current);
      if (backoffTimeoutRef.current) clearTimeout(backoffTimeoutRef.current);
      // safely disconnect socket on unmount
      if (socketRef.current) {
        try {
          socketRef.current.disconnect();
          socketRef.current = null;
          disconnectRequestTransactionProcessSocket(personalInfoId);
        } catch (err) {
          console.warn("⚠️ Socket disconnect failed on unmount", err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Derived transactions ----------
  const activeTransactions = useMemo(() => {
    return refreshedTransactions.length > 0 ? refreshedTransactions : transactions;
  }, [refreshedTransactions, transactions]);

  const groupedTransactions = useMemo(() => {
    const map: Record<string, any[]> = {};
    (activeTransactions || []).forEach((t) => {
      const key = t.transactionType || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [activeTransactions]);

  const totalCost = useMemo(() => {
    return (activeTransactions || []).reduce((acc, t) => {
      const fee = Number.parseFloat(t?.fee ?? "0") || 0;
      const copies = Number.parseInt(t?.copies ?? "1") || 1;
      return acc + (t.transactionType === "Payment" ? fee : fee * copies);
    }, 0);
  }, [activeTransactions]);

  const paymentStatus = useMemo(() => {
    if (!activeTransactions || activeTransactions.length === 0) return "No Items";
    const statuses = activeTransactions.map(t => (t.paymentStatus ?? "").toString().toLowerCase());
    if (statuses.every(s => s === "paid")) return "Fully Paid";
    if (statuses.every(s => s === "unpaid")) return "Not Fully Paid";
    return "Partially Paid";
  }, [activeTransactions]);

  // ---------- Fetch queue status ----------
  const fetchQueueStatus = useCallback(async () => {
    if (!personalInfoId) return null;
    try {
      const q = await getQueueStatusByPersonalId(personalInfoId);
      if (mountRef.current) setQueueStatus(q ?? null);
      return q;
    } catch (err) {
      console.error("❌ fetchQueueStatus error:", err);
      if (mountRef.current) setQueueStatus(null);
      return null;
    }
  }, [personalInfoId]);

  // ---------- Refetch transactions ----------
  const refetchData = useCallback(async (reason = "manual") => {
    if (!personalInfoId) return { success: false, error: "missing personalInfoId" };
    try {
      const response = await getRequestTransactionRequest(personalInfoId);
      const updatedTransactions = Array.isArray(response?.transactions)
        ? response.transactions
        : Array.isArray(response)
          ? response
          : (response?.transactions ?? []);
      const updatedStatus = response?.personalInfo?.status ?? response?.status ?? null;

      if (Array.isArray(updatedTransactions) && updatedTransactions.length > 0) {
        if (mountRef.current) setRefreshedTransactions(() => [...updatedTransactions]);
      }

      if (updatedStatus && mountRef.current) setPersonalInfoStatus(updatedStatus);

      await fetchQueueStatus();

      return { success: true, transactions: updatedTransactions, status: updatedStatus };
    } catch (error) {
      console.error("❌ refetchData error:", error);
      return { success: false, error };
    }
  }, [personalInfoId, fetchQueueStatus]);

  // ---------- Update single transaction ----------
  const updateSingleTransaction = useCallback((transactionId: number, updates: Partial<any>) => {
    setRefreshedTransactions(prev => {
      const base = prev.length > 0 ? prev : transactions;
      if (!base || base.length === 0) return prev;
      let changed = false;
      const next = base.map(item => {
        if (item.id === transactionId) {
          changed = true;
          return { ...item, ...updates };
        }
        return item;
      });
      return changed ? next : prev;
    });
  }, [transactions]);

  // ---------- Reset hook state ----------
  const resetState = useCallback(() => {
    setRefreshedTransactions([]);
    setPersonalInfoStatus(null);
    setQueueStatus(null);
  }, []);

  // ---------- Socket handlers ----------
  const createSocketHandlers = useCallback(() => {
    return {
      onConnect: () => {
        reconnectAttemptsRef.current = 0;
        setSocketConnected(true);
        try { socketRef.current?.emit?.('joinUserRoom', { personalInfoId }); } catch (err) {}
      },
      onDisconnect: () => setSocketConnected(false),
      onPersonalInfoStatusUpdated: (data: any) => {
        const s = data?.status ?? null;
        if (mountRef.current && s) setPersonalInfoStatus(s);
        if (refetchDebounceRef.current) window.clearTimeout(refetchDebounceRef.current);
        refetchDebounceRef.current = window.setTimeout(() => {
          refetchData("socket:personalInfoStatusUpdated");
          refetchDebounceRef.current = null;
        }, 400);
      },
      onTransactionUpdated: (data: any) => {
        const txId = data?.transactionId ?? data?.id;
        if (!txId) return;
        updateSingleTransaction(Number(txId), {
          status: data?.status ?? undefined,
          paymentStatus: data?.paymentStatus ?? undefined,
        });
      },
      onAllTransactionsUpdated: (data: any) => {
        const incoming = Array.isArray(data?.transactions) ? data.transactions : (Array.isArray(data) ? data : []);
        if (incoming && incoming.length > 0 && mountRef.current) setRefreshedTransactions(() => [...incoming]);
        if (data?.personalInfoStatus && mountRef.current) setPersonalInfoStatus(data.personalInfoStatus);
      },
      onQueueStatusUpdated: (data: any) => { if (mountRef.current) setQueueStatus(data); },
      onError: (err: any) => { console.error("❌ socket error", err); }
    };
  }, [personalInfoId, refetchData, updateSingleTransaction]);

  // ---------- Socket connection effect ----------
  useEffect(() => {
    if (!personalInfoId) return;

    if (socketRef.current) {
      try { disconnectRequestTransactionProcessSocket(personalInfoId); } catch {}
      socketRef.current = null;
    }

    const socket = getRequestTransactionProcessSocket(personalInfoId);
    socketRef.current = socket;
    const handlers = createSocketHandlers();
    const registered: Array<{ event: string; handler: any }> = [];

    const register = (event: string, handler: any) => {
      try { socket.on(event, handler); registered.push({ event, handler }); } catch {}
    };

    register("connect", handlers.onConnect);
    register("disconnect", handlers.onDisconnect);
    register("personalInfoStatusUpdated", handlers.onPersonalInfoStatusUpdated);
    register("walkinStatusUpdated", handlers.onPersonalInfoStatusUpdated);
    register("transactionStatusChanged", handlers.onTransactionUpdated);
    register("singleTransactionUpdated", handlers.onTransactionUpdated);
    register("paymentStatusChanged", handlers.onTransactionUpdated);
    register("allTransactionsUpdated", handlers.onAllTransactionsUpdated);
    register("queueStatusUpdated", handlers.onQueueStatusUpdated);
    register("error", handlers.onError);
    register("connect_error", handlers.onError);

    if (socket?.connected && typeof handlers.onConnect === "function") handlers.onConnect();

    fetchQueueStatus().catch(() => {});

    return () => {
      registered.forEach(({ event, handler }) => {
        try { socket.off(event, handler); } catch {}
      });
      try { disconnectRequestTransactionProcessSocket(personalInfoId); } catch {}
      socketRef.current = null;
      setSocketConnected(false);
      resetState(); // <-- Reset when unmounting
    };
  }, [personalInfoId, createSocketHandlers, fetchQueueStatus, resetState]);

  // ---------- Navigation helpers ----------
  const GoToHomeStack = useCallback(() => {
    try {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null; }
      disconnectRequestTransactionProcessSocket(personalInfoId);
      resetState();
    } catch (err) { console.warn("⚠️ Failed to disconnect on GoToHomeStack", err); }
    TabNavigation.navigate("HomeStack");
  }, [TabNavigation, personalInfoId, resetState]);

  const GoToQueueScreen = useCallback((queueData: any) => {
    TabNavigation.navigate("RequestStack", { screen: "Queue", params: { queueData, queueStatus } });
  }, [TabNavigation, queueStatus]);

  // ---------- Cancel request ----------
  const handleCancelRequest = useCallback(async (id: number) => {
    if (!id) throw new Error("Missing id");
    try {
      setIsCancelling(true);
      await cancelTransactionRequest(id);
      await refetchData("canceled");
      return true;
    } catch (err) {
      console.error("❌ handleCancelRequest error:", err);
      throw err;
    } finally {
      if (mountRef.current) setIsCancelling(false);
    }
  }, [refetchData]);

  const refetch = useCallback(async () => refetchData("manual refresh"), [refetchData]);

  return {
    groupedTransactions,
    activeTransactions,
    totalCost,
    paymentStatus,
    transactionStatus: null,
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
    resetState,
  };
};
