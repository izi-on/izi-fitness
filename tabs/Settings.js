import { View, Text, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

export default function Settings() {
  return (
    <View>
      <Text>Settings</Text>
      <Button
        onPress={() => {AsyncStorage.clear();}}
        title='Clear storage'
      />
    </View>
  )
}