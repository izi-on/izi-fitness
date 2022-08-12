import { TouchableWithoutFeedback, View, Keyboard } from "react-native";
import React, { useState } from "react";
import { TabRouter } from "@react-navigation/native";
import uuid from "react-native-uuid";
import {
  IconButton,
  List,
  Text,
  Divider,
  TextInput,
  Button,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function AddSet({ navigation, route }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [tReps, setTReps] = useState(null);
  const [tWeight, setTWeight] = useState(null);

  const handleSet = () => {
    if (date && tReps && tWeight) {
      console.log("ADDING SET");
      navigation.navigate("Exercise", {
        name: route.params.name,
        id: route.params.id,
        returnData: {
          id: uuid.v4(),
          date: date.toLocaleDateString(),
          time: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          reps: tReps,
          weight: tWeight,
        },
      });
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setTime(currentDate);
  };

  return (
    /*
    <View>
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter date'
        onChangeText={setDate}
        value={date}
      />
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter reps'
        onChangeText={setTReps}
        value={tReps}
      />
      <TextInput
        style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
        }}
        placeHolder='Enter weight'
        onChangeText={setTWeight}
        value={tWeight}
      />
      <Button
        title='Record set'
        onPress={handleSet}
      />
    </View>
    */
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
      <View style={{flex: 1}}>
        <List.Section>
          <List.Subheader>Enter set information:</List.Subheader>
          <List.Item
            title={"Date:"}
            left={() => <List.Icon icon="calendar" />}
            right={() => (
              <DateTimePicker
                style={{ top: 12, right: 15, width: 200 }}
                testID="dateTimePicker"
                value={date}
                onChange={onChange}
              />
            )}
          />
          <List.Item
            title={"Time:"}
            left={() => <List.Icon icon="clock" />}
            right={() => (
              <RNDateTimePicker
                mode="time"
                style={{ top: 12, right: 15, width: 200 }}
                testID="dateTimePicker"
                value={time}
                onChange={onChangeTime}
              />
            )}
          />
          <Divider />
          <List.Item
            title={"Reps:"}
            left={() => <List.Icon icon="dumbbell" />}
            right={() => (
              <TextInput
                style={{ minWidth: 45, maxWidth: 200, right: 15 }}
                keyboardType="numeric"
                onChangeText={setTReps}
                value={tReps}
                activeOutlineColor="blue"
              />
            )}
          />
          <List.Item
            title="Weight: "
            left={() => <List.Icon icon="weight" />}
            right={() => (
              <TextInput
                style={{ minWidth: 45, right: 15 }}
                keyboardType="numeric"
                onChangeText={setTWeight}
                value={tWeight}
                activeOutlineColor="blue"
              />
            )}
          />
          <Divider />
        </List.Section>

        <Button title="Record set" onPress={handleSet} color="blue"
        style={{width: 130, alignSelf:'center'}}
        >
          Submit set
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
