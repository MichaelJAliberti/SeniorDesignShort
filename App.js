import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from './Sign-In-Page'
import RecipeHistoryPage from './Recipe-History-Page'
import CameraPage from './Camera-Page'
import ServingsPromptPage from './Servings-Prompt'
import RecipeName from './Recipe-Name'

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={SignInPage} />
                <Stack.Screen name="Recipes" component={RecipeHistoryPage} />
                <Stack.Screen name="Camera" component={CameraPage} />
                <Stack.Screen name="Servings" component={ServingsPromptPage} />
                <Stack.Screen name="RecipeName" component={RecipeName} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
