import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';
//tabs import
import HomeStackScreen from './tabs/HomeStackScreen.js'
import Settings from './tabs/Settings'


Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer>
        <Tab.Navigator
        sceneContainerStyle={{ backgroundColor: 'white' }}
        >
          <Tab.Screen name='Workout' component={HomeStackScreen}/>
          <Tab.Screen name='Settings' component={Settings}/>
        </Tab.Navigator>
        

      </NavigationContainer>
    </PaperProvider>
  );
}

