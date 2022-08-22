import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Home from './Home'
import Exercise from './Exercise'
import AddSet from './AddSet'
import AddExercise from './AddExercise'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Context } from '../App'

const Stack = createNativeStackNavigator();

export default function HomeStackScreen() {

  const {theme} = useContext(Context)
  const bc = theme==='light'?'white':'black'

  return (
    <Stack.Navigator
        initialRouteName='Home'
        
    >
        <Stack.Screen name="Home" component={Home} options={{ unmountOnBlur: true, headerShown: false }}
        />
        <Stack.Screen name="Exercise" component={Exercise} options={{ unmountOnBlur: true, headerShown: false}}/>
        <Stack.Screen name="Add set" component={AddSet} options={{ unmountOnBlur: true, headerShown: false }}/>
        <Stack.Screen name="Add exercise" component={AddExercise} options={{ unmountOnBlur: true, headerShown: false }}/>
    </Stack.Navigator>
  )
}
