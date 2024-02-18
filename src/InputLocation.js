
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, TextInput, View, Alert, StyleSheet, Text, FlatList, Pressable} from 'react-native';
import * as Location from 'expo-location';
import {firebase} from '../config'


const InputLocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(null);

  //Location.setGoogleApiKey(process.env.googleAPIkey);
  Location.setGoogleApiKey("AIzaSyBBCI4je_3F109yrQOFF8T55soxkejKBmA");

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:");
      console.log(currentLocation);
    };
    getPermissions();
      
  }, []);

  const geocode = async () => {
    if (!location) {
      console.log("Location not available yet");
      return;
    }
    const database = firebase.firestore();
    const geocodedLocation = await Location.geocodeAsync(address);
    console.log("Geocoded Address:");
    console.log(geocodedLocation);

    if (geocodedLocation.length === 0) {
      Alert.alert('Invalid Address', 'Please enter a valid address.');
      return;
    }

    const { latitude: userLat, longitude: userLng } = location.coords;
    const { latitude: destLat, longitude: destLng } = geocodedLocation[0];

    const distanceInMeters = getDistance(userLat, userLng, destLat, destLng);
    setDistance(distanceInMeters);

    database.collection("LocInput").add({
        location: location.coords,
        address: geocodedLocation,
        distance: distanceInMeters
    })
    .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
    console.error("Error adding document: ", error);
    });

    Alert.alert(
      'Location Information',
      `You are ${distanceInMeters.toFixed(2)} meters away from the specified location.`,
    );
  };

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

  return(
    <View style={styles.container}>
      <TextInput
        placeholder='Enter Location'
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button title="Check Location" onPress={geocode} />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
})

export default InputLocation
