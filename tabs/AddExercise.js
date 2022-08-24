import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  DeviceEventEmitter
} from "react-native";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { Snackbar, Text, TextInput, Button } from "react-native-paper";
import { _getData } from "../custom-functions/async-functions";
import { Context } from "../context/Context"

export default function AddExercise({ navigation, route }) {
  const [name, setName] = useState(null);
  const [error, setError] = useState(null)
  const {theme} = useContext(Context)

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

  const bc = (theme==='light')?'#E0E0E0':'#4F4F4F' //background color
  const tc = (theme==='light')?'#4F4F4F':'#E0F0F0' //text color

  //on focus, add back button
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      DeviceEventEmitter.emit('showBackButton')
    })
    return unsub
  }, [navigation])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ backgroundColor: bc,alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text style={{color: 'red'}}> {error} </Text>
        <TextInput
          label={<Text style={{color: tc}}>Enter exercise name</Text>}
          onChangeText={setName}
          value={name}
          style={{ 
            width: Dimensions.get("window").width * 0.85, 
            margin: 15,
            backgroundColor: bc
          }}
          theme={{ colors: { text: tc } }}
          outlineColor={tc}
          activeOutlineColor={tc}
          maxLength={55}
          mode="outlined"
        />
        <Button
          onPress={handleSubmit}
          mode={theme==='light'?'text':'contained'}
          color="green"
        >
          Submit exercise
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
