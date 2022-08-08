import { View, Text, FlatList, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Exercise({navigation, route}) {

    const name = route.params.name //NAME OF THE EXERCISE
    console.log('THE NAME IS', name)

    //for testing purposes, this will be extracted later from local db
    const [DATA, SETDATA] = useState([])
    

    //GET DATA FUNCTION 
    const _getData = async () => {
        try {
            jsonValue = await AsyncStorage.getItem(name)
            res = (jsonValue !== null ? JSON.parse(jsonValue): null)
            SETDATA(res.data) //CHECK IF NULL 
        } catch (e) {
            console.log(e)
        }
    }
    
    //STORE DATA
    const _storeData = async (newData) => {
        try {
            jsonValue = JSON.stringify({data: newData})
            await AsyncStorage.setItem(name, jsonValue)
        } catch (e) {
            console.log(e)
        }
    }

    const handleAdd = () => {
        navigation.navigate('Add set', {name: name})
    }

    useEffect(() => {
        _getData()
    }, [])

    useEffect(() => {

        const returnData = route.params.returnData

        //ADD DATA? 
        if (returnData) {
            
            let toInsert = true //if its a new date

            SETDATA((prevData) => {
                
                let newData = prevData.map((item) => {
                    
                    if (returnData.date.toLowerCase() === item.date.toLowerCase()) {
                        toInsert = false
                        item.sets.push({
                            reps: returnData.reps,
                            weight: returnData.weight,
                            id: returnData.id
                        })
                    } 
                    
                    return item
                })

                if (toInsert) {
                    newData.push({
                        id: Math.floor(Math.random() * 10000000).toString(),
                        date: returnData.date,
                        sets: [{reps: returnData.reps, weight: returnData.weight, id: returnData.id}]
                    })
                }
                
                //store to local db
                _storeData(newData)
                

                return newData
                
            })
            
        } 
    }, [route.params.returnData])

  return (
    <View>
      <Button 
        title="Add set"
        onPress={handleAdd}
      />

      <Text>Exercise history for {name}:</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => {

            return (
                <View>
                <Text>---------------</Text>
                <Text>---------------</Text>
                <Text>---------------</Text>
                <Text>{item.date}:</Text>
                <Text>---------------</Text>
                {item.sets.map((set) => (
                    <View key={set.id}>
                        <Text>Reps: {set.reps} </Text>
                        <Text>Weight: {set.weight} </Text>
                        <Text>---------------</Text>
                    </View>
                ))}
                </View>
            )
            
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}