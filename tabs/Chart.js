import { View, Text, StyleSheet, Easing } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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

export default function Chart({ navigation, route }) {
  const { theme, unit } = useContext(Context);
  const bc = theme === "dark" ? ["#303030", "#121212"] : ["#dbdbdb", "#ffffff"];
  const tc = theme === "dark" ? "#ffffff" : "000000";
  const graphColorBackground = theme === "dark" ? "black" : "white";
  const graphColor1 = "#858585";
  const graphColor2 = theme === "dark" ? "#525252" : "#bfbfbf";

  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const [dataProperUnit, setDataProperUnit] = useState(null)

  const styles = {
    ChartTitle: {
      color: theme === "dark" ? "white" : "black",
      marginTop: 15,
      fontWeight: "bold",
      fontSize: 20,
    },
  };

  useEffect(() => {
    console.log("trigger animation");
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      if (unit==='metric') {
        console.log('UNIT APPLIED IS METRIC')
        setDataProperUnit({
          labels: route.params.data.labels,
          datasets: route.params.data.datasets.map(item => {
            const newData = item.data.map(item => {return item*0.453592})
            return {data: newData}
          }),
          metricTheme: 'metric'
        })
        //triggerRefresh(r => !r)
      } else {
        console.log('UNIT APPLIED IS IMPERIAL')
        setDataProperUnit(route.params.data)
        //triggerRefresh(r => !r)
      }
    });
  }, [navigation, unit]);

  return (
    <LinearGradient
      colors={bc}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        { dataProperUnit && 
          <Animated.View
            style={{
              opacity: opacityValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Dimensions.get("window").height, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.ChartTitle}>VOLUME CHART</Text>
            {console.log(unit, dataProperUnit)}
            <LineChart
              data={dataProperUnit}
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
        }
      </View>
    </LinearGradient>
  );
}
