import { View, Text, StyleSheet, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Context } from "../context/Context";
import { useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Animated } from "react-native";

export default function Chart({ route }) {
  const { theme } = useContext(Context);
  const bc = theme === "dark" ? ["#303030", "#121212"] : ["#dbdbdb", "#ffffff"];
  const tc = theme === "dark" ? "#ffffff" : "000000";
  const graphColorBackground = theme === "dark" ? "black" : "white";
  const graphColor1 = "#858585";
  const graphColor2 = theme === "dark" ? "#525252" : "#bfbfbf";

  const animatedValue = useRef(new Animated.Value(0)).current;

  const styles = {
    ChartTitle: {
      color: theme === "dark" ? "white" : "black",
      marginTop: 15,
      fontWeight: "bold",
      fontSize: 20,
    },
  };

  useEffect(() => {
    console.log('trigger animation')
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp)
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={bc}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <Animated.View style={{
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
            inputRange: [0,1],
            outputRange: [Dimensions.get('window').height, 0]
          })}]
        }}>
          <Text style={styles.ChartTitle}>VOLUME CHART</Text>
          <LineChart
            data={route.params.data}
            width={Dimensions.get("window").width * 0.9} // from react-native
            height={220}
            chartConfig={{
              fillShadowGradientFromOpacity: 0.3,
              fillShadowGradientFrom: "green",
              fillShadowGradientToOpacity: 0,
              backgroundColor: graphColorBackground,
              backgroundGradientFrom: graphColor1,
              backgroundGradientTo: graphColor2,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginTop: 15,
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
