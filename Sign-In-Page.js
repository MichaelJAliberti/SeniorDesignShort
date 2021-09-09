import React, { Component } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button } from "react-native";
import RecipeHistoryPage from './Recipe-History-Page'

const SignInPage = ({ navigation: { navigate } }) => {
    const [text, onChangeText] = React.useState("Useless Text");
    const [number, onChangeNumber] = React.useState(null);
    const onPressLogin = () => {
        navigate('Recipes')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Login</Text>
            <Text>Email</Text>
            <TextInput 
                style={styles.input}
                placeholder="e.g. youremail@gmail.com"
                onChangeText={onChangeText}
            /> 
            <Text>Password</Text>
            <TextInput 
                style={styles.input}
                placeholder="Type your password"
                onChangeText={onChangeText}
            /> 
            <Button
                title="LOGIN"
                style={styles.button}
                onPress={onPressLogin}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    input : {
        height: 40,
        width: 200,
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

export default SignInPage;