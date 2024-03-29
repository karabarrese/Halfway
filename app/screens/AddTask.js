import React, { useState, useEffect } from "react"; 
// import TasksPage from './app/screens/tasks' 
// import Fetch from './src/Fetch'
import { StatusBar } from 'expo-status-bar';
import { View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Button}from "react-native"; 
import * as Location from 'expo-location';
import {firebase} from '../../config'

export default function AddTaskPage({navigation}) {
  // class TasksPage extends React.Component {
  const [task, setTask] = useState(""); 
  const [locationType, setLocationType] = useState(true)
  // const [taskTypeText, setTaskTypeText] = useState("Location")
  const [taskTypePrompt, setTaskTypePrompt] = useState("Location Address")
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(null);

  Location.setGoogleApiKey("AIzaSyBBCI4je_3F109yrQOFF8T55soxkejKBmA");

  handleBackPage = async () => {
    // console.log("Function returned a");
    // const navigation = useNavigation();
    navigation.navigate("TasksPage"); 
  };

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      // console.log("Location:");
      // console.log(currentLocation);
    };
    getPermissions();
      
  }, []);



  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };
  

  const geocode = async () => {
    if (!location) {
      console.log("Location not available yet");
      return;
    }
    const database = firebase.firestore();
    const geocodedLocation = await Location.geocodeAsync(address);
    // console.log("Geocoded Address:");
    // console.log(geocodedLocation);
    // let x = geocodedLocation;
    
    if (geocodedLocation.length === 0) {
      
      database.collection("TaskTest").add({
        // wordloc: x,
        taskName: task,
        taskLocType: locationType,
        location: null,
        address: null,
        distance: null,
        object: address,
      })
      .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
      console.error("Error adding document: ", error);
      });

      handleBackPage();
      return;
    }

    const { latitude: userLat, longitude: userLng } = location.coords;
    const { latitude: destLat, longitude: destLng } = geocodedLocation[0];

    const distanceInMeters = getDistance(userLat, userLng, destLat, destLng);
    setDistance(distanceInMeters);

    database.collection("TaskTest").add({
        // wordloc: x,
        taskName: task,
        taskLocType: locationType,
        location: location.coords,
        address: geocodedLocation,
        distance: distanceInMeters,
        object: address,
    })
    .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
    console.error("Error adding document: ", error);
    });

    handleBackPage();
    Alert.alert(
      'Location Information',
      `You are ${distanceInMeters.toFixed(2)} meters away from the specified location.`,
    );
  };

  taskBtnStyle = function(isLoc) {
    if((locationType && isLoc) || (!locationType && !isLoc)){
      return {
        marginLeft: 20,
        backgroundColor: "#110C48", 
        borderRadius: 10,
        borderRightWidth: 15,
        borderRightColor: "#514D80",
        padding: 10, 
        width: 160,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
      }
    } else{
      return {
        marginLeft: 20,
        backgroundColor: "#9290B4", 
        borderRadius: 10,
        borderRightWidth: 15,
        borderRightColor: "#514D80",
        padding: 10, 
        width: 160,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
      }
    }
  }
  taskBtnTextStyle = function(isLoc) {
    if((locationType && isLoc) || (!locationType && !isLoc)){
      return {
        color: "#FFFFFF", 
        fontWeight: "bold", 
        textAlign: "center", 
        fontSize: 25, 
      }
    } else{
      return {
        color: "#110C48", 
        fontWeight: "bold", 
        textAlign: "center", 
        fontSize: 25, 
      }
    }
  }
  createNewTask = async = () => {
    {geocode}

  }
  updateTaskType = (setting) => {
    setLocationType(setting)
    if(setting){
      // setTaskTypeText("Location")
      setTaskTypePrompt("Location Address:")
    } else{
      // setTaskTypeText("Scan Object")
      setTaskTypePrompt("Object to Scan")
    }
  }

  return(
    <View style={styles.container}> 
      <ImageBackground source={require('../../assets/images/topBannerImg.png')} style={styles.topBannerImg}>
        <View style={styles.topBanner}>
          <Text style={styles.heading}>Add Tasks</Text> 
          <Text style={styles.headingDescription}>Set new goals!</Text> 
        </View>
      </ImageBackground>

      <Text style={styles.headingItem}>Task Name</Text> 
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Do Homework"
        value={task} 
        onChangeText={(text) => setTask(text)} 
      />

      <Text style={styles.headingItem}>Task Type</Text> 
      <View style={styles.taskBtnContainer}> 
        <TouchableOpacity
            style={this.taskBtnStyle(true)} onPress={()=>updateTaskType(true)}> 
            <Text style={this.taskBtnTextStyle(true)}> 
              Location
            </Text> 
        </TouchableOpacity>
        <TouchableOpacity 
            style={this.taskBtnStyle(false)} onPress={()=>updateTaskType(false)}> 
            <Text style={this.taskBtnTextStyle(false)}> 
              Scan
            </Text> 
        </TouchableOpacity> 
      </View>

      <Text style={styles.headingItem}>{taskTypePrompt}</Text> 
      <TextInput 
        style={styles.input} 
        value={address} 
        onChangeText={setAddress}
        placeholder='Enter Location'
      />

      {/* <Button title="Check Location" onPress={geocode}/> */}
      {/* <StatusBar style="auto"/> */}

      {/* <ImageBackground source={require('../../assets/images/topBannerImg.png')} style={styles.bottomBannerImg}> */}
      <View style = {styles.bottomSection}>
        <View style={styles.bottomBtnContainer}> 
          <TouchableOpacity onPress={handleBackPage}> 
            <Image style={styles.backArrow} source={require('../../assets/images/arrow3.png')} />
          </TouchableOpacity> 
          <TouchableOpacity 
            style={styles.createTaskBtn}>
            <Text style={styles.addButtonText}> 
                Create New Task 
            </Text> 
          </TouchableOpacity> 
        </View>
      </View>
      {/* </ImageBackground> */}
    </View>    
  );
};

