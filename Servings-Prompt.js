import React, { Component, useState, useEffect } from "react";
import { 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

// export default function PromptForServingsPage({route, navigation}) {
export default function PromptForServingsPage(props) { 
    // Assign the ingredient name and its number of calories to identifiers
    // const { food_name } = props.foodName
    // const { calorie_count } = props.calories
    // const { navigate } = props.navigate
    const navigation = useNavigation();

    // State variables 
    const [servings, setServings] = React.useState(0);
    const [runningCalorieSum, setTotalCalories] = React.useState(0); 
    const [recipeName, setRecipeName] = React.useState("Useless Text");

    // Callback function serving-prompt-submit button. This part updates the runningCalorieSum state hook.
    const onPressSubmit = () => {
        // alert(`calorie sum is ${runningCalorieSum} number of servings is ${servings} and calorie count is ${props.calories}`)
        setTotalCalories(runningCalorieSum + props.calories * servings)
        setTotalCalories((runningCalorieSum) => {
            // alert(`calorie sum is ${runningCalorieSum} number of servings is ${servings} and calorie count is ${props.calories}`)
            addIngredientsAlert(runningCalorieSum)
        });
    }
    


    // This part updates the recipeName state hook
    // Helper function that asks user if they would like to add another ingredient or finish the recipe
    // If they choose to add another ingredient they are redirected to Camera Page
    // If they choose to finish creating the recipe they are redirected to the Recipe History Page
    const addIngredientsAlert = (runningCalorieSum) =>
        Alert.alert( "Ingredients:", "Item added successfully. Add another ingredient to the recipe?",
            [{  
                text: "Finish Recipe",
                style: "cancel",
                onPress: () => {
                    return (
                        Alert.prompt("Recipe Title", "Enter the title of the recipe",
                            [{
                                text: "Submit",
                                onPress: (recipeName) => {
                                    setRecipeName(recipeName)
                                    setRecipeName((recipeName) => {
                                        alert(`calorie sum is ${runningCalorieSum} and name is ${recipeName}`)
                                        // database stuff goes here. Pass info to database.
                                        navigation.navigate('Recipes', {
                                            sum : runningCalorieSum,
                                            name : recipeName
                                        })
                                    });
                                }
                            }]
                        )
                    );
                }
            },  
            {   
                text: "Yes", onPress: () => navigation.navigate('Camera') 
            }]
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text>
                Enter the number of servings of {props.foodName} you would like to add.
            </Text>
            <Text>
                **Note** This item has {props.calories} calories per serving.{"\n"}
            </Text>
            <TextInput 
                style={styles.input}
                placeholder="Enter the number of servings"
                onChangeText={(servings) => setServings(servings)}
            /> 
            <Button
                title="SUBMIT"
                style={styles.button}
                onPress={() => onPressSubmit()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create ({
    input : {
        height: 40,
        width: 250,
        margin: 5,
        borderWidth: 1,
        padding: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button : {
    }
}); 