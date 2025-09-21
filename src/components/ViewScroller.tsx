import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ScrollViewProps } from 'react-native';

interface SwitchScrollProps extends Omit<ScrollViewProps, 'horizontal' | 'showsHorizontalScrollIndicator'> {
  children: React.ReactNode;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
flexDirection?: 'row' | 'column';
}

const ViewScroller: React.FC<SwitchScrollProps> = ({
  children,
  style = {},
  contentContainerStyle = {},
    horizontal = false,
  showsHorizontalScrollIndicator = false,
    flexDirection,
  ...rest
}) => {
    const direction = flexDirection || (horizontal ? 'row' : 'column');
    return (
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        style={style}
        contentContainerStyle={[styles.container, { flexDirection: direction }, contentContainerStyle]}
        {...rest}
      >
        {children}
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

export default ViewScroller;
