import React from "react";
import { useState } from "react";
import { KeyboardAvoidingView,ImageBackground, ScrollView, TouchableOpacity, StyleSheet, Text, View, Image, SafeAreaView, Button, Pressable, Keyboard, TextInput } from 'react-native';
import BackButton from "../components/BackButton/BackButton";

export default function StatsPage() {
    return (
        <View style = {styles.background}>
            <ImageBackground 
                style = {styles.backgroundimage}
                resizeMethod="cover"
                source = {require("./images/StatsPage.png")}
            >
                <ScrollView style={styles.scrollView}>

                <View>
                    <BackButton />
                    <Text style={styles.text}>Stats</Text>
                </View>

                <View style={styles.statsbackground}>
                    <TouchableOpacity style={styles.dropdown}>
                        <Image 
                            source = {require('./images/SetSpotButton.png')}
                            style= {styles.dropdownbutton}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.TimeFrame}>
                        <Image 
                            source = {require('./images/TimeFrameButton.png')}
                            style= {styles.TimeFrameButton}
                        />
                    </TouchableOpacity>
                </View>
                {/*
                <View style={styles.entries}>
                    {
                    entryItems.map((item, index) => {
                        return (
                           <TouchableOpacity key ={index} onPress={() => completeEntry(index)}>
                                <Entry text={item} />
                           </TouchableOpacity>
                        )
                        
                        {}Entry key={index} text={item} />
                        })
                    }
                    <Entry text={'Task 1'}/>
                    <Entry text={'Task 2'}/>
                </View> */}

                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.writeEntryWrapper}
                >
                    { /*}
                    <TextInput 
                        style={styles.input} 
                        placeholder={"Write an entry"} 
                        value={entry} 
                        onChangeText={text => setEntry(text)}
                    />

                    <TouchableOpacity onPress = {() => handleAddEntry()}>
                        <View style={styles.addButton}>
                            <Text style={styles.addText}>+</Text>
                        </View>
                    </TouchableOpacity>
                */}
                </KeyboardAvoidingView>
                <Image 
                    style={styles.graph}
                    source={require('./images/graph.png')}
                />
                
                <View style={styles.textbackground}>
                     <Text style={styles.text1}>you’re on track to reach your goal!</Text>
                </View>

                <TouchableOpacity style={styles.SetGoal}>
                    <Image 
                        source = {require('./images/SetGoalButton.png')}
                        style= {styles.SetGoalButton}
                    />
                </TouchableOpacity>

                </ScrollView>
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
    },

    dropdownbutton: {
        alignSelf: 'center',
        top: '30%'
    },

    TimeFrameButton: {
        alignSelf: 'center',
        top: '70%'
    },
    graph: {
        bottom: '40%',
        alignSelf: 'center'
    },

    text: {
        alignSelf: 'center',
        fontSize: 60,
        fontWeight: 'bold',
        bottom: '30%',
        left: '5%'
    },

    statsbackground: {
        backgroundColor: "#E2D7C6",
        width: 399, 
        height: 387,
        bottom: '5%'
    },

    textbackground: {
        bottom: '37%',
        left: '7%'
    },

    SetGoal: {
        bottom: '40%',
        left: '66%',
    },

    entries: {
        marginTop: 30,

    },

})