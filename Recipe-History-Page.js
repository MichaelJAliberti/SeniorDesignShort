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

const FlatListBasics = () => {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={[
            {key: 'hamberder'},
            {key: 'big mac'},
            {key: 'more hamberders'},
            {key: 'covfefe'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }

  export default function RecipeHistoryPage ({ navigation: { navigate, goBack } }) {
    const onPressAddRecipe = () => {
        navigate('Camera')
    }

    return (
        <SafeAreaView style={styles.container}>
        <Button title="Sign Out" onPress={() => {
            firebase.auth().signOut();
            goBack();
        }} />
            <FlatListBasics />
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
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
})
