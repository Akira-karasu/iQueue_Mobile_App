import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "@/src/context/authContext";
import { getCurrentRequestTransactions } from "@/src/services/OfficeService";
import TransactionCard from "@/src/components/cards/TransactionCard";

export default function CurrentTransaction({ refreshTrigger }: { refreshTrigger: number }) {
  const { getUserEmail } = useAuth();
  const email = getUserEmail();
  const [fullData, setFullData] = React.useState<{ users: UserData[] }>({ users: [] });
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    async function fetchCurrentTransactions() {
      try {
        setLoading(true);

        if (email) {
          const data = await getCurrentRequestTransactions(email);

          const sortedUsers = data.users.sort(
            (a: UserData, b: UserData) =>
              new Date(b.personalInfo.createdAt).getTime() -
              new Date(a.personalInfo.createdAt).getTime()
          );

          setFullData({ users: sortedUsers });
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
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

  return (
    <View style={styles.containerList}>
      <FlatList
        data={fullData.users}
        keyExtractor={(item, index) => `${item.personalInfo.email}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.title}>Current Transaction</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found</Text>}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        windowSize={8}
        maxToRenderPerBatch={8}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 40 },
  loadingText: { marginTop: 10, color: "#444", fontSize: 14 },
  containerList: { padding: 20, marginTop: 20 },
  title: { fontSize: 18, fontWeight: "800", color: "#1EBA60", marginBottom: 10 },
  emptyText: { textAlign: "center", padding: 20, color: "#666" },
});
