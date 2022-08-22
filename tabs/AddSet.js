import { TouchableWithoutFeedback, View, Keyboard, DeviceEventEmitter } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { _getData } from "../custom-functions/async-functions";
import { Context } from "../App";

export default function AddSet({ navigation, route }) {
  const type = route.params.type;
  const [date, setDate] = useState(new Date());
  const {unit, theme} = useContext(Context)
  const [time, setTime] = useState(
    type === "modify" ? new Date(route.params.setToModify.timeRaw) : new Date()
);
  const [tReps, setTReps] = useState(
    type === "modify" ? route.params.setToModify.reps : null
  );
  const [tWeight, setTWeight] = useState(
    type === "modify" ? Math.round(route.params.setToModify.weight).toString() : null
  );

  const handleSet = () => {
    if (date && tReps && tWeight) {
      console.log("ADDING SET");
      navigation.navigate("Exercise", {
        name: route.params.name,
        id: route.params.id,
        returnData: {
          type: type,
          id: type === "modify" ? route.params.setToModify.id : uuid.v4(),
          date: date.toLocaleDateString(),
          time: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timeRaw: time.toISOString(),
          reps: tReps,
          weight: (unit === 'imperial')?tWeight:tWeight*2.20462262185,
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

  const bc = (theme==='light')?'#E0E0E0':'#4F4F4F' //background color
  const tc = (theme==='light')?'#4F4F4F':'#E0F0F0' //text color
  const tinpc = (theme==='light')?'#FFFFFF':'#000000' //text input color 

  //on focus, add back button
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      DeviceEventEmitter.emit('showBackButton')
    })
    return unsub
  }, [navigation])

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

    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View style={{ backgroundColor: bc, flex: 1 }}>
        <List.Section>
          <List.Subheader>
            {type==='add' && <Text style={{color: tc}}>Enter set information:</Text>}
            {type==='modify' && <Text style={{color: tc}}>Modify set:</Text>}
          </List.Subheader>
          {type==='add' && <List.Item
            title={<Text style={{color: tc}}>Date:</Text>}
            left={() => <List.Icon icon="calendar" color={tc}/>}
            right={() => (
              <DateTimePicker
                themeVariant={theme}
                textColor={tc}
                style={{ top: 12, right: 15, width: 200, color: tc}}
                testID="dateTimePicker"
                value={date}
                onChange={onChange}
              />
            )}
          />}
          <List.Item
            title={<Text style={{color: tc}}>Time:</Text>}
            left={() => <List.Icon icon="clock" color={tc}/>}
            right={() => (
              <RNDateTimePicker
                themeVariant={theme}
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
            title={<Text style={{color: tc}}>Reps</Text>}
            left={() => <List.Icon icon="dumbbell" color={tc}/>}
            right={() => (
              <TextInput
                style={{ minWidth: 45, maxWidth: 200, right: 15, backgroundColor: tinpc }}
                keyboardType="numeric"
                onChangeText={setTReps}
                value={tReps}
                underlineColor={tc}
                activeUnderlineColor={tc}
              />
            )}
          />
          <List.Item
            title={<Text style={{color: tc}}>Date:</Text>}
            left={() => <List.Icon icon="weight" color={tc}/>}
            right={() => (
              <View style={{flexDirection: 'row'}}>
                {unit==='imperial' && <Text style={{top: 20, fontSize: 20, color: tc}}>Lb:</Text>}
                {unit==='metric' && <Text style={{top: 20, fontSize: 20}}>kg:</Text>}
                <TextInput
                  mode='flat'
                  style={{ minWidth: 45, right: 15, marginLeft: 20, backgroundColor: tinpc }}
                  keyboardType="numeric"
                  onChangeText={setTWeight}
                  value={tWeight}
                  underlineColor={tc}
                  activeUnderlineColor={tc}
                />
              </View>
            )}
          />
          <Divider />
        </List.Section>

        <Button
          title="Record set"
          onPress={handleSet}
          color="green"
          mode={theme==='light'?'text':'contained'}
          style={{ width: 130, alignSelf: "center" }}
        >
          Submit set
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
