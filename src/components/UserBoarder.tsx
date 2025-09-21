import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function UserBoarder() {

  return (
     <View style={styles.container}>
        <Image style={styles.image} source={require('../../assets/icons/userProfile.png')} resizeMode="contain" />

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
        paddingTop: 40,
        padding: 10,
        backgroundColor: '#19AF5B',
    },
    image: {
        width: 50,
        height: 50,        
        borderColor: '#73B46D',
        borderRadius: 60,
        borderWidth: 2,
        marginRight: 15,
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    }
});