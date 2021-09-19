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
    const [recipeName, ] = useState(route.params.name);
    const [firestoreRecipeDocId, ] = useState(route.params.docID)

    // Camera States
    const [hasPermission, setHasPermission] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [scanned, setScanned] = useState(false);

    // Servings Prompt Hooks
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
        setTotalCalories(prevTotal => (prevTotal + calories * servings))
        Alert.alert(  "Ingredients:", `Item added successfully.`,
            [{  
                text: "Finish Recipe",
                style: "cancel",

                onPress: () => {
                    setTotalCalories((totalCalories) => {

                        RecipeCollectionRef
                            .doc(firestoreRecipeDocId)
                            .update({
                                totalCalories: totalCalories,
                            })
                            .then(() => {
                                console.log('User updated!');
                            });

                        navigation.navigate('Recipes', {
                            sum : totalCalories,
                            name : recipeName
                        })
                    })
                }
            },  
            {   
                text: "Add Item", onPress: () => { 
                    return (
                        setShowServingsPage(false) 
                    )
                }
            }]
        )

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
                    onPress={onPressServingsSubmit}
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
            // db.collection('UserRecipes').doc(auth.currentUser.email).update({
            //     'Food': {
            //         'Ingredients': [
            //             foodDescription
            //         ],
            //         'Calories': caloriesData
            //     }
            // });

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
