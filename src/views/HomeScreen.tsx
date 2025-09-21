import React from 'react';
import { View } from 'react-native';
import UserBoarder from '../components/UserBoarder';
import ViewScroller from '../components/ViewScroller';
import ImageHeading from '../components/ImageHeading';
import EventAndAnnounce from '../components/functionalComponents/EventAndAnnounce';
import CurrentTransaction from '../components/functionalComponents/CurrenTransaction';
import HistoryTransaction from '../components/functionalComponents/HistoryTransaction';

export default function HomeScreen() {

  return (
     <View style={{ flex: 1 }}>
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
  );
}

