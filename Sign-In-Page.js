import React, { Component } from "react";
import { 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button } 
from "react-native";
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

export default function SignInPage({ navigation: { navigate } }) {
    const [text, onChangeText] = React.useState("Useless Text");
    const onPressLogin = () => {
        navigate('Recipes')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button
                title="SIGN-IN WITH GOOGLE"
                style={styles.button}
                onPress={() => signInWithGoogleAsync()}
            />
        </SafeAreaView>
    )
}

async function signInWithGoogleAsync() {
    try {
        const result = await Google.logInAsync({
            androidClientId: '107579648655-8qk5bk9o15662og8h0rc9k61a66hdebj.apps.googleusercontent.com',
            iosClientId: '107579648655-uc1vct2lhfdd1obv711u4dk8dbg78brk.apps.googleusercontent.com+',
            scopes: ['profile', 'email'],
        });
  
        if (result.type === 'success') {
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
    } catch (e) {
        return { error: true };
    }
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
