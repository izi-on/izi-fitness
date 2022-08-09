import { View, Text, FlatList, Button, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Card from '../custom-components/Card'
import { RectButton } from 'react-native-gesture-handler'
import { Swipeable } from 'react-native-gesture-handler'

export default function Exercise({navigation, route}) {

    const name = route.params.name //NAME OF THE EXERCISE
    console.log('THE NAME IS', name)

    //for testing purposes, this will be extracted later from local db
    const [DATA, SETDATA] = useState([])

    //GET DATA FUNCTION 
    const _getData = async () => {
        try {
            jsonValue = await AsyncStorage.getItem('exercise-'+name)
            res = (jsonValue !== null ? JSON.parse(jsonValue): null)
            SETDATA(res.data) //CHECK IF NULL 
        } catch (e) {
            console.log(e)
        }
    }
    
    //STORE DATA
    const _storeData = async (newData) => {
        try {
            jsonValue = JSON.stringify({data: newData})
            await AsyncStorage.setItem('exercise-'+name, jsonValue)
        } catch (e) {
            console.log(e)
        }
    }

    //HANDLE ADDING DATA, LOGIC IS IN USE EFFECT
    const handleAdd = () => {
        navigation.navigate('Add set', {name: name})
    }

    //REMOVE DATA
    const removeData = (itemId, setId) => {

      console.log(`REMOVING ITEM: ${itemId} AND SET: ${setId}`)

      SETDATA((prevData) => {

        let newData = prevData.map(item => {
          
          if (itemId !== item.id) {return item}

          const newSets = item.sets.filter(set => {
            return (set.id !== setId)
          })
          console.log('NEW SETS AFTER FILTER: ', newSets)
          return (newSets.length === 0) ? null : {...item, sets: newSets}

        })
        newData = newData.filter(data => {return data!==null})
        console.log('OBJECT AFTER FILTER:', newData)
        if (newData.length === 0) {
          _storeData(null)
          return null
        } else {
          _storeData(newData)
          return newData
          
        }
        
      })  
    }

    //ON INITIAL LOAD, GET DATA
    useEffect(() => {
        console.log('INIT LOAD DETECTED, GET DATA')
        _getData()
    }, [])

    //ADD DATA
    useEffect(() => {
        
        const returnData = route.params.returnData

        //ADD DATA? 
        if (returnData) {
            
            console.log('NEW SET DETECTED, ADDING SET')


            SETDATA((prevData) => {
              
              console.log('THE PREVIOUS DATA WAS: ', prevData)

              var newData;

              if (!prevData) {

                newData = [{
                  id: Math.floor(Math.random() * 1000000000).toString(),
                  date: returnData.date,
                  sets: [{reps: returnData.reps, weight: returnData.weight, id: returnData.id}]
                }]

              } else {

                let toInsert = true //if its a new date

                newData = prevData.map((item) => {
                  
                  if (returnData.date.toLowerCase() === item.date.toLowerCase()) {
                      toInsert = false
                      item.sets.push({
                          reps: returnData.reps,
                          weight: returnData.weight,
                          id: returnData.id
                      })
                  } 
                  
                  return item

                })

                if (toInsert) {
                    newData.push({
                        id: Math.floor(Math.random() * 1000000000).toString(),
                        date: returnData.date,
                        sets: [{reps: returnData.reps, weight: returnData.weight, id: returnData.id}]
                    })
                }

              }

              console.log('THE NEW DATA IS: ', newData)

              //store to local db
              _storeData(newData)

              return newData
                
            })
            
        } 
    }, [route.params.returnData])

  return (
    <View>
      <Button 
        title="Add set"
        onPress={handleAdd}
      />

      <Text>Exercise history for {name}:</Text>
      <FlatList
        data={DATA}
        renderItem={({item}) => {

            return (
                <View>
                {console.log('RENDERING ITEM: ', item.id)}
                <Text>{item.date}:</Text>
                        <View>
                                {item.sets.map((set) => (
                                    <View  key={set.id}>
                                        {console.log('RENDERING SET: ', set.id)}
                                        <Swipeable
                                          renderRightActions={(progress, dragX) => {
                                            const trans = dragX.interpolate({
                                              inputRange: [0, 50, 100, 101],
                                              outputRange: [-20, 0, 0, 1],
                                            });
                                            return (
                                              <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
                                                <RectButton
                                                  style={[styles.rightAction, { 
                                                    backgroundColor: 'red',
                                                    borderRadius: 6,
                                                    elevation: 3,
                                                    shadowOffset: {width: 1, height: 1},
                                                    shadowColor: '#333',
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 2,
                                                    marginHorizontal: 4,
                                                    marginVertical: 6,
                                                }]}
                                                  onPress={() => removeData(item.id, set.id)}>
                                                  <Text style={styles.actionText}>Delete</Text>
                                                </RectButton>
                                              </Animated.View>
                                            );
                                          }}
                                        >
                                            <Card>

                                                <View>
                                                    <Text>Reps: {set.reps} </Text>
                                                    <Text>Weight: {set.weight} </Text>
                                                </View>

                                            </Card>
                                        </Swipeable>
                                    </View>
                                ) )}
                        </View>
                </View>
            )
            
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

//for the animation swipe (mainly)
const styles = StyleSheet.create({
    leftAction: {
      flex: 1,
      backgroundColor: '#497AFC',
      justifyContent: 'center',
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