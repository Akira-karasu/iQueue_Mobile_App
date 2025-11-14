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
  const { getUserEmail } = useAuth();
  const email = getUserEmail();

  const [fullData, setFullData] = useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!email) return;

    const socket = getTransactionRecordSocket();

    console.log("🔌 Connecting to /transactionRecord...");

    /** ⬇ INITIAL LOAD */
    socket.on("connect", () => {
      console.log("✅ Connected to transactionRecord socket");
      socket.emit("currentTransactionRecord", { email }); // request user-specific data
    });

    /** ⬇ RECEIVE INITIAL + BROADCASTED UPDATES */
    const handleRecords = (records: any) => {
      console.log("📥 Received currentTransactionRecord:", records);

      const users: UserData[] = Array.isArray(records?.users)
        ? records.users
        : [];

      const sortedUsers = users.sort(
        (a, b) =>
          new Date(b.personalInfo.createdAt).getTime() -
          new Date(a.personalInfo.createdAt).getTime()
      );

      setFullData({ users: sortedUsers });
      setLoading(false);
    };

    /** ⬇ Listen for real-time updates from backend broadcasts */
    socket.on("currentTransactionRecord", handleRecords);

    return () => {
      socket.off("connect");
      socket.off("currentTransactionRecord", handleRecords);
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
