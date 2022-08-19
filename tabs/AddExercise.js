import { View, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Snackbar, Text, TextInput, Button } from 'react-native-paper'

export default function AddExercise({navigation, route}) {

    const [name, setName] = useState(null)

    const handleSubmit = () => {
        if (name) {
            if (!route.params.exercises.filter(exercise => {return exercise.name.toLowerCase() === name.toLowerCase()}).length > 0) {
                navigation.navigate('Home', {exercise: name})
                setName(null)
            }
        }
    }

  return (
    <View style={{alignItems:'center', justifyContent: 'center'}}>
        <TextInput
            label='Enter exercise name'
            onChangeText={setName}
            value={name}
            style={{width: Dimensions.get('window').width*0.85, margin: 15}}
            activeOutlineColor='blue'
            mode="outlined"
        />
        <Button
            title='Submit exercise'
            onPress={handleSubmit}
            mode='contained'
            color='blue'
        >Add the exercise</Button>
        
    </View>
  )
}