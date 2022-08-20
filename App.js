import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
//tabs import
import HomeStackScreen from "./tabs/HomeStackScreen.js";
import Settings from "./tabs/Settings";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer>
        <Tab.Navigator
          sceneContainerStyle={{ backgroundColor: "white" }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Workout") {
                iconName = "weight-lifter"
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;

              } else if (route.name === "Settings") {
                iconName = "settings"
                return <Ionicons name={iconName} size={size} color={color} />

              }

              // You can return any component that you like here!
            },
            tabBarActiveTintColor: "green",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Workout" component={HomeStackScreen} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
