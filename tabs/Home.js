import { View, Text, Button, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated} from 'react-native'
import Card from '../custom-components/Card'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid'

export default function Home({navigation}) {

    const [textS, setTextS] = useState('')
    const [exercises, setExercises] = useState([]) //currently for testing, this will be stored locally or on a server later
    const [rSwitch, setRSwitch] = useState(false)
    const [removed, setRemoved] = useState(false)

    const handleCreate = () => {
        if (textS === '') {return;}
        const exercise = {name:textS, id: uuid.v4()}
        _addExercise(exercise)
        pageRefresh()
        setTextS('')
    }

    const _addExercise = async (exercise) => {
      try {
        var jsonValue;
        if (exercise) {
          console.log('ADDING EXERCISE: ', exercise)
          jsonValue = JSON.stringify({data: [...exercises, exercise]})
        } else {
          console.log('UPDATING EXERCISES: ', exercises)
          jsonValue = JSON.stringify({data: (exercises)?[...exercises]:null})
        }
        await AsyncStorage.setItem('exercises',jsonValue)
        console.log('EXERCISES ADDED/UPDATED')
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
    const pageRefresh = () => {console.log('REFRESHING...'); setRSwitch(pSwitch => {return !pSwitch})}

    const removeExercise = async (itemId) => {
      //remove exercise sets
      try {
        await AsyncStorage.removeItem('exercise-'+itemId)
      } catch (e) {
        console.log(e)
      }

      //remove exercise
      console.log('removing exercise: ', itemId)
      setExercises(prevExercises => {
        const newExercises = prevExercises.filter(exercise => {
          return exercise.id !== itemId
        })
        console.log('new exercises are:', newExercises)
        
        return newExercises
      })

      setRemoved(true)


    }

    const clearAsyncStorage = async() => {
      AsyncStorage.clear();
    }

    //refresh also runs on start
    useEffect(() => {
      console.log('REFRESH TRIGGERED')
      _getExercises()
      AsyncStorage.getAllKeys((err, keys) => {
        if (err) {console.log(err)}
        console.log('THE KEYS ARE:', keys)
      })
    }, [rSwitch])

    useEffect(() => {
      if (removed) {
        setRemoved(false)
        _addExercise() //refresh db
        pageRefresh()
      }
    }, [removed])

  return (
    
    <View>
        <Text>Exercise logs:</Text>
        <TextInput 
            style={{
                height: 40,
                margin: 12,
                borderWidth: 1,
                padding: 10,
              }}
            placeHolder='Enter exercise name'
            onChangeText={setTextS}
            value={textS}
        />
        <Button
            title='Add exercise'
            onPress={handleCreate}
        />  
            <FlatList
              data={exercises}
              renderItem={({item}) => (
                
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
                          onPress={() => removeExercise(item.id)}>
                          <Text style={styles.actionText}>Delete</Text>
                        </RectButton>
                      </Animated.View>

                    );
                  }}
                >
                  <TouchableOpacity 
                    onPress={() => {navigation.navigate('Exercise', {name: item.name, id: item.id});}}
                  > 
                    <Card>
                        <Text> {item.name} </Text>
                    </Card>
                  </TouchableOpacity>
                </Swipeable>

              )}
              keyExtractor={item => item.id}
            />
        <Button
          title='Delete all data'
          onPress={clearAsyncStorage}
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