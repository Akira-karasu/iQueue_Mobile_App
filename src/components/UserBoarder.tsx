import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function UserBoarder() {

  return (
     <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/icons/boy.png')} resizeMode="contain" />

      <Text style={styles.title}>
        Welcome User!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
     container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        backgroundColor: '#19AF5B',
        width: '100%',
    },
    image: {
        width: 40,
        height: 40,        
        borderColor: '#73B46D',
        borderRadius: 60,
        borderWidth: 2,
        marginRight: 15,
        backgroundColor: '#fff',
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    }
});