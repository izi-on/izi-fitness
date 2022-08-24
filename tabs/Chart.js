import { View, Text } from "react-native";
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

  return (
    <LinearGradient
      colors={bc}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{alignItems: 'center'}}>
        <Text>Bezier Line Chart</Text>
        <LineChart
          data={route.params.data}
          width={Dimensions.get("window").width * 0.9} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: graphColorBackground,
            backgroundGradientFrom: graphColor1,
            backgroundGradientTo: graphColor2,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </LinearGradient>
  );
}
