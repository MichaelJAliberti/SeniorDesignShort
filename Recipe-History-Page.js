import React, { useState, useEffect } from "react";
import { 
    View, 
    SafeAreaView,
    StyleSheet,
    Button,
    FlatList } from "react-native";
import { FAB } from 'react-native-paper';
import { db, auth } from './firebaseConfig';

const actions = [
    {
      text: "Add Recipe",
      name: "bt_accessibility",
      position: 1
    }
];

export default function RecipeHistoryPage ({route, navigation: { navigate, goBack }}) {
    const [recipeMap, setRecipeList] = useState([])

    useEffect(() => {
        db.collection('UserRecipes').doc(auth.currentUser.email).get().then(res => {
            let newMap = [];
            let recipes = res.data().recipes;
            for (let name in recipes) {
                newMap.push(
                    {
                        "recipeName": name,
                        "numCalories": recipes[name]['calories']
                    }
                )
            }
            setRecipeList(newMap);
        });
    }, []);

    const onPressAddRecipe = () => {
        navigate('RecipeName');
    }

    const onPressSignOut = () => {
        auth.signOut();
        goBack();
    }

    const Item = ({ title, description }) => (
        <View>
            <Button style={styles.title} title={`Recipe Name: ${title}, Number of Calories: ${description}`}>
            </Button>
        </View>
    );
    
    return (
        <SafeAreaView style={styles.container}>
            <Button title="Sign Out" onPress={onPressSignOut} />
            <View style={styles.listContainer}>
            <FlatList
                data={(route.params == undefined) ? recipeMap :
                    [...recipeMap,
                        {
                            "recipeName": route.params.name,
                            "numCalories": route.params.sum
                        } 
                    ]
                }
                renderItem={({ item }) => (
                    <Item title={item.recipeName} description={item.numCalories} />
                )}
                keyExtractor={(item) => item.recipeName}
            />
            </View>
            <FAB style={styles.fab} icon="plus" onPress={onPressAddRecipe} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    fab: {
        position: 'relative', // change to absolute for bottom-right position
        margin: 16
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1,
        paddingTop: 22,
        borderRadius:5
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
})
