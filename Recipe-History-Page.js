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

const actions = [
    {
      text: "Add Recipe",
      name: "bt_accessibility",
      position: 1
    }
];

// const FlatListBasics = (DATA) => {
//     return (
//         <View style={styles.listContainer}>
//         <FlatList
//             // data={[
//             // {key: 'hamberder'},
//             // {key: 'big mac'},
//             // {key: 'more hamberders'},
//             // {key: 'covfefe'},
//             // ]}
//             data={DATA}
//             // renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
//             renderItem={({ item }) => <Text>{item}</Text>}
//         />
//         </View>
//     );
//   }

export default function RecipeHistoryPage ({route, navigation, goBack}) {
    const [recipeMap, setRecipeMap] = React.useState(
        [
            {key: "Text 1"},
            {key: "Text 2"},
            {key: "Text 3"},
            {key: "Text 4"},
            {key: "Text 5"},
        ]
    )

    const onPressAddRecipe = () => {
        navigation.navigate('Camera')
    }

    if (route.params != undefined) {
        console.log("route is")

        let { runningCalorieSum } = route.params
        let { recipeName } = route.params
        setRecipeMap(
            {
                recipeMap,
                [recipeName] :  runningCalorieSum
            }
        )
    } 
    
    return (
        <SafeAreaView style={styles.container}>
            <Button title="Back to Login" onPress={() => goBack()} />
            <View style={styles.listContainer}>
            <FlatList
                // data={[
                // {key: 'hamberder'},
                // {key: 'big mac'},
                // {key: 'more hamberders'},
                // {key: 'covfefe'},
                // ]}
                data={recipeMap}
                // renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
                renderItem={({ item }) => <Text>{item}</Text>}
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
        // flexDirection: "row",
        borderRadius:5
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
})
