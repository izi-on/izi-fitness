import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Snackbar, Text, TextInput, Button } from "react-native-paper";
import { _getData } from "../custom-functions/async-functions";

export default function AddExercise({ navigation, route }) {
  const [name, setName] = useState(null);
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      (async () => {
        var data = await _getData('settings')
        setTheme(data.theme)
      })()
    })
    return unsub
  }, [])

  const handleSubmit = () => {
    try {
        if (name) {
            if (!route.params.exercises.filter((exercise) => {
                return exercise.name.toLowerCase() === name.toLowerCase().trim();}).length > 0) {
                navigation.navigate("Home", { exercise: name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase() });
                setName(null);
            } else {
                throw 'Exercise is already created'
            }
        }
    } catch (e) {
        console.log(e)
        setError(e)
    }
    
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{color: 'red'}}> {error} </Text>
        <TextInput
          label="Enter exercise name"
          onChangeText={setName}
          value={name}
          style={{ width: Dimensions.get("window").width * 0.85, margin: 15 }}
          activeOutlineColor="green"
          mode="outlined"
        />
        <Button
          onPress={handleSubmit}
          color="green"
        >
          Submit exercise
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
