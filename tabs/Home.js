import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Swipeable,
  RectButton,
  ScrollView,
} from "react-native-gesture-handler";
import uuid from "react-native-uuid";
import { Dimensions, Keyboard } from "react-native";
import { Button, TextInput, Card, List } from "react-native-paper";
import { _getData } from "../custom-functions/async-functions";
import { Context } from "../context/Context";
import { invertColor } from "../custom-functions/color-invert";
import { LinearGradient } from "react-native-svg";

export default function Home({ navigation, route }) {
  const [textS, setTextS] = useState("");
  const [exercises, setExercises] = useState([]); //currently for testing, this will be stored locally or on a server later
  const [rSwitch, setRSwitch] = useState(false);
  const [removed, setRemoved] = useState(false);
  const cardWidth = Dimensions.get("window").width * 0.8;
  const { theme } = useContext(Context);
  let animatedValue = useRef(new Animated.Value(0)).current;

  //const [filtered, setFiltered] = useState([])

  /*
  var newExer;
  function setVar() {
    try {
      newExer = route.params.exercise;
    } catch (e) {
      newExer = null;
    }
  }
  setVar();
  */

  const _addExercise = async (exercise) => {
    try {
      var jsonValue;
      if (exercise) {
        jsonValue = JSON.stringify({ data: [...exercises, exercise] });
      } else {
        jsonValue = JSON.stringify({ data: exercises ? [...exercises] : null });
      }
      await AsyncStorage.setItem("exercises", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const _getExercises = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("exercises");
      const res = jsonValue !== null ? JSON.parse(jsonValue) : null;
      if (res) {setExercises(res.data);}
      else {setExercises([])}
      
    } catch (e) {
      console.log(e);
    }
  };

  //triggers useEffect to refresh data on current page
  const pageRefresh = () => {
    setRSwitch((pSwitch) => {
      return !pSwitch;
    });
  };

  const removeExercise = async (itemId) => {
    //remove exercise sets
    try {
      await AsyncStorage.removeItem("exercise-" + itemId);
    } catch (e) {
      console.log(e);
    }

    //remove exercise
    setExercises((prevExercises) => {
      const newExercises = prevExercises.filter((exercise) => {
        return exercise.id !== itemId;
      });

      return newExercises;
    });

    setRemoved(true);
  };

  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };

  //on focus, remove back button in home screen
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      DeviceEventEmitter.emit("removeBackButton");
    });
    return unsub;
  }, [navigation]);

  //check for modified data
  useEffect(() => {
    console.log("trigger modif in home");
    const unsub = navigation.addListener("focus", () => {
      _getExercises();
    });
    return unsub;
  }, [navigation]);

  //refresh also runs on start
  useEffect(() => {
    console.log("trigger refresh in home");
    _getExercises();
  }, [rSwitch]);

  useEffect(() => {
    if (removed) {
      console.log("trigger remove in home");
      setRemoved(false);
      _addExercise(); //refresh db
      pageRefresh();
    }
  }, [removed]);

  //handle new exercise
  useEffect(() => {
    if (route.params?.exercise) {
      const newExer = route.params.exercise;
      console.log("trigger new exercise");
      const exercise = {
        name: newExer,
        id: uuid.v4(),
        lastModifiedDate: new Date().toLocaleDateString(),
        lastModifiedTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      _addExercise(exercise);
      pageRefresh();
      setTextS("");
      route.params.exercise = null;
    }
  }, [route.params?.exercise]);

  //fade in animation
  useEffect(() => {
    console.log("refresh");
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  /*
    useEffect(() => {
      if (textS.trim() !== '') {
        setFiltered(exercises.filter(exercise => {
          return exercise.name.includes(textS)
        }))
      } else {
        setFiltered(exercises)
      }
    }, [textS, exercises])
    */

  const bc = theme === "dark" ? ["#565656", "#383838"] : ["#D6D6D6", "#BFBFBF"]; //background color
  const tc = theme === "light" ? "#4F4F4F" : "#E0F0F0"; //text color
  const cc = theme === "dark" ? ["#108800", "#0C6100"] : ["#FAFAFA", "#D0D0D0"]; //card colors

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={bc}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={{ alignItems: "center", flex: 1 }}>
          <TextInput
            mode="outlined"
            style={{
              margin: 10,
              zIndex: 1,
              width: Dimensions.get("window").width * 0.9,
              height: 50,
              backgroundColor: theme === "light" ? cc : bc,
            }}
            label={<Text style={{ color: tc }}>Search exercise</Text>}
            outlineColor={tc}
            activeOutlineColor={tc}
            value={textS}
            theme={{ colors: { text: tc } }}
            onChangeText={setTextS}
            maxLength={55}
          />
          <Animated.View style={{ opacity: animatedValue }}>
            {exercises.length !== 0 && (
              <FlatList
                showsVerticalScrollIndicator="false"
                data={exercises}
                renderItem={({ item }) => {
                  if (
                    item.name
                      .toLowerCase()
                      .trim()
                      .includes(textS.toLowerCase().trim())
                  ) {
                    return (
                      <View style={{ marginTop: 5, width: cardWidth }}>
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
                                {/*
                            <RectButton
                              style={[styles.rightAction, { 
                                backgroundColor: 'red',
                                elevation: 3,
                                shadowOffset: {width: 1, height: 1},
                                shadowColor: '#333',
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                            }]}
                              onPress={() => removeExercise(item.id)}>
                              <Text style={styles.actionText}>Delete</Text>
                            </RectButton> */}
                                <Button
                                  style={[
                                    styles.rightAction,
                                    {
                                      backgroundColor: "red",
                                    },
                                  ]}
                                  contentStyle={{
                                    width: cardWidth,
                                    height: 200,
                                  }}
                                  onPress={() => removeExercise(item.id)}
                                >
                                  <Text style={styles.actionText}>Delete</Text>
                                </Button>
                              </Animated.View>
                            );
                          }}
                        >
                          <LinearGradient
                            colors={cc}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ flex: 1 }}
                          >
                            <Card
                              style={{
                                backgroundColor: "rgba(52, 52, 52, 0)",
                              }}
                              onPress={() => {
                                navigation.navigate("Exercise", {
                                  name: item.name,
                                  id: item.id,
                                });
                              }}
                              mode="contained"
                              left={() => <List.Icon icon="arrow-left" />}
                            >
                              <Card.Title
                                title={
                                  <Text style={{ color: tc }}>{item.name}</Text>
                                }
                              />
                              <Card.Content>
                                <View>
                                  <Text style={{ color: tc }}>
                                    Last modified:
                                  </Text>
                                  <Text style={{ color: tc }}>
                                    {item.lastModifiedDate} at{" "}
                                    {item.lastModifiedTime}
                                  </Text>
                                </View>
                              </Card.Content>
                              <Card.Actions>
                                <Button></Button>
                              </Card.Actions>
                            </Card>
                          </LinearGradient>
                        </Swipeable>
                      </View>
                    );
                  } else {
                    return;
                  }
                }}
                keyExtractor={(item) => item.id}
              />
            )}
            {exercises.length === 0 && (
              <Text
                style={{
                  top: 200,
                  color: "grey",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Click ADD to get started!
              </Text>
            )}
            <View style={{ height: 78, width: 10 }}></View>
          </Animated.View>
          <Button
            style={{
              position: "absolute",
              zIndex: 2,
              bottom: Dimensions.get("window").height * 0.05,
              right: 15,
              bottom: 15,
              justifyContent: "center",
              shadowColor: "black",
              shadowRadius: 10,
              shadowOpacity: 0.6,
              width: 100,
              height: 60,
            }}
            contentStyle={{ height: 60 }}
            onPress={
              () =>
                navigation.navigate("Add exercise", {
                  exercises: exercises,
                }) /*handleCreate*/
            }
            mode="contained"
            color="green"
            icon="plus"
          >
            Add
          </Button>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
//for the animation swipe (mainly)
const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    overflow: "visible",
  },

  button: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").height * 0.05,
    borderRadius: 10,
    backgroundColor: "green",
    marginTop: 12,
    alignItem: "center",
    justifyContent: "center",
  },

  plusIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },

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
