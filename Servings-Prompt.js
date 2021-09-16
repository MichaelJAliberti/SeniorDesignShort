import React, { Component, useState, useEffect } from "react";
import { 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    Alert } from "react-native";
import Dialog from "react-native-dialog"; 

export default function PromptForServingsPage({route, navigation}) { 
    const { food_name } = route.params
    const { calorie_count } = route.params
    if (route != {}) {
        const { food_name } = route.params
        const { calorie_count } = route.params
    }
    const [servings, setServings] = React.useState("Useless Text");
    const [runningCalorieSum, setTotalCalories] = React.useState(0); 
    const [recipeName, setRecipeName] = React.useState("Useless Text");

    const addIngredientsAlert = () =>
        Alert.alert( "Ingredients:", "Item added successfully. Add another ingredient to the recipe?",
            [{  
                text: "Finish Recipe",
                style: "cancel",
                onPress: () => {
                    return (
                        Alert.prompt("Recipe Title", "Enter the title of the recipe",
                            [{
                                text: "Submit",
                                onPress: recipeName => {
                                    setRecipeName(recipeName)
                                    handleSubmit()
                                }
                            }]
                        )
                    );
                        // <SafeAreaView>
                        // <Dialog.Container>
                        //     <Dialog.Title>Recipe Name</Dialog.Title>
                        //     <Dialog.Description>Enter the name of your recipe:</Dialog.Description>
                        //     <Dialog.Input
                        //         style={styles.input}
                        //         placeholder="Enter name of recipe"
                        //         onChangeText={setRecipeName}
                        //     />
                        //     <Dialog.Button label="Submit" onPress={handleSubmit} />
                        // </Dialog.Container>
                        // </SafeAreaView>
                    // );
                }
            },  
            {   
                text: "Yes", onPress: () => navigation.navigate('Camera') 
            }]
    );


    const handleSubmit = () => {
        navigation.navigate('Recipes', runningCalorieSum, recipeName)
    }

    const onPressSubmit = ({food_name, calorie_count, servings}) => {
        // save servings
        setTotalCalories(runningCalorieSum + calorie_count * servings)
        // ask if user wants to add to recipe with an alert
        addIngredientsAlert()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Enter the number of servings of {food_name} you would like to add.
            </Text>
            <Text>
                **Note** This item has {calorie_count} calories per serving. 
                {"\n"}
            </Text>
            <TextInput 
                style={styles.input}
                placeholder="Enter the number of servings"
                onChangeText={setServings}
            /> 
            <Button
                title="SUBMIT"
                style={styles.button}
                onPress={onPressSubmit}
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