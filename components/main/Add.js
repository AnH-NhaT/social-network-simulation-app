import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';


export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'} />
      </View>
      <View style={styles.btn}>
        <TouchableOpacity
          style={styles.each}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}>
          <Text style={styles.alone}>FLIPPING</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage()} style={styles.each}>
          <Text style={styles.alone}>COLLECTION</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture()} style={styles.each}>
          <Text style={styles.alone}>SHOOTING</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {

          navigation.navigate('Save', { image })
        }} style={styles.each}>
          <Text style={styles.alone}>SAVING</Text>
        </TouchableOpacity>
      </View>

      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  alone: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0066ff',
  },
  each: {
    padding: 4,
    height: 40,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 4,
    margin: 2.5,
    justifyContent: "center",
    borderColor: '#00ff00',
  },
  btn: {
    justifyContent: "center",
    flexDirection: 'row',
  },
  cameraContainer: {
    flex: 0.8,
    flexDirection: 'row',

  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }

})
