import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Image} from 'react-native'
import Card from '../custom-components/Card'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation}) {

    const [textS, setTextS] = useState('')
    const [exercises, setExercises] = useState([]) //currently for testing, this will be stored locally or on a server later

    const handleCreate = () => {
        if (textS === '') {return;}
        const exercise = {name:textS, id: Math.floor(Math.random() * 10000000).toString()}
        _addExercise(exercise)
        _getExercises()
        setTextS('')
    }

    useEffect(() => {
      _getExercises()
    }, [])

    const _addExercise = async (exercise) => {
      try {
        const jsonValue = JSON.stringify({data: [...exercises, exercise]})
        await AsyncStorage.setItem('exercises',jsonValue)
      } catch (e) {
        console.log(e)
      }
    }

    const _getExercises = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('exercises')
        const res = (jsonValue !== null) ? JSON.parse(jsonValue) : null
        setExercises(res.data)
      } catch (e) {
        console.log(e)
      }
    }




  return (
    
    <View>
        <Text>Exercise logs:</Text>
        <TextInput 
            style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
            placeHolder='Enter exercise name'
            onChangeText={setTextS}
            value={textS}
        />
        <Button
            title='Add exercise'
            onPress={handleCreate}
        />  
            <FlatList
              data={exercises}
              renderItem={({item}) => (
                <TouchableOpacity 
                  onPress={() => {navigation.navigate('Exercise', {name: item.name});}}
                > 
                  <Card>
                      <Text> {item.name} </Text>
                  </Card>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
    </View>
    

  )
}