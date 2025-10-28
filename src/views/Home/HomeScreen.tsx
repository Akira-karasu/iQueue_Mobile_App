import ImageHeading from '@/src/components/layout/ImageHeading';
import UserBoarder from '@/src/components/layout/UserBoarder';
import ViewScroller from '@/src/components/scroller/ViewScroller';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrentTransaction from './CurrenTransaction';
import EventAndAnnounce from './EventAndAnnounce';
import HistoryTransaction from './HistoryTransaction';

export default function HomeScreen() {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#19AF5B" }} edges={['top']}>
      <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
        <UserBoarder />
        <ViewScroller
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
          <ImageHeading />
          <EventAndAnnounce />
          <CurrentTransaction />
          <HistoryTransaction />
        </ViewScroller>
      </View>
    </SafeAreaView>
  );
}

