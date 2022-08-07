import { View, Text, FlatList } from 'react-native'
import React from 'react'

export default function Exercise({route}) {

    const name = route.params.name

    //for testing purposes, this will be extracted later
    const DATA = [
        {
            id: '1',
            date: "July 13",
            sets: [
                {
                    reps: 12,
                    weight: 120,
                    id: '4'
                },
                {
                    reps: 10,
                    weight: 150,
                    id: '5'

                },
                {
                    reps: 8,
                    weight: 160,
                    id: '6'

                }
            ]
        }, 
        {
            id: '2',
            date: "July 14",
            sets: [
                {
                    reps: 12,
                    weight: 125,
                    id: '7'

                },
                {
                    reps: 10,
                    weight: 155,
                    id: '8'

                },
                {
                    reps: 8,
                    weight: 165,
                    id: '9'

                }
            ]
        },
        {
            id: '3',
            date: "July 15",
            sets: [
                {
                    reps: 12,
                    weight: 130,
                    id: '10'

                },
                {
                    reps: 10,
                    weight: 160,
                    id: '11'

                },
                {
                    reps: 8,
                    weight: 170,
                    id: '12'

                }
            ]
        }
        
    ]

  return (
    <View>
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