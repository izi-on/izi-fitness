import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import { Chip, List, Button } from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { _getData, _storeData } from "../custom-functions/async-functions";
import { Context } from "../App";

//PLAN: USE CONTEXT TO GET DATA FROM SETTINGS AND USE ASYNC STORAGE SETTINGS TO INIT THE CONTEXT. MUCH FASTER!!!!
export default function Settings() {
  const [change, setChange] = useState(false);
  const [data, setData] = useState(null);
  const {unit, setUnit, theme, setTheme} = useContext(Context);
  const width = unit === "metric" ? 65 : 45;
  const widthT = theme === "dark" ? 81 : 61;

  const clearStorage = async () => {
    await AsyncStorage.clear();
  };

  /*
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

  const _setData = async (key) => {
    try {
      const send = JSON.stringify({data: {unit: unit, theme: theme}})
      await AsyncStorage.setItem(key, send)
    } catch (e) {
      console.log(e)
    }
  }
  */

  /*
  //get states on load
  useEffect(() => {
    var data;
    (async () => {
      data = await _getData("settings")
      if (data) {
        setUnit(data.unit)
        setTheme(data.theme)
      } else {
        setUnit('imperial')
        setTheme('light')
      }

    })()
    
  }, [])
  */

  //modify async storage on change
  useEffect(() => {
    if (change) {
      const newSettings = { unit: unit, theme: theme };
      _storeData("settings", newSettings);
      setChange(false);
    }
  }, [change]);

  return (
    <View>
      <List.Item
        title="Metric unit:"
        right={(props) => (
          <View {...props} style={{ flexDirection: "row" }}>
            <Chip
              style={{ width: width, marginRight: 10 }}
              selected={unit === "metric" ? true : false}
              onPress={() => {
                setUnit('metric')
                setChange(true);
              }}
            >
              KG
            </Chip>
            <Chip
              selected={unit === "imperial" ? true : false}
              onPress={() => {
                setUnit('imperial')
                setChange(true);
              }}
            >
              LB
            </Chip>
          </View>
        )}
      />
      <List.Item
        title="Theme: "
        right={(props) => (
          <View {...props} style={{ flexDirection: "row" }}>
            <Chip
              style={{ width: widthT, marginRight: 10 }}
              selected={theme === "dark" ? true : false}
              onPress={() => {
                setTheme('dark')
                setChange(true);
              }}
            >
              Dark
            </Chip>
            <Chip
              selected={theme === "light" ? true : false}
              onPress={() => {
                setTheme('light')
                setChange(true);
              }}
            >
              Light
            </Chip>
          </View>
        )}
      />
      <Button
        mode="contained"
        style={{ marginTop: 10, width: 200, alignSelf: "center" }}
        color="red"
        onPress={clearStorage}
      >
        Clear Storage
      </Button>
    </View>
  );
}
