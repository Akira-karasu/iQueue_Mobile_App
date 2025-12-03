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
      status?: string; // Add status field
    };
  };

  const { getUser } = useAuth();
  const email = getUser()?.email;
  const id = getUser()?.id;

   const numericId = id ? Number(id) : null;


  const [fullData, setFullData] = useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "processing" | "completed" | "cancelled" >("all");

  // Fetch data function
  const fetchTransactions = useCallback(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const socket = getTransactionRecordSocket(numericId!);

    socket.on("currentTransactionRecord", (records) => {
      console.log('📥 Full records:', records);  // Debug log
      
      // ✅ Access data.users instead of records.users
      const users = records?.data?.users || records?.users || [];
      
      if (Array.isArray(users) && users.length > 0) {
        const sorted = users.sort(
          (a: UserData, b: UserData) =>
            new Date(b.personalInfo.createdAt).getTime() -
            new Date(a.personalInfo.createdAt).getTime()
        );
        setFullData({ users: sorted });
        console.log('✅ Sorted data:', sorted);  // Debug log
      } else {
        console.log('⚠️ No users found in records');
      }
      
      setLoading(false);
    });

    socket.emit("currentTransactionRecord", { id: numericId });

    return () => {
      socket.off("currentTransactionRecord");
    };
  }, [numericId, id]);

  // Fetch on screen focus
  useFocusEffect(
    useCallback(() => {
      const cleanup = fetchTransactions();
      return cleanup;
    }, [fetchTransactions])
  );

  // ✅ Filter transactions based on selected status
  const getFilteredData = useCallback(() => {
    let filtered = fullData.users;

    if (selectedFilter !== "all") {
      filtered = fullData.users.filter(
        (item) => item.personalInfo.status?.toLowerCase() === selectedFilter
      );
    }

    return showAll ? filtered : filtered.slice(0, 3);
  }, [fullData.users, selectedFilter, showAll]);

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

  const displayedData = getFilteredData();
  const filteredCount = selectedFilter === "all" 
    ? fullData.users.length 
    : fullData.users.filter(item => item.personalInfo.status?.toLowerCase() === selectedFilter).length;

  return (
    <View style={styles.containerList}>
      <Text style={styles.title}>Request Transactions</Text>

      {/* ✅ Filter Selection */}
      <View style={styles.filterContainer}>
        {["all", "pending", "processing", "completed", "cancelled"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter as any)}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayedData}
        keyExtractor={(item, index) => `${item.personalInfo.email}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {selectedFilter} transactions found</Text>
        }
        scrollEnabled={false}
      />

      {filteredCount > 3 && (
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
  
  // ✅ Filter styles
  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 5,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#f5f5f5",
  },
  filterButtonActive: {
    backgroundColor: "#1EBA60",
    borderColor: "#1EBA60",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  
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