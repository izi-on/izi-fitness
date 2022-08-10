import { View, Text } from 'react-native'
import React from 'react'
import Home from './Home'
import Exercise from './Exercise'
import AddSet from './AddSet'
import AddExercise from './AddExercise'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

export default function HomeStackScreen() {
  return (
    <Stack.Navigator
        screenOptions={{
            cardStyle: {backgroundColor: 'white',}
        }}
        initialRouteName='Home'
    >
        <Stack.Screen name="Home" component={Home} options={{ unmountOnBlur: true, headerShown: false }}
        />
        <Stack.Screen name="Exercise" component={Exercise} options={{ unmountOnBlur: true, headerShown: true}}/>
        <Stack.Screen name="Add set" component={AddSet} options={{ unmountOnBlur: true, headerShown: false }}/>
        <Stack.Screen name="Add exercise" component={AddExercise} options={{ unmountOnBlur: true, headerShown: false }}/>
    </Stack.Navigator>
  )
}
