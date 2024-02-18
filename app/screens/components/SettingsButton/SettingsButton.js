import React from 'react';
import {View, Text, StyleSheet, Pressable, TouchableOpacity, Image} from 'react-native';

const SettingsButton = (/*{ onPress }*/) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image 
                source = {require('./SettingsButton.png')}
                style= {styles.settingsbutton}
            />
        </TouchableOpacity>
    );
}; 

const styles = StyleSheet.create({
   settingsbutton: {
    left: '10%',
    top: '100%',
   }


})
export default SettingsButton;