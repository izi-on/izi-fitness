import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable, RectButton, ScrollView } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid'
import { Dimensions } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';

export default function Home({navigation, route}) {

    const [textS, setTextS] = useState('')
    const [exercises, setExercises] = useState([]) //currently for testing, this will be stored locally or on a server later
    const [rSwitch, setRSwitch] = useState(false)
    const [removed, setRemoved] = useState(false)
    const cardWidth = Dimensions.get('window').width*0.8;
    //const [filtered, setFiltered] = useState([])

    var newExer;
    function setVar () {
      try {
        newExer = route.params.exercise
      } catch (e) {
        newExer = null
      }
    }
    setVar()

    const _addExercise = async (exercise) => {
      try {
        var jsonValue;
        if (exercise) {
          jsonValue = JSON.stringify({data: [...exercises, exercise]})
        } else {
          jsonValue = JSON.stringify({data: (exercises)?[...exercises]:null})
        }
        await AsyncStorage.setItem('exercises',jsonValue)
      } catch (e) {
        console.log(e)
      }
    }

    const _getExercises = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('exercises')
        const res = (jsonValue !== null) ? JSON.parse(jsonValue) : null
        setExercises(res.data)
      } catch (e) {
        console.log(e)
      }
    }

    //triggers useEffect to refresh data on current page
    const pageRefresh = () => {setRSwitch(pSwitch => {return !pSwitch})}

    const removeExercise = async (itemId) => {
      //remove exercise sets
      try {
        await AsyncStorage.removeItem('exercise-'+itemId)
      } catch (e) {
        console.log(e)
      }

      //remove exercise
      setExercises(prevExercises => {
        const newExercises = prevExercises.filter(exercise => {
          return exercise.id !== itemId
        })
        
        return newExercises
      })

      setRemoved(true)


    }

    const clearAsyncStorage = async() => {
      AsyncStorage.clear();
    }

    //refresh also runs on start
    useEffect(() => {
      _getExercises()
    }, [rSwitch])

    useEffect(() => {
      if (removed) {
        setRemoved(false)
        _addExercise() //refresh db
        pageRefresh()
      }
    }, [removed])

    useEffect(() => {
      if (newExer) {
        const exercise = {name: newExer, id: uuid.v4(), date: new Date().toDateString()}
        _addExercise(exercise)
        pageRefresh()
        setTextS('')
      }
    }, [newExer])

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

  return (
    
    <View style={{alignItems:'center', flex:1}}>
      <View style={{...styles.container, zIndex: 1, width: Dimensions.get ('window').width, backgroundColor: 'white'}}>
        <TextInput 
          mode='outlined'
          style={{margin: 10}}
          label='Search exercise'
          activeOutlineColor='blue'
          onChangeText={setTextS}
          value={textS}
        />
      </View>
        {exercises && <FlatList
          data={exercises}
          renderItem={({item}) => 
            {
              if (item.name.includes(textS)) {
                return (
                  <View style={{marginTop: 5, width: cardWidth}}>
                    <Swipeable
                      renderRightActions={(progress, dragX) => {
                        const trans = dragX.interpolate({
                          inputRange: [0, 50, 100, 101],
                          outputRange: [-20, 0, 0, 1],
                        });
                        return (
                          <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
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
                              style={[styles.rightAction, { 
                                backgroundColor: 'red',
                              }]}
                              contentStyle={{width: cardWidth, height: 200}}
                              onPress={() => removeExercise(item.id)}>
                              <Text style={styles.actionText}>Delete</Text>
                            </Button>
                          </Animated.View>
        
                        );
                      }}
                    >
                      <Card
                        onPress={() => {navigation.navigate('Exercise', {name: item.name, id: item.id});}}
                        mode='contained'
                      >
                        <Card.Title title={item.name} subtitle={`Last modified: ${item.date}`}/>
                        <Card.Actions>
                          <Button></Button>
                        </Card.Actions>
                      </Card>
                    </Swipeable>
                  </View>
                )
              } else {
                return 
              }
            }

          }
          keyExtractor={item => item.id}
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
        />}
        <Button
          style={{ position: 'absolute', zIndex: '2', bottom: Dimensions.get('window').height*0.05, right: 15,
                  justifyContent: 'center',
                  shadowColor: 'black', shadowRadius: 20,
                  shadowOpacity: 0.6, width: 200, height: 60
          }}
          contentStyle={{height: 60}}
          onPress={() => navigation.navigate('Add exercise', {exercises: exercises}) /*handleCreate*/}
          mode='contained'
          color='green'
          icon='plus'
        >Add Exercise</Button>
    </View>
    

  )
}
//for the animation swipe (mainly)
const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    overflow: "visible",
  },

  button: {
    width: Dimensions.get('window').width*0.2,
    height: Dimensions.get('window').height*0.05,
    borderRadius: 10,
    backgroundColor: 'green',
    marginTop: 12,
    alignItem: 'center',
    justifyContent:'center'
  },

  plusIcon: {
    width: 20,
    height: 20,
    tintColor: 'white'
  },


  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },

  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});