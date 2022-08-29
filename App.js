
import { Text, Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Animated, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import { createContext, useContext, useEffect, useState } from "react";
import { _getData } from "./custom-functions/async-functions.js";
import { invertColor } from "./custom-functions/color-invert.js";
import { Context } from "./context/Context"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

//tabs import
import HomeStackScreen from "./tabs/HomeStackScreen.js";
import Settings from "./tabs/Settings";


Tab = createBottomTabNavigator();

export default function App() {
  //settings
  const [unit, setUnit] = useState(null);
  const [theme, setTheme] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    (async () => {
      initSettings = await _getData("settings");
      console.log('Got settings')
      if (initSettings) {
        setUnit(initSettings.unit);
        setTheme(initSettings.theme);
        setPending(false);
      } else {
        setUnit('imperial')
        setTheme('dark')
        setPending(false)
      }

    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {pending && <Text style={{ alignSelf: "center" }}>LOADING...</Text>}
      {!pending && (
        <Context.Provider value={{ unit, setUnit, theme, setTheme }}>
          <PaperProvider theme={DefaultTheme}>
            <NavigationContainer>
              <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: "white" }}
                screenOptions={({ route }) => {
                  const { theme } = useContext(Context);

                  const bc = theme === "light" ? "#F0F0F0" : "#111111"; //background color
                  const tc = theme === "light" ? "#111111" : "#F0F0F0"; //text color

                  return {
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === "Workout") {
                        iconName = "weight-lifter";
                        return (
                          <MaterialCommunityIcons
                            name={iconName}
                            size={size}
                            color={color}
                          />
                        );
                      } else if (route.name === "Settings") {
                        iconName = "settings";
                        return (
                          <Ionicons name={iconName} size={size} color={color} />
                        );
                      }

                      // You can return any component that you like here!
                    },
                    headerStyle: {
                      backgroundColor: "green",
                      elevation: 0,
                      shadowOffset: {
                        width: 0,
                        height: 0, // for iOS
                      },
                    },
                    headerTitleStyle: {
                      color: "white",
                    },

                    tabBarActiveTintColor: "green",
                    tabBarInactiveTintColor: tc,
                    tabBarStyle: {
                      elevation: 0,
                      backgroundColor: bc,
                      borderTopColor: bc,
                      shadowOffset: {
                        width: 0,
                        height: 0, // for iOS
                      },
                    },
                  };
                }}
              >
                <Tab.Screen name="Workout" component={HomeStackScreen} />
                <Tab.Screen name="Settings" component={Settings} />
              </Tab.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </Context.Provider>
      )}
    </View>
  );
}
