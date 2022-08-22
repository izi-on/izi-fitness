import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import { Context } from "../App";
import { invertColor } from "../custom-functions/color-invert";

export default function Home({ navigation, route }) {
  const [textS, setTextS] = useState("");
  const [exercises, setExercises] = useState([]); //currently for testing, this will be stored locally or on a server later
  const [rSwitch, setRSwitch] = useState(false);
  const [removed, setRemoved] = useState(false);
  const cardWidth = Dimensions.get("window").width * 0.8;
  const {theme} = useContext(Context)


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
      setExercises(res.data);
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

  const bc = (theme==='light')?'#E0E0E0':'#4F4F4F' //background color
  const tc = (theme==='light')?'#4F4F4F':'#E0F0F0' //text color
  const cc = (theme==='light')? '#FFFFFF':'#000000'

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ alignItems: "center", flex: 1, backgroundColor: bc }}>
        <TextInput
          mode="outlined"
          style={{
            margin: 10,
            zIndex: 1,
            width: Dimensions.get("window").width * 0.9,
            height: 50,
            backgroundColor: theme==='light'?cc:bc,
          }}
          label={<Text style={{color: tc}}>Search exercise</Text>}
          outlineColor={tc}
          activeOutlineColor={tc}
          value={textS}
          theme={{ colors: { text: tc } }}
          onChangeText={setTextS}
        />
        {exercises.length !== 0 && (
          <FlatList
            showsVerticalScrollIndicator="false"
            data={exercises}
            renderItem={({ item }) => {
              if (item.name.includes(textS)) {
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
                            style={{ flex: 1, transform: [{ translateX: 0 }] }}
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
                              contentStyle={{ width: cardWidth, height: 200 }}
                              onPress={() => removeExercise(item.id)}
                            >
                              <Text style={styles.actionText}>Delete</Text>
                            </Button>
                          </Animated.View>
                        );
                      }}
                    >
                      <Card
                        style={{
                          backgroundColor: (theme==='dark')?'green':cc,
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
                        <Card.Title title={<Text style={{color: tc}}>{item.name}</Text>} />
                        <Card.Content>
                          <View>
                            <Text style={{color: tc}}>Last modified:</Text>
                            <Text style={{color: tc}}>
                              {item.lastModifiedDate} at {item.lastModifiedTime}
                            </Text>
                          </View>
                        </Card.Content>
                        <Card.Actions>
                          <Button></Button>
                        </Card.Actions>
                      </Card>
                    </Swipeable>
                  </View>
                );
              } else {
                return;
              }
            }}
            keyExtractor={(item) => item.id}
            /*
          ItemSeparatorComponent={()=>(
            <View
            style={{alignItems:'center'}}
            >
            <View style={{
              height: 1,
              width: "60%",
              backgroundColor: "#607D8B",
            }}></View>
            </View>
          )}
          */
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
        <Button
          style={{
            position: "absolute",
            zIndex: "2",
            bottom: Dimensions.get("window").height * 0.05,
            right: 15,
            bottom: 15,
            justifyContent: "center",
            shadowColor: 'black',
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
