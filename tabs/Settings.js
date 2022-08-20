import { View, Text} from 'react-native'
import React, { useEffect } from 'react'
import { Chip, List, Button} from 'react-native-paper'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settings() {

  const [unit, setUnit] = useState('imperial')
  const [theme, setTheme] = useState('light')
  const [change, setChange] = useState(false)
  const [data, setData] = useState(null)
  const width=(unit==='metric')?65:45;
  const widthT=(theme==='dark')?81:61

  const clearStorage = async () => {
    await AsyncStorage.clear()
  }

  const _getData = async () => {
    try {
      const resRaw = await AsyncStorage.getItem('settings')
      console.log(resRaw)
      const res = JSON.parse(resRaw)
      console.log(res)
      return (res !== null)?res.data:{data: {unit: 'imperial', theme: 'light'}}
    } catch (e) {
      console.log(e)
    }
  }

  const _setData = async () => {
    try {
      const send = JSON.stringify({data: {unit: unit, theme: theme}})
      await AsyncStorage.setItem('settings', send)
    } catch (e) {
      console.log(e)
    }
  }

  //get states on load
  useEffect(() => {
    var data;
    (async () => {
      data = await _getData()
      setUnit(data.unit)
      setTheme(data.theme)
    })()
    
  }, [])

  //modify async storage on change
  useEffect(() => {
    if (change) {
      _setData()
      setChange(false)
    }

  }, [unit, theme])

  return (
    <View>
      <List.Item
        title='Metric unit:'
        right={props => 
        <View {...props} style={{flexDirection:'row'}}>
          <Chip style={{width: width, marginRight: 10}} selected={unit==='metric'?true:false}
          onPress={() => {setUnit('metric'); setChange(true)}}

          >KG</Chip>
          <Chip selected={unit==='imperial'?true:false}
          onPress={() => {setUnit('imperial'); setChange(true)}}
          >LB</Chip>
        </View>}
      />
      <List.Item 
        title="Theme: "
        right={props => 
          <View {...props} style={{flexDirection:'row'}}>
            <Chip style={{width: widthT, marginRight: 10}} selected={theme==='dark'?true:false}
            onPress={() => {setTheme('dark'); setChange(true)}}
  
            >Dark</Chip>
            <Chip selected={theme==='light'?true:false}
            onPress={() => {setTheme('light'); setChange(true)}}
            >Light</Chip>
          </View>}   
      />
      <Button mode="contained" style={{marginTop: 10, width: 200, alignSelf:'center'}} color='red'
      onPress={clearStorage}
      >Clear Storage</Button>
    </View>
  )
}