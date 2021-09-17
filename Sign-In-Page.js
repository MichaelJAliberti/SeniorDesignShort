import React from "react";
import { SafeAreaView, StyleSheet, Button, ImageBackground } from "react-native";
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import { db, auth } from './firebaseConfig';

export default function SignInPage({ navigation: { navigate } }) {

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('./FoodBoarder.jpg')}  style={styles.image}>
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
                                alert('Login succeeded');
                            }
                        }
                    }
                />
            </ImageBackground>
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
    var unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        unsubscribe();
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google user info.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
            );
  
            // Sign in with credential from the Google user.
            try {
                auth.signInWithCredential(credential).then(
                    user => {
                        if (user.additionalUserInfo.isNewUser) {
                            const recipesRef = db.collection('UserRecipes')

                            recipesRef.doc(auth.currentUser.email).set(
                                {
                                    ownerId: auth.currentUser.uid
                                }
                            );
                            console.log('Successfully signed in new user to Firebase.');
                        } else {
                            console.log('Successfully signed in existing user to Firebase.');
                        }
                    }
                );
            }
            catch (error) {
                console.log('Error signing user in to Firebase.');
            }
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
    button : {
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
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }
}); 
