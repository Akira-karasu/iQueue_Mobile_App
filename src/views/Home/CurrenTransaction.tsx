import TransactionCard from "@/src/components/cards/TransactionCard";
import { useAuth } from "@/src/context/authContext";
import { getTransactionRecordSocket } from "@/src/services/socket";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CurrentTransaction() {
  type UserData = {
    personalInfo: {
      id: string;
      email: string;
      createdAt: string;
    };
  };

  const { getUser } = useAuth();
  const email = getUser().email;
  const id = getUser().id;

  const [fullData, setFullData] = useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null); // <-- New state

  useEffect(() => {
    if (!email) return;

    const socket = getTransactionRecordSocket(email);

    console.log("🔌 Connecting to /transactionRecord...");

    socket.on("connect", () => {
      console.log("✅ Connected to transactionRecord socket");
      setConnectionError(null); // Clear previous errors
      try {
        socket.emit("currentTransactionRecord", { email });
      } catch (err) {
        console.error("⚠️ Failed to emit currentTransactionRecord:", err);
        setConnectionError("Failed to request transaction records.");
        setLoading(false);
      }
    });

    const handleRecords = (records: any) => {
      try {
        if (!records?.users || !Array.isArray(records.users)) {
          console.warn("⚠️ Received invalid data format:", records);
          setFullData({ users: [] });
          setLoading(false);
          return;
        }

        const sortedUsers = records.users.sort(
          (a: UserData, b: UserData) =>
            new Date(b.personalInfo.createdAt).getTime() -
            new Date(a.personalInfo.createdAt).getTime()
        );

        setFullData({ users: sortedUsers });
        setLoading(false);
      } catch (err) {
        console.error("⚠️ Error processing transaction records:", err);
        setFullData({ users: [] });
        setLoading(false);
      }
    };

    socket.on("currentTransactionRecord", handleRecords);

    // <-- Error handling
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      setConnectionError("Unable to connect. Please check your internet.");
      setLoading(false);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      if (!connectionError) {
        setConnectionError("Connection lost. Trying to reconnect...");
      }
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
      setConnectionError("An unexpected error occurred.");
      setLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("currentTransactionRecord", handleRecords);
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("error");
    };
  }, [email]);

  const renderItem = useCallback(({ item }: { item: UserData }) => {
    return <TransactionCard item={item} />;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1EBA60" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (connectionError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", textAlign: "center", padding: 20 }}>
          {connectionError}
        </Text>
      </View>
    );
  }

  const displayedData = showAll ? fullData.users : fullData.users.slice(0, 3);

  return (
    <View style={[styles.containerList, { flexShrink: 1 }]}>
      <Text style={styles.title}>Current Transaction</Text>

      <FlatList
        data={displayedData}
        keyExtractor={(item, index) => `${item.personalInfo.email}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />

      {fullData.users.length > 3 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {showAll ? "Show Less" : "Show All"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 },
  loadingText: { marginTop: 10, color: "#444", fontSize: 14 },
  containerList: { padding: 20, marginTop: 20 },
  title: { fontSize: 18, fontWeight: "800", color: "#1EBA60", marginBottom: 10 },
  emptyText: { textAlign: "center", padding: 20, color: "#666" },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#1EBA60",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#1EBA60", fontWeight: "700", fontSize: 14 },
});
