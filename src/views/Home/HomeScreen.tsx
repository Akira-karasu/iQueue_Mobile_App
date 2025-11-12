import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageHeading from "@/src/components/layout/ImageHeading";
import UserBoarder from "@/src/components/layout/UserBoarder";
import CurrentTransaction from "./CurrenTransaction";
import EventAndAnnounce from "./EventAndAnnounce";
import HistoryTransaction from "./HistoryTransaction";

export default function HomeScreen() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  // ✅ Fires every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      console.log("🏠 HomeScreen FOCUSED → Refreshing Data");
      setRefreshFlag(prev => prev + 1);
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={["top"]}>
      <UserBoarder />
      <FlatList
        key={refreshFlag} // ✅ forces UI refresh
        data={[]}
        renderItem={null}
        ListHeaderComponent={() => (
          <View style={{ backgroundColor: "#F9F9F9", flex: 1 }}>
            <ImageHeading />
            <EventAndAnnounce />
            <CurrentTransaction refreshTrigger={refreshFlag} />
            <HistoryTransaction />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}