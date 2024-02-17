import React from "react";
import { ImageBackground, StyleSheet, Text, View, Image, SafeAreaView, Button, Pressable } from 'react-native';
import StartButton from "../components/StartButton/StartButton";
import AboutButton from "../components/AboutButton/AboutButton";
import SettingsButton from "../components/SettingsButton/SettingsButton";

export default function HomePage() {
    return (
        <View style = {styles.background}>
            <ImageBackground 
                style = {styles.backgroundimage}
                resizeMethod="cover"
                source = {require("../assets/HomeBackground.png")}
            >
                <View style={styles.yellowbackground}>
                <Text style={styles.text}>Halfway</Text>
                </View>
                <StartButton />
                <SettingsButton />
                <AboutButton />
            </ImageBackground>

        </View>
        
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },

    backgroundimage: {
        flex: 1, 
        justifyContent: 'center'
    },

    yellowbackground: {
        backgroundColor: "#FFF2DE",
        justifyContent: "center",
        top: '3%',
        height: '20%'
    },

    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 50, 
    }

})