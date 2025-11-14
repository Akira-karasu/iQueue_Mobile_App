import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageHeading from "@/src/components/layout/ImageHeading";
import UserBoarder from "@/src/components/layout/UserBoarder";
import CurrentTransaction from "./CurrenTransaction";
import EventAndAnnounce from "./EventAndAnnounce";
import HistoryTransaction from "./HistoryTransaction";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <UserBoarder />

      <FlatList
        style={{ flex: 1 }}
        data={[]} // dummy data
        keyExtractor={() => "dummy"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: "#F9F9F9", paddingBottom: 20 }}
        ListHeaderComponent={() => (
          <>
            <ImageHeading />
            <EventAndAnnounce />
            <CurrentTransaction />
            <HistoryTransaction />
          </>
        )}
        renderItem={() => null} // ✅ TypeScript fix
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#19AF5B" },
});
