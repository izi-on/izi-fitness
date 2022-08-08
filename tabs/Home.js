import { View, Text, Button, TextInput, ScrollView, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Home({navigation}) {

    const [textS, setTextS] = useState('')
    const [exercises, setExercises] = useState([]) //currently for testing, this will be stored locally or on a server later
    const [selectedId, setSelectedId] = useState(1)

    const handleCreate = () => {
        if (textS === '') {return;}
        setExercises((prevExercises) => {
            return [...prevExercises, {name:textS, id: Math.floor(Math.random() * 10000000).toString()}]
        })
        setTextS('')
    }

    useEffect(() => {
        console.log('The exercises are: ', exercises)
    }, [exercises])

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
                <TouchableOpacity style={{
                  padding: 20,
                  marginVertical: 8,
                  marginHorizontal: 16,
                  backgroundColor: selectedId==item.id?'blue':'white'
                }} onPress={() => {setSelectedId(item.id); navigation.navigate('Exercise', {name: item.name})}}> 
                  <View >
                      <Text> {item.name} </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              extraData={selectedId}
            />
    </View>
  )
}