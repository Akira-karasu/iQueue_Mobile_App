import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ViewScroller from '../../components/scroller/ViewScroller';

export default function Notification() {
    return (
        <View style={styles.container}>
            <ViewScroller horizontal={false} flexDirection="column">
                <Text style={{textAlign: 'center'}}>No new notifications</Text>
            </ViewScroller>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    
});

