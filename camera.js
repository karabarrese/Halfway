import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native'; // for perms
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { ImageBackground } from 'react-native'; // use backgrounds

const Kamera = ({navigation}) => {
    let cameraRef = useRef(); // contantly changing camera variable (for live camera view)
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const [photo, setPhoto] = useState();

      // import fonts
  let [fontsLoaded] = useFonts({
    'League Spartan SemiBold': require('./assets/fonts/LeagueSpartan-SemiBold.ttf'), 
    'League Spartan Regular': require('./assets/fonts/LeagueSpartan-Regular.ttf'),
    'Itim' : require('./assets/fonts/Itim-Regular.ttf'), // only has 1 font weight
  });

  useEffect(() => { // ask for perms, run only once
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync(); // ask for camera perms
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync(); // ask for medialib perms
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, [])

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

    const detectImage = () => {
        navigation.navigate("DetectObject");
    }
    
    let savePhoto = () => { // function to save the picture
        MediaLibrary.saveToLibraryAsync(photo.uri).then(() => { // save photo.uri to library
          setPhoto(undefined); // discard photo once saved
          detectImage();
        });
      };

  return(
    // what's actually on display
    <SafeAreaView style={styles.container}> 
    <ImageBackground style={styles.background} source={require("./assets/camerabg.png")}>
      <Image style={styles.camera} source={{ uri: "data:image/jpg;base64," + photo.base64 }} /> 
      {/* <Button title="Share" onPress={sharePic} />  */}
      {/* {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined} */}
      {/* <Button title="Discard" onPress={() => setPhoto(undefined)} /> */}
      <TouchableOpacity style={styles.button2} onPress={savePhoto}>
        <Text style={styles.buttonText2}>Save Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button3} onPress={savePhoto}>
        <Text style={styles.buttonText3}>Discard</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}>
        Scanned!
      </Text>
      <Text style={styles.titleSubtext}>
        that's a QR code.
      </Text>
    </ImageBackground>

    </SafeAreaView>
    );
    }
    return(
        <View style={styles.container}>
        {/* <View  style={styles.takePicButton}>
            <Button style={styles.takePicButton} title="Take Pic" onPress={takePic} />
        </View> */}
        <ImageBackground style={styles.background} source={require("./assets/camerabg.png")}>  
            <Camera style={styles.camera} ref={cameraRef}> 
            <StatusBar style="auto" />
            </Camera>
            <TouchableOpacity style={styles.backButton}>
            <Image source={require("./assets/backbutton.png")} />
            </TouchableOpacity>
            {/* touchable opacity = button that fades when you press it */}
            <Text style={styles.titleText}>
            Scan
            </Text>
            <Text style={styles.titleSubtext}>
            your QR code.
            </Text>
            <TouchableOpacity style={styles.takePicButton} onPress={takePic}>
            <Text style={styles.buttonText}>Take Pic</Text>
            </TouchableOpacity>
        </ImageBackground>
        </View>
    );
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
      fontSize: 70,
      fontFamily: 'League Spartan SemiBold',
      marginTop: "5%",
      marginLeft: "9%"
    }, 
    titleSubtext:{
      position: "absolute",
      color: "#110C48",
      fontSize: 45,
      fontFamily: 'League Spartan Regular',
      top: "71%",
      marginLeft: "10%"
    },
    backButton:{
      position: "absolute",
      top: "5%",
      left: "5%",
      // resized manually... :(
    },
    takePicButton:{
        position: "absolute",
        top: "82%",
        left: "47%",
        right: 30,
        bottom: 40,
        borderRadius: 25,
        backgroundColor: "#9290B4" // light purple
      },
      buttonText:{
        color: "#110C48",
        fontSize: 40,
        fontFamily: 'Itim',
        marginTop: "17%",
        marginLeft: "12%"
      },
      buttonText2:{
        color: "#110C48",
        fontSize: 35,
        fontFamily: 'Itim',
        marginTop: "5%",
        marginLeft: "13%",
        width: "75%",
        textAlign:"center"
      },
      button2:{
        position: "absolute",
        top: "82%",
        left: "50%",
        right: 30,
        bottom: 40,
        borderRadius: 25,
        backgroundColor: "#9290B4" // light purple
      },
      buttonText3:{
        color: "#110C48",
        fontSize: 40,
        fontFamily: 'Itim',
        marginTop: "17%",
        marginLeft: "10%",
        width: "80%",
        textAlign:"center"
      },
      button3:{
        position: "absolute",
        top: "82%",
        left: "7%",
        right: "53%",
        bottom: 40,
        borderRadius: 25,
        backgroundColor: "#9290B4" // light purple
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


export default Kamera