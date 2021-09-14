import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, LogBox } from 'react-native';

import { db } from './firebaseConfig'

LogBox.ignoreLogs(['Setting a timer'])

export default App = () => {
    const [isLoading, setLoading] = useState(true);
    const [fdaData, setFdaData] = useState([]);
    const [foodName, setFood] =  useState([]);

    useEffect(() => {
        getNutrition('071725748089');
    });
    
    const getNutrition = async (upc) => {
        try {
            const fdaResponse = db.collection('FdaRetrieval').doc('Fda');
            const fdaDoc = await fdaResponse.get();
            const fdaKey = `${fdaDoc.get('FdaApi')}`

            const fdcNumQuerry = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${upc}&api_key=${fdaKey}`
            const fdcNumResponse = await fetch(
                fdcNumQuerry,
                {
                    method: 'GET'
                }
            );
            let fdcNumJson = await fdcNumResponse.json();
            const foodData = fdcNumJson.foods[0]
            setFood(`${foodData.description}`)
            let fdcId = foodData.fdcId

            const caloriesQuerry = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${fdaKey}`
            const caloriesResponse = await fetch(
                caloriesQuerry,
                {
                    method: 'GET'
                }
            );
            let caloriesJson = await caloriesResponse.json();
            const caloriesData = caloriesJson.labelNutrients.calories.value
            setFdaData(`${caloriesData}`)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
        {isLoading ? <ActivityIndicator/> : (
            <Text>Food: {foodName}:{'\n'}Calories:{fdaData}</Text>
        )}
        </View>
    );
};
