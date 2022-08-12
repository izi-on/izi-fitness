import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Snackbar, Text, TextInput, Button } from "react-native-paper";

export default function AddExercise({ navigation, route }) {
  const [name, setName] = useState(null);
  const [error, setError] = useState(null)

  const handleSubmit = () => {
    try {
        if (name) {
            if (!route.params.exercises.filter((exercise) => {
                return exercise.name.toLowerCase() === name.toLowerCase();}).length > 0) {
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
          activeOutlineColor="blue"
          mode="outlined"
        />
        <Button
          onPress={handleSubmit}
          color="blue"
        >
          Submit exercise
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
