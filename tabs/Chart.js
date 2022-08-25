import { View, Text, StyleSheet } from "react-native";
import React from "react";
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

export default function Chart({ route }) {
  const { theme } = useContext(Context);
  const bc = theme === "dark" ? ["#303030", "#121212"] : ["#dbdbdb", "#ffffff"];
  const tc = theme === "dark" ? "#ffffff" : "000000";
  const graphColorBackground = theme === "dark" ? "black" : "white";
  const graphColor1 = "#858585";
  const graphColor2 = theme === "dark" ? "#525252" : "#bfbfbf";

  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value * 255 }],
    };
  });


  const styles = {
    ChartTitle: {
      color: theme === "dark" ? "white" : "black",
      marginTop: 15,
      fontWeight: "bold",
      fontSize: 20,
    },
  };

  return (
    <LinearGradient
      colors={bc}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
        <View style={{ alignItems: "center" }}>
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
        </View>
    </LinearGradient>
  );
}
