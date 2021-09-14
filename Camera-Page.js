import React, { Component, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    TouchableOpacity } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner'
//import NutritionRetrieval from './nutrition_retrieval'
import { db } from './firebaseConfig'

export default function CameraPage({ navigation: { navigate } }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);
    const [fdaData, setFdaData] = useState([]);
    const [foodName, setFood] =  useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const getNutrition = async (upc) => {
        try {
            const fdaResponse = db.collection('FdaRetrieval').doc('Fda');
            const fdaDoc = await fdaResponse.get();
            const fdaKey = `${fdaDoc.get('FdaApi')}`

            const fdcNumQuerry = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&api_key=${fdaKey}`
            const fdcNumResponse = await fetch(
                fdcNumQuerry,
                {
                    method: 'GET'
                }
            );
            let fdcNumJson = await fdcNumResponse.json();
            const foodData = fdcNumJson.foods[0]
            setFood(`${foodData.description}`)
            let fdcId = foodData.fdcId

            const caloriesQuerry = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${fdaKey}`
            const caloriesResponse = await fetch(
                caloriesQuerry,
                {
                    method: 'GET'
                }
            );
            let caloriesJson = await caloriesResponse.json();
            const caloriesData = caloriesJson.labelNutrients.calories.value
            setFdaData(`${caloriesData}`)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        //const nr = new NutritionRetrieval(data);
        //nr.getNutrition();
        await getNutrition(data)
        if (!isLoading) {
            alert(`FDA data for ${foodName} calorie is ${fdaData}`);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
