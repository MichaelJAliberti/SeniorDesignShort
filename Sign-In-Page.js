import React from "react";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

export default function SignInPage({ navigation: { navigate } }) {

    return (
        <SafeAreaView style={styles.container}>
            <Button
                title='SIGN-IN WITH GOOGLE'
                style={styles.button}
                onPress={
                    async () => {
                        var result = await signInWithGoogleAsync();
                        if (result.cancelled || result.error){
                            alert('Login failed');
                        } else {
                            navigate('Recipes');
                        }
                    }
                }
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
            onSignIn(result)
            return result.accessToken;
        } else {
            return { cancelled: true };
        }
    } catch (e) {
        return { error: true };
    }
}

function onSignIn(googleUser) {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );
  
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        } else {
            console.log('User already signed-in Firebase.');
        }
    });
  }
  

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.user.id) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
        }
    }
    return false;
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
