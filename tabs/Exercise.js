import {
  View,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
  DeviceEventEmitter,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RectButton } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { Button, Card, Divider, List, Text } from "react-native-paper";
import _ from "lodash";
import { _getData, _storeData } from "../custom-functions/async-functions";
import { Context } from "../context/Context";
import { LinearGradient } from "expo-linear-gradient";

export default function Exercise({ navigation, route }) {
  const name = route.params.name;
  const exId = route.params.id;

  //console.log("THE NAME IS", name);

  const [DATA, SETDATA] = useState([]);
  const [rerender, triggerRerender] = useState(false);
  const [modified, setModified] = useState(false); //if the data has been modified
  const { unit, theme } = useContext(Context);
  /*

  //GET DATA FUNCTION
  const _getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const res = jsonValue !== null ? JSON.parse(jsonValue) : null;
      if (res) {
        return res.data;
      } else {
        return null;
      } //CHECK IF NULL
    } catch (e) {
      console.log(e);
    }
  };

  //STORE DATA
  const _storeData = async (key, newData) => {
    try {
      const jsonValue = JSON.stringify({ data: newData });
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  */

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
        _storeData("exercise-" + exId, null);
        return null;
      } else {
        _storeData("exercise-" + exId, newData);
        return newData;
      }
    });
    setModified(true);
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

  //on focus, add back button
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      DeviceEventEmitter.emit("showBackButton");
    });
    return unsub;
  }, [navigation]);

  //ON INITIAL LOAD, GET DATA
  useEffect(() => {
    //load data
    var data;
    (async () => {
      console.log("getting data");
      data = await _getData("exercise-" + exId);
      SETDATA(data);
    })();
  }, []);

  //ADD DATA or MODIFY DATA
  useEffect(() => {
    const returnData = route.params.returnData;

    if (returnData) {
      var newData;
      SETDATA((prevData) => {
        //console.log("THE PREVIOUS DATA WAS: ", prevData);

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
          setModified(true);
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
            setModified(true);
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

            newData[itemToModifyIndex].sets[setToModifyIndex];
            const oldSet = {
              ...newData[itemToModifyIndex].sets[setToModifyIndex],
            };
            newData[itemToModifyIndex].sets[setToModifyIndex] = {
              reps: returnData.reps,
              weight: returnData.weight,
              id: returnData.id,
              time: returnData.time,
              timeRaw: returnData.timeRaw,
            };

            //check if the content has been modified
            if (
              !_.isEqual(
                newData[itemToModifyIndex].sets[setToModifyIndex],
                oldSet
              )
            ) {
              setModified(true);
            }

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

        //console.log("THE NEW DATA IS: ", newData);

        //store to local db
        _storeData("exercise-" + exId, newData);

        return newData;
      });
      if (returnData.type === "modify") {
        triggerRerender((rerenderP) => {
          return !rerenderP;
        });
      } //modified data not detected, need to force flatlist refresh
      route.params.returnData = null;
    }
  }, [route.params.returnData]);

  const _handleModify = async () => {
    try {
      //get exercise
      const jsonValue = await AsyncStorage.getItem("exercises");
      const res = JSON.parse(jsonValue);
      console.log("received is: ", res);
      //change exercise properties
      const curExerIndex = res.data.findIndex(
        (exercise) => exercise.id === exId
      );
      res.data[curExerIndex].lastModifiedDate = new Date().toLocaleDateString();
      res.data[curExerIndex].lastModifiedTime = new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      console.log("new res is: ", res);
      //save exercise
      console.log("sending back...");
      const jsonSend = JSON.stringify(res);
      await AsyncStorage.setItem("exercises", jsonSend);
      console.log("sent");
    } catch (e) {
      console.log(e);
    }
  };

  //handle navigating to Graph component with proper data
  const handleAnalytics = () => {
    /*
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
          ],
        },
      ],
    }}
    */

    //DATES
    var labels;
    if (DATA.length < 5) {

      labels = DATA.map((item) => {
        console.log(new Date(item.date).toString())
        const dateString = new Date(item.date).toString().split(' ').slice(1,3).join(' ')
        return dateString;
      }).reverse();
      
    } else {
      const startDate = new Date(DATA[0].date).toString().split(' ').slice(1,3).join(' ') 
      const endDate = new Date(DATA.at(-1).date).toString().split(' ').slice(1,3).join(' ')
      const middleDate = new Date(DATA.at(DATA.length/2).date).toString().split(' ').slice(1,3).join(' ')
      labels = Array(DATA.length).fill("")
      labels[0] = startDate
      labels[Math.floor(DATA.length/2)] = middleDate
      labels[DATA.length - 1] = endDate
      labels.reverse()
    }
    

    //VOLUME DATA
    const data_volume = DATA.map((item) => {
      var volume = 0;
      item.sets.forEach((set) => {
        volume += set.reps * set.weight;
      });
      return volume;
    }).reverse();

    //NAVIGATE TO CHART COMPONENT AND PASS DATA
    navigation.navigate("Chart", {
      data: {
        labels: labels,
        datasets: [
          {
            data: data_volume,
          },
        ],
      },
    });
  };

  //set last modified date
  useEffect(() => {
    if (modified) {
      console.log("TRIGGER LAST MODIFIED");
      //set last modified label
      _handleModify();
    }
    setModified(false);
  }, [modified]);

  const bc = theme === "dark" ? ["#383838", "#565656"] : ["#BFBFBF", "#D6D6D6"]; //background color
  const tc = theme === "light" ? "#4F4F4F" : "#E0F0F0"; //text color
  const cc = theme === "dark" ? ["#494949", "#202020"] : ["#FAFAFA", "#D0D0D0"]; //card colors

  return (
    <LinearGradient
      colors={bc}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Button
            style={{
              borderRadius: 0,
              width: Dimensions.get("window").width * 0.45,
              marginTop: 10,
            }}
            color="orange"
            onPress={handleAnalytics}
            mode="contained"
          >
            Analytics
          </Button>

          <Button
            style={{
              marginTop: 10,
              borderRadius: 0,
              width: Dimensions.get("window").width * 0.45,
            }}
            color="green"
            onPress={handleAdd}
            mode="contained"
          >
            Add set
          </Button>
        </View>
        {DATA && (
          <FlatList
            style={{ width: Dimensions.get("window").width }}
            data={DATA}
            renderItem={({ item }) => {
              let totalVolume = 0;
              item.sets.forEach((set) => {
                totalVolume += Math.round(
                  unit === "imperial"
                    ? set.reps * set.weight
                    : set.reps * set.weight * 0.45359237
                );
              });
              return (
                <View style={{ alignItems: "center" }}>
                  <Card
                    mode="elevated"
                    elevation={3}
                    style={{
                      backgroundColor: cc,
                      shadowColor: "black",
                      shadowRadius: 10,
                      shadowOpacity: theme === "dark" ? 0.7 : 0.3,
                      width: Dimensions.get("window").width * 0.9,
                      marginTop: 10,
                      borderWidth: theme === "dark" ? 1 : 0,
                      borderColor: "white",
                    }}
                  >
                    <LinearGradient
                      colors={cc}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Card.Title
                        title={
                          <Text style={{ color: tc, fontWeight: "bold" }}>
                            {item.date}
                          </Text>
                        }
                        subtitle={
                          <Text style={{ color: tc, fontWeight: "bold" }}>
                            Total volume: {totalVolume}
                          </Text>
                        }
                        left={() => <List.Icon icon="dumbbell" color={tc} />}
                      />
                      <Divider style={{ backgroundColor: tc }} />
                      {item.sets.map((set) => (
                        <View key={set.id} styles={{ flex: 1 }}>
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
                                    <Text style={styles.actionText}>
                                      Delete
                                    </Text>
                                  </RectButton>
                                </Animated.View>
                              );
                            }}
                          >
                            <View style={{ backgroundColor: theme==='dark'?'#4d4d4d':'#ededed'}}>
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
                                        style={{
                                          fontWeight: "bold",
                                          color: "red",
                                        }}
                                      >
                                        Weight:{" "}
                                        {Math.round(
                                          unit === "imperial"
                                            ? set.weight
                                            : set.weight * 0.45359237
                                        )}{" "}
                                        {unit === "imperial" && "lb"}{" "}
                                        {unit === "metric" && "kg"}
                                      </Text>
                                    </View>
                                  );
                                }}
                                left={() => {
                                  return (
                                    <List.Icon icon="arrow-left" color={tc} />
                                  );
                                }}
                                right={() => {
                                  return (
                                    <Text
                                      style={{ top: 20, right: 20, color: tc }}
                                    >
                                      {set.time}
                                    </Text>
                                  );
                                }}
                              />
                            </View>
                          </Swipeable>
                        </View>
                      ))}
                    </LinearGradient>
                  </Card>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
            extraData={[rerender, unit, theme]} //if set is modified, need to force this to rerender
          />
        )}
        {!DATA && (
          <Text
            style={{
              top: 200,
              color: "grey",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Add a set to start tracking!
          </Text>
        )}
      </View>
    </LinearGradient>
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
