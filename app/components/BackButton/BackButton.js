import React from 'react';
import {View, Text, StyleSheet, Pressable, TouchableOpacity, Image} from 'react-native';

const BackButton = (/*{ onPress }*/) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image 
                source = {require('./BackButton.png')}
                style= {styles.backbutton}
            />
        </TouchableOpacity>
    );
}; 

const styles = StyleSheet.create({
    backbutton: {
        width: 80, 
        height: 70,
        top: '30%',
        left: '5%'
        
    },
})
export default BackButton;