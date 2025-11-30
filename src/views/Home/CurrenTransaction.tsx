import TransactionCard from "@/src/components/cards/TransactionCard";
import { useAuth } from "@/src/context/authContext";
import { getTransactionRecordSocket } from "@/src/services/socket";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
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
  const email = getUser()?.email;

  const [fullData, setFullData] = useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch data function
  const fetchTransactions = useCallback(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const socket = getTransactionRecordSocket(email);

    socket.on("currentTransactionRecord", (records) => {
      if (records?.users && Array.isArray(records.users)) {
        const sorted = records.users.sort(
          (a: UserData, b: UserData) =>
            new Date(b.personalInfo.createdAt).getTime() -
            new Date(a.personalInfo.createdAt).getTime()
        );
        setFullData({ users: sorted });
      }
      setLoading(false);
    });

    socket.emit("currentTransactionRecord", { email });

    return () => {
      socket.off("currentTransactionRecord");
    };
  }, [email]);

  // Fetch on screen focus (when you navigate back)
  useFocusEffect(
    useCallback(() => {
      const cleanup = fetchTransactions();
      return cleanup;
    }, [fetchTransactions])
  );

  const renderItem = useCallback(({ item }: { item: UserData }) => {
    return <TransactionCard item={item} />;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading current transactions...</Text>
        <ActivityIndicator size="large" color="#1EBA60" />
      </View>
    );
  }

  const displayedData = showAll ? fullData.users : fullData.users.slice(0, 3);

  return (
    <View style={styles.containerList}>
      <Text style={styles.title}>Request Transactions</Text>

      <FlatList
        data={displayedData}
        keyExtractor={(item, index) => `${item.personalInfo.email}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        scrollEnabled={false}
      />

      {fullData.users.length > 3 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.button}>
          <Text style={styles.buttonText}>{showAll ? "Show Less" : "Show All"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", height: 500 },
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