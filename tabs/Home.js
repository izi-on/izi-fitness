import { View, Text, Button, TextInput, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Home() {

    const [textS, setTextS] = useState('')
    const [exercises, setExercises] = useState([]) //currently for testing, this will be stored locally or on a server later

    const handleCreate = () => {
        if (textS === '') {return;}
        setExercises((prevExercises) => {
            return [...prevExercises, {name:textS, id: Math.floor(Math.random() * 10000000000000).toString()}]
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
        <ScrollView>
            <FlatList
              data={exercises}
              renderItem={({item}) => (
                <View>
                    <Text> {item.name} </Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
        </ScrollView>
    </View>
  )
}