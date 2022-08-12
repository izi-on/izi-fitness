import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RectButton } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { Button, Card, Divider, List, Text } from "react-native-paper";

export default function Exercise({ navigation, route }) {
  const name = route.params.name;
  const exId = route.params.id;

  console.log("THE NAME IS", name);

  //for testing purposes, this will be extracted later from local db
  const [DATA, SETDATA] = useState([]);

  //GET DATA FUNCTION
  const _getData = async () => {
    try {
      jsonValue = await AsyncStorage.getItem("exercise-" + exId);
      res = (jsonValue !== null) ? JSON.parse(jsonValue) : null;
      if (res) {SETDATA(res.data);} else {SETDATA(null)} //CHECK IF NULL
    } catch (e) {
      console.log(e);
    }
  };

  //STORE DATA
  const _storeData = async (newData) => {
    try {
      jsonValue = JSON.stringify({ data: newData });
      await AsyncStorage.setItem("exercise-" + exId, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  //HANDLE ADDING DATA, LOGIC IS IN USE EFFECT
  const handleAdd = () => {
    navigation.navigate("Add set", { name: name, id: exId });
  };

  //REMOVE DATA
  const removeData = (itemId, setId) => {
    console.log(`REMOVING FROM ITEM: ${itemId}, SET: ${setId}`);

    SETDATA((prevData) => {
      let newData = prevData.map((item) => {
        if (itemId !== item.id) {
          return item;
        }

        const newSets = item.sets.filter((set) => {
          return set.id !== setId;
        });
        console.log("NEW SETS AFTER FILTER:", newSets);
        return newSets.length === 0 ? null : { ...item, sets: newSets };
      });
      newData = newData.filter((data) => {
        return data !== null;
      });
      console.log("OBJECT AFTER FILTER:", newData);
      if (newData.length === 0) {
        _storeData(null);
        return null;
      } else {
        _storeData(newData);
        return newData;
      }
    });
  };

  //ON INITIAL LOAD, GET DATA
  useEffect(() => {
    console.log("INIT LOAD DETECTED, GET DATA");
    _getData();
  }, []);

  //ADD DATA
  useEffect(() => {
    const returnData = route.params.returnData;

    //ADD DATA?
    if (returnData) {
      console.log("NEW SET DETECTED, ADDING SET");

      SETDATA((prevData) => {
        console.log("THE PREVIOUS DATA WAS: ", prevData);

        var newData;

        if (!prevData) {
          newData = [
            {
              id: uuid.v4(),
              date: returnData.date,
              sets: [
                {
                  reps: returnData.reps,
                  weight: returnData.weight,
                  id: returnData.id,
                  time: returnData.time
                },
              ],
            },
          ];
        } else {
          let toInsert = true; //if its a new date

          newData = prevData.map((item) => {
            if (returnData.date.toLowerCase() === item.date.toLowerCase()) {
              toInsert = false;
              item.sets.push({
                reps: returnData.reps,
                weight: returnData.weight,
                id: returnData.id,
                time: returnData.time
              });
            }

            return item;
          });

          if (toInsert) {
            newData.push({
              id: uuid.v4(),
              date: returnData.date,
              sets: [
                {
                  reps: returnData.reps,
                  weight: returnData.weight,
                  id: returnData.id,
                  time: returnData.time
                },
              ],
            });
          }
        }

        console.log("THE NEW DATA IS: ", newData);

        //store to local db
        _storeData(newData);

        return newData;
      });
    }
  }, [route.params.returnData]);

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Button
        style={{ borderRadius: 0, width: Dimensions.get("window").width }}
        color="green"
        onPress={handleAdd}
        mode="contained"
      >
        Add set
      </Button>

      {DATA && <FlatList
        style={{ width: Dimensions.get("window").width }}
        data={DATA}
        renderItem={({ item }) => {
          let totalVolume = 0; 
          item.sets.forEach(set => {
            totalVolume += set.reps*set.weight
          });
          return (
            <View style={{ alignItems: "center" }}>
              <Card
                mode="elevated"
                elevation={3}
                style={{
                  width: Dimensions.get("window").width * 0.9,
                  marginTop: 10,
                }}
              >
                {console.log("RENDERING ITEM: ", item.id)}
                <Card.Title
                  title={item.date}
                  subtitle={`Total volume: ${totalVolume}`}
                  left={() => <List.Icon icon="dumbbell" />}
                />
                <Divider />
                {item.sets.map((set) => (
                  <View key={set.id} styles={{ flex: 1 }}>
                    {console.log("RENDERING SET: ", set.id)}
                    <Swipeable
                      renderRightActions={(progress, dragX) => {
                        const trans = dragX.interpolate({
                          inputRange: [0, 50, 100, 101],
                          outputRange: [-20, 0, 0, 1],
                        });
                        return (
                          <Animated.View
                            style={{ flex: 1, transform: [{ translateX: 0 }] }}
                          >
                            <RectButton
                              style={[
                                styles.rightAction,
                                {
                                  backgroundColor: "red",
                                  elevation: 3,
                                },
                              ]}
                              onPress={() => removeData(item.id, set.id)}
                            >
                              <Text style={styles.actionText}>Delete</Text>
                            </RectButton>
                          </Animated.View>
                        );
                      }}
                    >
                      <View style={{ backgroundColor: "white" }}>
                        <List.Item
                          title={() => {
                            return (
                              <View>
                                <Text style={{ fontWeight: 'bold', color: "#FFA100" }}>
                                  Reps: {set.reps}
                                </Text>
                                <Text style={{ fontWeight: 'bold', color: "red" }}>
                                  Sets: {set.weight}
                                </Text>
                              </View>
                            );
                          }}
                          left={() => {
                            return <List.Icon icon="arrow-left" />;
                          }}
                          right={() => {return <Text style={{top: 20, right: 20}}>{set.time}</Text>}}
                        />
                      </View>
                    </Swipeable>
                  </View>
                ))}
              </Card>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />}
      {!DATA && <Text style={{top: 10}}>Add a set to start tracking!</Text>}
    </View>
  );
}

//for the animation swipe (mainly)
const styles = StyleSheet.create({
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10,
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
