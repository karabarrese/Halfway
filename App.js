import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native'; // for perms
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { ImageBackground } from 'react-native'; // use backgrounds

// SUPER ANNOTATED because i am very unfamiliar with this library
// note: make sure to include all "plugins":[] from app.json

export default function App() {
  let cameraRef = useRef(); // contantly changing camera variable (for live camera view)
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

  // import fonts
  let [fontsLoaded] = useFonts({
    'League Spartan SemiBold': require('./assets/fonts/LeagueSpartan-SemiBold.ttf'), // adjustable font weight
    'Itim' : require('./assets/fonts/Itim-Regular.ttf'), // only has 1 font weight
  });

  useEffect(() => { // ask for perms, run only once
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync(); // ask for camera perms
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync(); // ask for medialib perms
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) { // perms not granted
    return <Text>Permission for camera not granted. Please change this in settings.</Text> 
  }

  // define some functions right here
  let takePic = async () => { // define take picture function
    let options = { // set photo options
      quality: 1, // highest quality
      base64: true, // returns base64 format of image
      exif: false // photo info (time, location, etc.) 
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options); // take picture
    setPhoto(newPhoto); // set photo variable to photo that was just taken (newPhoto)
  };

  // photo.uri = file path of photo
  if (photo) { // if the photo exists
    let sharePic = () => { // function to share the picture.
      shareAsync(photo.uri).then(() => { // run pop-up menu with share options to share photo.uri
        setPhoto(undefined); // discard photo once shared 
      });
    };

    let savePhoto = () => { // function to save the picture
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => { // save photo.uri to library
        setPhoto(undefined); // discard photo once saved
      });
    };

    // safeareaview so view does not stretch past borders
    // button time!! gives you all the buttons
    return ( // what's actually on display
      <SafeAreaView style={styles.container}> 
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} /> 
        <Button title="Share" onPress={sharePic} /> 
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
    // image style...: displays image that you just took as a jpeg
    // button title="share"...: share button that executes sharePic function when pressed
    // {hasMediaLibrary...: if medialib perms given, then save button executes savephoto when pressed
    // button title="discard"...: discards image (sets to undefined)
  }

  // define camera view/what you see on your camera before the photo is taken. live camera view. something
  return (
    <View style={styles.container}>
      {/* <View  style={styles.takePicButton}>
        <Button style={styles.takePicButton} title="Take Pic" onPress={takePic} />
      </View> */}
      <ImageBackground style={styles.background} source={require("./assets/camerabg.png")}>  
        <Camera style={styles.camera} ref={cameraRef}> 
          <StatusBar style="auto" />
        </Camera>
        {/* touchable opacity = button that fades when you press it */}
        <Text style={styles.titleText}>
          Scan
        </Text>
        <TouchableOpacity style={styles.takePicButton} onPress={takePic}>
          <Text style={styles.buttonText}>Take Pic</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
  // camera style=... display live camera view
  // button title="take Pic"...: button that executes takePic function
  // statusbar: the bar at the top of the screen that displays time, battery, etc.
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // alignItems: 'stretch', // cross (non-main) axis align
    // justifyContent: 'center', // main axis align
  },
  camera: {
    height: "60%", // takes up 60% of y axis on page (starting from top)
  },
  titleText:{
    color: "#110C48",
    fontSize: 40,
    fontFamily: 'League Spartan SemiBold',
    marginTop: "17%",
    marginLeft: "12%"
  },
  takePicButton:{
    position: "absolute",
    top: "82%",
    left: "47%",
    right: 30,
    bottom: 40,
    backgroundColor: "#9290B4" // light purple
  },
  buttonText:{
    color: "#110C48",
    fontSize: 40,
    fontFamily: 'Itim',
    marginTop: "17%",
    marginLeft: "12%"
  },
  buttonContainer: {
    backgroundColor: '#fff', // white
    //alignSelf: 'flex-end'
  },
  background: {
    flex: 1
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});