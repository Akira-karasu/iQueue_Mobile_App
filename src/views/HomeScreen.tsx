import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageHeading from '../components/ImageHeading';
import UserBoarder from '../components/UserBoarder';
import ViewScroller from '../components/ViewScroller';
import CurrentTransaction from '../components/functionalComponents/CurrenTransaction';
import EventAndAnnounce from '../components/functionalComponents/EventAndAnnounce';
import HistoryTransaction from '../components/functionalComponents/HistoryTransaction';

export default function HomeScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
     <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <UserBoarder />
      <ViewScroller
        horizontal={false}
        flexDirection="column"
        >
          <ImageHeading/>
          <EventAndAnnounce/>
          <CurrentTransaction/>
          <HistoryTransaction/>
        
      </ViewScroller>
    </View>
    </SafeAreaView>
  );
}

