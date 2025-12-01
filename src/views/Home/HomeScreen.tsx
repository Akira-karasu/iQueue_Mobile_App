import { useAuth } from "@/src/context/authContext";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageHeading from "@/src/components/layout/ImageHeading";
import UserBoarder from "@/src/components/layout/UserBoarder";
import CurrentTransaction from "./CurrenTransaction";

export default function HomeScreen() {
  const { loading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      // ✅ Call your refresh functions here
      console.log("🔄 Refreshing home screen data...");
      
      // Example: Refresh transactions, announcements, etc.
      // await refetchTransactions();
      // await refetchAnnouncements();
      // await refetchEvents();
      
      // Add a small delay to show refresh animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Wait for auth to load token from storage
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1EBA60" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserBoarder />

      <FlatList
        style={{ flex: 1 }}
        data={[]} // dummy data
        keyExtractor={() => "dummy"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "#F9F9F9", paddingBottom: 20, flexGrow: 1 }}
        
        // ✅ ADD REFRESH CONTROL
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#19AF5B"
            colors={["#19AF5B"]}
            progressBackgroundColor="#ffffff"
          />
        }
        
        ListHeaderComponent={() => (
          <>
            <ImageHeading />
            <CurrentTransaction />
          </>
        )}
        renderItem={() => null} // ✅ TypeScript fix
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#19AF5B", height: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});