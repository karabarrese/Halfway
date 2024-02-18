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
        width: 84, 
        height: 74,
        top: '40%',
        left: '5%'
        
    },
})
export default BackButton;