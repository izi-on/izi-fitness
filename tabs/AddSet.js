import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { TabRouter } from '@react-navigation/native'
import uuid from 'react-native-uuid'

export default function AddSet({navigation, route}) {

    const [date, setDate] = useState(null)
    const [tReps, setTReps] = useState(null)
    const [tWeight, setTWeight] = useState(null)


    const handleSet = () => {
        if (date && tReps && tWeight) {
            console.log('ADDING SET')
            navigation.navigate('Exercise',
                {
                    name: route.params.name,
                    returnData: {

                        id: uuid.v4(),
                        date: date,
                        reps: tReps,
                        weight: tWeight

                    }
                }
            )
        } 
    }

  return (
    <View>
      <Text>Add set:</Text>
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter date'
        onChangeText={setDate}
        value={date}
      />
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter reps'
        onChangeText={setTReps}
        value={tReps}
      />
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter weight'
        onChangeText={setTWeight}
        value={tWeight}
      />
      <Button
        title='Record set'
        onPress={handleSet}
      />
    </View>
  )
}