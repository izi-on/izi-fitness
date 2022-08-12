import { View, FlatList, Animated, StyleSheet, Dimensions } from "react-native";
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

  const [DATA, SETDATA] = useState([]);
  const [rerender, triggerRerender] = useState(false);

  //GET DATA FUNCTION
  const _getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("exercise-" + exId);
      const res = jsonValue !== null ? JSON.parse(jsonValue) : null;
      if (res) {
        SETDATA(res.data);
      } else {
        SETDATA(null);
      } //CHECK IF NULL
    } catch (e) {
      console.log(e);
    }
  };

  //STORE DATA
  const _storeData = async (newData) => {
    try {
      const jsonValue = JSON.stringify({ data: newData });
      await AsyncStorage.setItem("exercise-" + exId, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  //HANDLE ADDING DATA, LOGIC IS IN USE EFFECT
  const handleAdd = () => {
    navigation.navigate("Add set", { name: name, id: exId, type: "add" });
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

  //send modifying request
  const modifySet = (set) => {
    navigation.navigate("Add set", {
      type: "modify",
      name: name,
      id: exId,
      setToModify: set,
    });
  };

  //ON INITIAL LOAD, GET DATA
  useEffect(() => {
    console.log("INIT LOAD DETECTED, GET DATA");
    _getData();
  }, []);

  //ADD DATA or MODIFY DATA
  useEffect(() => {
    const returnData = route.params.returnData;

    if (returnData) {
      var newData;
      SETDATA((prevData) => {
        console.log("THE PREVIOUS DATA WAS: ", prevData);

        //var newData;

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
                  time: returnData.time,
                  timeRaw: returnData.timeRaw,
                },
              ],
            },
          ];
        } else {
          let toInsert = true; //if its a new date
          if (returnData.type === "add") {
            newData = prevData.map((item) => {
              if (returnData.date.toLowerCase() === item.date.toLowerCase()) {
                toInsert = false;
                item.sets.push({
                  reps: returnData.reps,
                  weight: returnData.weight,
                  id: returnData.id,
                  time: returnData.time,
                  timeRaw: returnData.timeRaw,
                });

                item.sets.sort((a, b) => {
                  if (a.time > b.time) {
                    return -1;
                  }
                  if (a.time < b.time) {
                    return 1;
                  }
                  return 0;
                });
              }

              return item;
            });
          } else if (returnData.type === "modify") {
            toInsert = false;
            newData = prevData;
            const itemToModifyIndex = newData.findIndex((item) => {
              return (
                item.sets.filter((set) => {
                  return set.id === returnData.id;
                }).length > 0
              );
            });
            const setToModifyIndex = newData[itemToModifyIndex].sets.findIndex(
              (set) => {
                return set.id === returnData.id;
              }
            );
            newData[itemToModifyIndex].sets[setToModifyIndex] = {
              reps: returnData.reps,
              weight: returnData.weight,
              id: returnData.id,
              time: returnData.time,
              timeRaw: returnData.timeRaw,
            };

            newData[itemToModifyIndex].sets.sort((a, b) => {
              if (a.time > b.time) {
                return -1;
              }
              if (a.time < b.time) {
                return 1;
              }
              return 0;
            });
          }

          if (toInsert) {
            newData.push({
              id: uuid.v4(),
              date: returnData.date,
              sets: [
                {
                  reps: returnData.reps,
                  weight: returnData.weight,
                  id: returnData.id,
                  time: returnData.time,
                  timeRaw: returnData.timeRaw,
                },
              ],
            });
            newData.sort((a, b) => {
              if (a.date > b.date) {
                return -1;
              }
              if (a.date < b.date) {
                return 1;
              }
              return 0;
            });
          }
        }

        console.log("THE NEW DATA IS: ", newData);

        //store to local db
        _storeData(newData);

        return newData;
      });
      if (returnData.type === "modify") {
        triggerRerender((rerenderP) => {
          return !rerenderP;
        });
      } //modified data not detected, need to force flatlist refresh
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
      {console.log("RENDERING THE DATA: ", DATA)}
      {DATA && (
        <FlatList
          style={{ width: Dimensions.get("window").width }}
          data={DATA}
          renderItem={({ item }) => {
            let totalVolume = 0;
            item.sets.forEach((set) => {
              totalVolume += set.reps * set.weight;
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
                              style={{
                                flex: 1,
                                transform: [{ translateX: 0 }],
                              }}
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
                            onPress={() => modifySet(set)}
                            title={() => {
                              return (
                                <View>
                                  <Text
                                    style={{
                                      fontWeight: "bold",
                                      color: "#FFA100",
                                    }}
                                  >
                                    Reps: {set.reps}
                                  </Text>
                                  <Text
                                    style={{ fontWeight: "bold", color: "red" }}
                                  >
                                    Sets: {set.weight}
                                  </Text>
                                </View>
                              );
                            }}
                            left={() => {
                              return <List.Icon icon="arrow-left" />;
                            }}
                            right={() => {
                              return (
                                <Text style={{ top: 20, right: 20 }}>
                                  {set.time}
                                </Text>
                              );
                            }}
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
          extraData={rerender} //if set is modified, need to force this to rerender
        />
      )}
      {!DATA && <Text style={{ top: 10 }}>Add a set to start tracking!</Text>}
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
