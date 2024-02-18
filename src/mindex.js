import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, {useState} from 'react'
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const DetectObject = ({navigation}) => {
    const[imageUri,setImageUri] = useState(null);
    const[labels, setLabels] = useState([]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1,
            });

            if(!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
            console.log(result);
        } catch(error) {
            console.error('Error picking Image: ', error);
        }
    };

    const analyzeImage = async () => {
        try {
            if(!imageUri) {
                alert('Please select an image first');
                return;
            }

            const apiKey = "AIzaSyCwd0Zsx3D5C8K74iXQe9cvum5YzFJeR08";

            const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        
            //read the image file from local URI and convert it to base64
            const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestData = {
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [{ type: 'LABEL_DETECTION', maxResults: 5}],
                    },
                ],
            };

            const apiResponse = await axios.post(apiURL, requestData);
            setLabels(apiResponse.data.responses[0].labelAnnotations);
            console.log(apiResponse.data.responses[0].labelAnnotations[0]);
            const result = apiResponse.data.responses[0].labelAnnotations[0].description;
            if( result == "Computer" || result == "Pencil" || result == "Pen" || result == "Office Supplies"){
                navigation.navigate("CameraSuccess");
            } else{
                navigation.navigate("HomePage");
            }
            
            
        } catch(error) {
            console.error('Error anazlyzing image: ', error);
            console.log(JSON.stringify(error.response.data));
            alert('Error analyzing image. Please try again later');
        }
    };
    
    return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Google Cloud Vision API Demo
      </Text>
      {imageUri && (
        <Image  
            source={{uri: imageUri}}
            style={{width: 300, height: 300}}
        />
      )}
      <TouchableOpacity
        onPress={pickImage}
        style={styles.button}
        >
        <Text style={styles.text}>Choose an image...</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={analyzeImage}
      style={styles.button}
      >
        <Text style={styles.text}>Analyze Image...</Text>
      </TouchableOpacity>
      {
            labels.length > 0 && (
                <View> 
                    <Text styles={styles.label}>
                        Labels:
                    </Text>
                    {
                        labels.map((label) => (
                            <Text
                                key={label.mid}
                                style={styles.outputtext}
                            >
                                {label.description}
                            </Text>
                        ))
                    }
                </View>
            )
      }
    </View>
  )
};

export default DetectObject

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 100,
    
    },
    button: {
        backgroundColor: "#DDDDDD",
        padding: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    outputtext: {
        fontSize: 18,
        marginBottom: 10
    },
  });