const styles = StyleSheet.create({ 
  container: { 
      flex: 1, 
      // padding: 40, 
      backgroundColor: "#FFF2DE",
  }, 
  topBanner: { 
    position: 'absolute',
    top: 25, 
    left: 25, 
    right: 25, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
  }, 
  topBannerImg: {
    height: 155,
    weight: '100%',
    // aspectRatio: 1,
  },
  // bottomBannerImg: {
  //   marginTop: 50,
  //   height: 250,
  //   weight: '100%',
  // },
  heading: { 
    fontSize: 45, 
    fontWeight: "bold", 
    marginBottom: 7, 
    color: "#110C48", 
    textAlign: "center",
  }, 
  headingDescription: {
    flex: 1,
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#110C48",
  },
  headingItem: {
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 20,
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#110C48", 
  },
  input: { 
    borderWidth: 5, 
    borderColor: "#C9B495", 
    backgroundColor: "#E2D7C6",
    padding: 10, 
    marginLeft: 20,
    marginRight: 20, 
    borderRadius: 10, 
    fontSize: 18, 
  }, 
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 30,
  },
  taskBtnContainer: {
    // marginTop: 20,
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "top", 
    marginRight: 20,
  }, 
  bottomBtnContainer: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "top", 
    marginLeft: 20,
    marginRight: 20,
  },
  backArrow:{
    width: 90,
    height: 60,
  },

  createTaskBtn: { 
    backgroundColor: "#9290B4", 
    // borderWidth: 0 15 0 0;
    borderRadius: 15,
    borderRightWidth: 15,
    borderRightColor: "#514D80",
    padding: 10, 
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    width: 240,
  }, 
  addButtonText: { 
    color: "#110C48", 
    fontWeight: "bold", 
    textAlign: "center", 
    fontSize: 25, 
  }, 
});