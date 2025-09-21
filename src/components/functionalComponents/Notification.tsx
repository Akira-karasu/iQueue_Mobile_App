import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ViewScroller from '../ViewScroller';

export default function Notification() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notification</Text>
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
    title: {
        textAlign: 'left',
        fontSize: 18,
        fontWeight: '800',
        color: '#1EBA60',
        marginBottom: 10,
    }
});

