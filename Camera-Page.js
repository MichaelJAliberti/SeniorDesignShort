import React, { Component, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    TouchableOpacity, 
    LogBox } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { db, auth, projecFirebaseUrl } from './firebaseConfig';

LogBox.ignoreLogs(['Setting a timer'])

export default function CameraPage({ navigation: { navigate } }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const getNutrition = async (upc) => {
        try {
            const fdaKeyQuerry = `${projecFirebaseUrl}/databases/(default)/documents/FdaRetrieval/Fda`;
            const fdaKeyResponse = await fetch(
                fdaKeyQuerry,
                {
                    method: 'GET'
                }
            );
            let fdaKeyJson = await fdaKeyResponse.json();
            const fdaKey = fdaKeyJson.fields.FdaApi.stringValue;

            const fdcNumQuerry = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&api_key=${fdaKey}`
            const fdcNumResponse = await fetch(
                fdcNumQuerry,
                {
                    method: 'GET'
                }
            );
            let fdcNumJson = await fdcNumResponse.json();
            const foodData = fdcNumJson.foods[0]
            const foodDescription = foodData.description
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

            // CHANGE THIS ALERT TO A POP-UP TRIGGER
            alert(`${foodDescription} is ${caloriesData} calories per serving`);
            db.collection('UserRecipes').doc(auth.currentUser.email).update({
                'Food': {
                    'Ingredients': [
                        foodDescription
                    ],
                    'Calories': caloriesData
                }
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        await getNutrition(data)
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
