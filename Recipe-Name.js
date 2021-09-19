import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Button, ImageBackground, Text } from "react-native";
import { TextInput } from "react-native-paper";
import * as firebase from 'firebase';
import { db, auth } from './firebaseConfig';


export default function RecipeName({ route, navigation }) {

    const [RecipeCollectionRef, ] = useState(route.params.RecipeCollectionRef)
    const [recipeName, setName] = useState("Useless text"); 

    const onPressSubmit = () => {
        console.log(route.params)
        RecipeCollectionRef.add({ 
                recipeName: recipeName,
                totalCalories: 0
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            navigation.navigate('Camera', {name: recipeName, docID: docRef.id})
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Give your recipe a name</Text>
            <TextInput
                style={styles.input}
                onChangeText={(recipeName) => setName(recipeName)}
                // value={name}
                placeholder="Enter recipe name"
            />
            <Button
                title="SUBMIT"
                style={styles.button}
                onPress={() => onPressSubmit()}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create ({
    submitButton : {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
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
