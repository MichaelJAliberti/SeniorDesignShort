import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from './Sign-In-Page'
import RecipeHistoryPage from './Recipe-History-Page'
import CameraPage from './Camera-Page'
import NutritionReveal from './nutrition_retrieval'

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={SignInPage} />
                <Stack.Screen name="Recipes" component={RecipeHistoryPage} />
                <Stack.Screen name="Camera" component={CameraPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
    // return (
    //     <View style={styles.container}>
    //         <SignInPage />
    //     </View>
    // );
    // return (
    //     <View style={styles.container}>
    //     <Text>Hi</Text>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
});
