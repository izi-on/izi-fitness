import { View, Text} from 'react-native'
import { Button } from 'react-native-paper'
import React, { useContext, useEffect, useState } from 'react'
import Home from './Home'
import Exercise from './Exercise'
import AddSet from './AddSet'
import AddExercise from './AddExercise'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Context } from "../context/Context"
import {DeviceEventEmitter} from "react-native"
import Chart from "./Chart.js"


const Stack = createNativeStackNavigator();

export default function HomeStackScreen({navigation, route}) {

  const [needBackButton, setNeedBackButton] = useState(false)
  const {theme} = useContext(Context)
  const bc = theme==='light'?'white':'black'
  DeviceEventEmitter.addListener("removeBackButton", () => {setNeedBackButton(false)});
  DeviceEventEmitter.addListener("showBackButton", () => {setNeedBackButton(true)})

  useEffect(() => {
    if (needBackButton) {
      navigation.setOptions({
        headerLeft: () => (
          <Button
            onPress={() => navigation.goBack()}
            color="#fff"
            icon='arrow-left'
          >Back</Button>
        ),
      })
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <View
          />
        ),
      })
    }
  }, [needBackButton])

  return (
    <Stack.Navigator
        initialRouteName='Home'
    >
        <Stack.Screen name="Home" component={Home} options={{ unmountOnBlur: true, headerShown: false }}
        />
        <Stack.Screen name="Exercise" component={Exercise} options={{ unmountOnBlur: true, headerShown: false}}/>
        <Stack.Screen name="Add set" component={AddSet} options={{ unmountOnBlur: true, headerShown: false }}/>
        <Stack.Screen name="Add exercise" component={AddExercise} options={{ unmountOnBlur: true, headerShown: false }}/>
        <Stack.Screen name="Chart" component={Chart} options={{ unmountOnBlur: true, headerShown: false }}/>

    </Stack.Navigator>
  )
}
