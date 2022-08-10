import { View, Text, Button } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useState } from 'react'

export default function AddExercise({navigation, route}) {

    const [name, setName] = useState(null)

    const handleSubmit = () => {
        if (name) {
            console.log(route.params.exercises)
            console.log(route.params.exercises.filter(exercise => {return exercise.name === name}).length > 0)
            if (!route.params.exercises.filter(exercise => {return exercise.name.toLowerCase() === name.toLowerCase()}).length > 0) {
                navigation.navigate('Home', {exercise: name})
                setName(null)
            }
        }
    }

  return (
    <View>
        <Text>Enter exercise name:</Text>
        <TextInput
            style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
            }}
            onChangeText={setName}
            value={name}
        />
        <Button
            title='Submit exercise'
            onPress={handleSubmit}
        />
    </View>
  )
}