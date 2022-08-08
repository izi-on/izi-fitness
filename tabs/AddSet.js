import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'

export default function AddSet({navigation}) {

    const [date, setDate] = useState(null)
    const [tReps, setTReps] = useState(null)
    const [tWeight, setTWeight] = useState(null)


    const handleSet = () => {
        if (date && tReps && tWeight) {
            console.log('ADDING SET')
            navigation.navigate('Exercise',
                {
                    returnData: {

                        id: Math.floor(Math.random() * 10000000).toString(),
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