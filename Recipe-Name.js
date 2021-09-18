import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Button, ImageBackground, Text } from "react-native";
import { TextInput } from "react-native-paper";

export default function RecipeName({ navigation: { navigate } }) {

    [recipeName, setName] = useState("Useless text"); 

    const onPressSubmit = () => {
        navigate('Camera', {name: recipeName})
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
