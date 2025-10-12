import Card from '@/src/components/cards/Card';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function EventAndAnnounce() {

  return (
     <View style= {styles.container}>
        <Text style={styles.title}>School Event and Announcement</Text>

        <Card  >
            <Text style={{textAlign: 'center'}}> No event or announcement for now. </Text>
        </Card>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20,
    },
    title: {
        textAlign: 'left',
        fontSize: 18,
        fontWeight: '800',
        color: '#1EBA60',
        marginBottom: 10,
    }

});