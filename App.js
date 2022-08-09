import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//tabs import
import HomeStackScreen from './tabs/HomeStackScreen.js'
import Settings from './tabs/Settings'
import Exercise from './tabs/Exercise'
import Home from './tabs/Home'

Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer
    
    >
      <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: 'white' }}
      >
        <Tab.Screen name='Workout' component={HomeStackScreen}/>
        <Tab.Screen name='Settings' component={Settings}/>
      </Tab.Navigator>
      

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
