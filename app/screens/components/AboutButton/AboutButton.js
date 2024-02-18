import React from 'react';
import {View, Text, StyleSheet, Pressable, TouchableOpacity, Image} from 'react-native';

const AboutButton = ({ /*onPress*/ }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Image 
                source = {require('./AboutButton.png')}
                style= {styles.aboutbutton}
            />
        </TouchableOpacity>
    );
}; 

const styles = StyleSheet.create({
   aboutbutton: {
    padding: 2,
    left: '65%',
    top: '1%'
   }

})
export default AboutButton;