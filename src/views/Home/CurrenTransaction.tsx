import Card from '@/src/components/cards/Card';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function CurrentTransaction() {

  return (
     <View style= {styles.container}>
        <Text style={styles.title}>Current Transaction</Text>

        <Card  >
            <Text style={{textAlign: 'center'}}> No current transaction</Text>
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