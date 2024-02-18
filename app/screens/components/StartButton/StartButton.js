import React from 'react';
import {View, Text, StyleSheet, Pressable, Image, TouchableOpacity} from 'react-native';

const StartButton = ({ /*onPress*/ }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image
                style={styles.image1}
                source={require('./StartImageButton.png')}
            />
        </TouchableOpacity>
    );
}; 

const styles = StyleSheet.create({

   image1: {
    justifyContent: 'center',
    left: '15%',
    top: '30%'
   },
})
export default StartButton;