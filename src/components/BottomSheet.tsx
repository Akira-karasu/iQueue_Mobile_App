import React, { useMemo, ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';

type Props = {
  children: ReactNode;
  snapPoints?: Array<string | number>;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
};

function SheetContent({ children }: { children: ReactNode }) {
  // Access context from the BottomSheet provider
  const { animatedIndex } = useBottomSheet();

  // Fade out "Swipe me" as index goes 0 → 1
  const swipeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [1, 0], Extrapolate.CLAMP),
  }));

  // Fade in children as index goes 0 → 1
  const childrenStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolate.CLAMP),
  }));

  return (
    <BottomSheetView style={styles.contentContainer}>
      <Animated.View style={swipeStyle}>
        <Text style={styles.swipeText}>⬆ Swipe me ⬆</Text>
      </Animated.View>

      <Animated.View style={[childrenStyle, styles.childrenContainer]}>
        {children}
      </Animated.View>
    </BottomSheetView>
  );
}

export default function CustomBottomSheet({
  children,
  snapPoints = ['30%', '50%'],
  initialIndex = 0,
  enablePanDownToClose = false,
}: Props) {
  const points = useMemo(() => snapPoints, [snapPoints]);

  return (
    <BottomSheet
      index={initialIndex}
      snapPoints={points}
      enablePanDownToClose={enablePanDownToClose}
    >
      <SheetContent>{children}</SheetContent>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,       // fills the bottom sheet
    width: '100%', // must fill width
    padding: 20,   // optional
    // remove alignItems: 'center'
  },
  swipeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    alignSelf: 'center', // center only the text, not the whole container
  },
  childrenContainer: {
    flex: 1,
    width: '100%',
  },
});

