import React, { useState, useEffect } from "react"; 
import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Pressable}from "react-native"; 


export default function CameraSuccess({navigation}){ 
  const backPage = () => {
    navigation.navigate("TasksPage"); 
  }
  const chatbotPage = () => {
    navigation.navigate("ChatbotApp"); 
  }

  const [close, setClose] = useState(true);
  return(
    <View style={styles.container}> 
      <ImageBackground source={require('../../assets/images/CharacterBackground.png')} style={styles.backgroundImg}>
        <TouchableOpacity onPress={backPage}> 
          <Image style={styles.backArrow} source={require('../../assets/images/arrow3.png')} />
        </TouchableOpacity> 
        <Text style={styles.infoText}> You're amazing!!!! </Text> 
          <TouchableOpacity style={styles.chatBotBtn} onPress={chatbotPage}> 
          <Text style={styles.chatBtnText}> 
            Talk to Chat Bot
          </Text> 
        </TouchableOpacity> 
      </ImageBackground>
    </View>
  )    
};

const styles = StyleSheet.create({ 
  container: { 
      flex: 1, 
      // padding: 40, 
      backgroundColor: "#FFF2DE",
  }, 
  backgroundImg:{
    height: '100%',
    width: '100%',
  },
  backArrow:{
    position: 'absolute',
    top: 20,
    left: 20,
    width: 90,
    height: 60,
  },
  infoText:{
    padding: 30,
    width: '100%',
    marginTop: '50%',
    backgroundColor: '#E2D7C6',
    fontSize: 37, 
    fontWeight: "bold", 
    color: "#110C48", 
    textAlign: 'center',
  },
  chatBotBtn:{
    backgroundColor: "#9290B4", 
    borderRadius: 20,
    borderRightWidth: 15,
    borderRightColor: "#514D80",
    padding: 10, 
    margin: 20, 
    height: 75,
    marginTop: 250,
    alignItems: "center",
    justifyContent: "center",
  }, 
  chatBtnText: { 
    color: "#110C48", 
    fontWeight: "bold", 
    textAlign: "center", 
    fontSize: 28, 
  }, 
});