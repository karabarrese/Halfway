import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native'; // for perms
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

// SUPER ANNOTATED because i am very unfamiliar with this library
// note: make sure to include all "plugins":[] from app.json

export default function App() {
  let cameraRef = useRef(); // contantly changing camera variable (for live camera view)
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

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
    <Camera style={styles.container} ref={cameraRef}> 
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} /> 
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
  // camera style=... display live camera view
  // button title="take Pic"...: button that executes takePic function
  // statusbar: the bar at the top of the screen that displays time, battery, etc.
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});