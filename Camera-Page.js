import React, { Component, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    TouchableOpacity } from "react-native";
import { FAB } from 'react-native-paper';
import { Camera } from 'expo-camera';
// let camera: Camera

const CameraPage = ({ navigation: { navigate, goBack } }) => {
    // const cameraRef = useRef(null);
    const [startCamera, setStartCamera] = React.useState(false)
    // const [capturedImage, setCapturedImage] = React.useState<any>(null)
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
    (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        // cameraRef.current = this;
    })();
    }, []);

    if (hasPermission === null) {
    return <View />;
    }
    if (hasPermission === false) {
    return <Text>No access to camera</Text>;
    }

    const onSnap = () => {
    //     if (Camera) {
    //         this.Camera.takePictureAsync({ onPictureSaved: onPictureSaved });
    //     }
    // };
        // const photo: any = await camera.takePictureAsync()
        // console.log(photo)
        // setPreviewVisible(true)
        // //setStartCamera(false)
        // setCapturedImage(photo)
    }
      
    const onPictureSaved = photo => {
        console.log(photo);
    } 

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type}  >
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                    }}>
                    <Text style={styles.text}> Flip </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onSnap}>
                    <Text style={styles.text}> Take Picture </Text>
                </TouchableOpacity>
            </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex:1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    captureBtnText: {
        fontSize: 18,
        color: 'black',
    },
    CircleShapeView: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#fff',
    },
});

export default CameraPage;
// <Text style={styles.captureBtnText}> Take Picture </Text>
