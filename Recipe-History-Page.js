import React, { Component } from "react";
import { 
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    StyleSheet,
    Button,
    FlatList } from "react-native";
import { FAB } from 'react-native-paper';
import * as firebase from 'firebase';

const actions = [
    {
      text: "Add Recipe",
      name: "bt_accessibility",
      position: 1
    }
];

export default function RecipeHistoryPage ({route, navigation, goBack}) {
    const [runningCalorieSum, setRunningCalorieSum] = React.useState(0);
    const [recipeName, setRecipeName] = React.useState("Useless Text");
    const [recipeMap, setRecipeList] = React.useState(
        [
            {   "recipeName": "chicken noodle soup",
                "numCalories": 100
            },
            {   "recipeName": "fajitas",
                "numCalories": 200
            }
        ]
    )

    // const { calorie_count } = route.params
    // const { food_name } = ( route.params == undefined ) ? route.params

    const onPressAddRecipe = () => {
        // navigate('Camera')
        navigate('RecipeName')
    }

    if (route.params != undefined) {
        console.log(route)
        // let { calorie_sum } = route.params
        // let { recipe_name } = route.params

        // // setRunningCalorieSum(calorie_sum)
        // // setRecipeName(recipe_name)
        // // alert("don't go on linked in!")
        // alert(`Recipe ${recipe_name} has ${calorie_sum} calories`)
        // setRecipeList(
        //     recipeMap => [...recipeMap,
        //         {
        //             "recipeName": recipe_name,
        //             "numCalories": calorie_sum
        //         } 
        //     ]
        // )
    } 

    const Item = ({ title, description }) => (
        <View>
        <Button style={styles.title} title={`Recipe Name: ${title}, Number of Calories: ${description}`}>
        </Button>
        </View>
    );
    
    return (
        <SafeAreaView style={styles.container}>
            <Button title="Back to Login" onPress={() => goBack()} />
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
        <Button title="Sign Out" onPress={() => {
            firebase.auth().signOut();
            goBack();
        }} />
            <FAB style={styles.fab} icon="plus" onPress={onPressAddRecipe} />
        </SafeAreaView>
    )
};

// {(route.params != undefined) &&
    //     <Text>SBFKARJFHRFHKJASHJ {calorie_sum} {recipe_name}</Text>
    // }

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
        // flexDirection: "row",
        borderRadius:5
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
})
