import React, { Component, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    Button,
    Alert,
    TouchableOpacity, 
    LogBox } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner'
import { db } from './firebaseConfig'
import PromptForServingsPage from "./Servings-Prompt";

LogBox.ignoreLogs(['Setting a timer'])

export default function CameraPage({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);
    const [calories, setCalories] = useState(0);
    const [foodName, setFoodName] =  useState("Useless Text");
    const [showServingsPage, setShowServingsPage] = useState(false)

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const keepIngredientAlert = (foodDescription, caloriesData) => {
        setCalories(caloriesData)
        setCalories((calories) => {
            setFoodName(foodDescription) 
            setFoodName((foodName) => {
                Alert.alert( `Scanned ${foodName} with ${calories} calories per serving`, "Use ingredient?",
                    [{  
                        text: "Discard",
                        style: "cancel" 
                    },  
                    {   
                        // text: "Keep", onPress: () => navigation.navigate('Servings', {food_name: foodDescription, calorie_count: caloriesData}) 
                        text: "Keep", onPress: () => setShowServingsPage(true)
                    }]
                );
            })
        })
        }

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
            // alert(`${foodDescription} is ${caloriesData} calories per serving`);
            
            keepIngredientAlert(foodDescription, caloriesData);

            // setFdaData(`${caloriesData}`)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const formatUpc = (upc) => {
        if (upc.length > 12) {
            return upc.substring(1)
        } else if (upc.length == 12)
            return upc
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        await getNutrition(formatUpc(data))
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
            {   
                scanned &&  <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            }
            { 
                showServingsPage && <PromptForServingsPage foodName={foodName} calories={calories} /> 
            }
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
