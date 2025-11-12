import TransactionCard from "@/src/components/cards/TransactionCard";
import { useAuth } from "@/src/context/authContext";
import { getCurrentRequestTransactions } from "@/src/services/OfficeService";
import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CurrentTransaction({ refreshTrigger }: { refreshTrigger: number }) {
  const { getUserEmail } = useAuth();
  const email = getUserEmail();
  const [fullData, setFullData] = React.useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false); // 👈 NEW STATE

React.useEffect(() => {
  console.log('🔄 CurrentTransaction effect triggered, refreshTrigger:', refreshTrigger);
  
  async function fetchCurrentTransactions() {
    try {
      setLoading(true);
      setFullData({ users: [] }); // Clear old data

      if (email) {
        console.log('👤 Fetching for user:', email);
        const data = await getCurrentRequestTransactions(email, true);

        console.log('📥 Raw data received:', data.users.length, 'users');

        const sortedUsers = data.users.sort(
          (a: UserData, b: UserData) =>
            new Date(b.personalInfo.createdAt).getTime() -
            new Date(a.personalInfo.createdAt).getTime()
        );
        
        setFullData({ users: sortedUsers });
      }
    } catch (error) {
      console.error("❌ Failed to fetch transactions:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  fetchCurrentTransactions();
}, [email, refreshTrigger]);

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

  // ✅ Use slice to control number of rendered items
  const displayedData = showAll ? fullData.users : fullData.users.slice(0, 3);

  return (
    <View style={styles.containerList}>
      <Text style={styles.title}>Current Transaction</Text>

      <FlatList
        data={displayedData}
        keyExtractor={(item, index) => `${item.personalInfo.email}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        showsVerticalScrollIndicator={false}
      />

      {/* ✅ Show button only if more than 3 items */}
      {fullData.users.length > 3 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.button}>
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
