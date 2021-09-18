import React, { Component, useState, useEffect } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    Button,
    Alert,
    LogBox,
    SafeAreaView,
    TextInput } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner'
import PromptForServingsPage from "./Servings-Prompt";
import { db, auth, projecFirebaseUrl } from './firebaseConfig';

LogBox.ignoreLogs(['Setting a timer'])

export default function CameraPage({ route, navigation}) {
    // Recipe Name passed from the Recipe Name Page
    // const { recipeName } = route.params

    // Camera States
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);

    // Servings Prompt Hooks
    const [recipeName, ] = useState(route.params.name);
    const [foodName, setFoodName] = useState("Useless Text")
    const [calories, setCalories] = useState(0);
    const [showServingsPage, setShowServingsPage] = useState(false)
    const [servings, setServings] = React.useState(0);
    const [totalCalories, setTotalCalories] = React.useState(0); 

    // useEffect for foodName
    useEffect(() => {
        setFoodName(foodName)
    }, [foodName])

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const onPressServingsSubmit = () => {
        setTotalCalories(totalCalories + calories * servings)
        setTotalCalories( (totalCalories) => {
            // alert(`calorie sum is ${totalCalories} number of servings is ${servings} and calorie count is ${calories}`)
            Alert.alert( "Ingredients:", `Item added successfully. Add another ingredient to the recipe? 
            calorie sum is ${totalCalories} number of servings is ${servings} and calorie count is ${calories}
            and recipe name is ${recipeName}`,
                [{  
                    text: "Finish Recipe",
                    style: "cancel",

                    onPress: () => {
                        return (
                            navigation.navigate('Recipes', {
                                sum : totalCalories,
                                name : recipeName
                            })
                        );
                    }
                },  
                {   
                    // text: "Yes", onPress: () => navigation.navigate('Camera') 
                    text: "Yes", onPress: () => setShowServingsPage(false) 
                }]
            )
        });

        setShowServingsPage(false)
    }

    const ServingsPrompt = () => {
        return (
            <SafeAreaView style={styles.ServingsPromptContainer}>
                <Text>
                    Enter the number of servings of {foodName} you would like to add.
                </Text>
                <Text>
                    **Note** This item has {calories} calories per serving.{"\n"}
                </Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter the number of servings"
                    onChangeText={(servings) => setServings(servings)}
                /> 
                <Button
                    title="SUBMIT"
                    style={styles.button}
                    onPress={() => onPressServingsSubmit()}
                />
            </SafeAreaView>
        ); 
    }

    const keepIngredientAlert = (foodDescription, caloriesData) => {
        Alert.alert( `Scanned ${foodDescription} with ${caloriesData} calories per serving`, "Use ingredient?",
            [{  
                text: "Discard",
                style: "cancel" 
            },  
            {   
                text: "Keep", onPress: () => setShowServingsPage(true)
            }]
        );
        // // setCalories(caloriesData)
        // setCalories((calories) => {
        //     // setFoodName(foodDescription) 
        //     setFoodName((foodName) => {
        //         Alert.alert( `Scanned ${foodName} with ${calories} calories per serving`, "Use ingredient?",
        //             [{  
        //                 text: "Discard",
        //                 style: "cancel" 
        //             },  
        //             {   
        //                 text: "Keep", onPress: () => setShowServingsPage(true)
        //             }]
        //         );
        //     })
        // })
    }



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
            
            setCalories(caloriesData)
            setFoodName(foodDescription) 
            keepIngredientAlert(foodDescription, caloriesData);

            // setFdaData(`${caloriesData}`)
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
        <View style={styles.ScannerContainer}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {   
                scanned &&  <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            }

            { 
                showServingsPage && <ServingsPrompt /> 
            }
        </View>
    );
}
// { 
//     showServingsPage && <PromptForServingsPage foodName={foodName} calories={calories} /> 
// }
const styles = StyleSheet.create({
    ScannerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    ServingsPromptContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input : {
        height: 40,
        width: 250,
        margin: 5,
        borderWidth: 1,
        padding: 10
    },
});
