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

  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const opacityValue1 = useRef(new Animated.Value(0)).current;
  const opacityValue2 = useRef(new Animated.Value(0)).current;

  const [dataProperUnit, setDataProperUnit] = useState(null);

  const styles = {
    ChartTitle: {
      color: theme === "dark" ? "white" : "black",
      marginTop: 15,
      fontWeight: "bold",
      fontSize: 20,
    },
    ChartSubInfo: {
      color: theme === "dark" ? "#a6a6a6" : "#595959",
      marginTop: 10,
    },
  };

  useEffect(() => {
    console.log("trigger animation");
    //trigger animation for graph 1
    Animated.timing(animatedValue1, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    //trigger animation (opacity) for graph 1
    Animated.timing(opacityValue1, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //trigger animation for graph 2
    Animated.timing(animatedValue2, {
      delay: 300,
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    Animated.timing(opacityValue2, {
      delay: 300,
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      if (unit === "metric") {
        setDataProperUnit({
          labels: route.params.data.labels,

          datasets: {
            //change unit for volume graph
            data_volume: route.params.data.datasets.data_volume.map((item) => {
              return item * 0.453592;
            }),

            //change unit for heaviest graph
            data_heaviest: route.params.data.datasets.data_heaviest.map(
              (item) => {
                return item * 0.453592;
              }
            ),
          },
          info: {
            volume_pr: route.params.data.info.volume_pr * 0.453592,
            heaviest_set: {
              ...route.params.data.info.heaviest_set,
              weight: route.params.data.info.heaviest_set.weight * 0.453592,
            },
          },
          metricTheme: "metric",
        });
        //triggerRefresh(r => !r)
      } else {
        console.log("UNIT APPLIED IS IMPERIAL");
        setDataProperUnit({
          labels: route.params.data.labels,
          datasets: route.params.data.datasets,
          info: route.params.data.info,
        });
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
        {dataProperUnit && (
          <>
            <Animated.View
              style={{
                opacity: opacityValue1,
                transform: [
                  {
                    translateY: animatedValue1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Dimensions.get("window").height, 0],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.ChartTitle}>VOLUME PER WORKOUT CHART</Text>
              <Text style={styles.ChartSubInfo}>
                Best volume:{" "}
                <Text style={{ ...styles.ChartSubInfo, color: "green" }}>
                  {Math.round(dataProperUnit.info.volume_pr)}
                </Text>
              </Text>
              <LineChart
                data={{
                  labels: dataProperUnit.labels,
                  datasets: [
                    {
                      data: dataProperUnit.datasets.data_volume,
                    },
                  ],
                }}
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
            <Animated.View
              style={{
                opacity: opacityValue2,
                transform: [
                  {
                    translateY: animatedValue2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Dimensions.get("window").height, 0],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.ChartTitle}>
                HEAVIEST SET PER WORKOUT CHART
              </Text>
              <Text style={styles.ChartSubInfo}>
                Heaviest set:{" "}
                <Text style={{ ...styles.ChartSubInfo, color: "orange" }}>
                  Reps: {dataProperUnit.info.heaviest_set.reps}
                </Text>
                <Text> </Text>
                <Text style={{ ...styles.ChartSubInfo, color: "red" }}>
                  Weight: {dataProperUnit.info.heaviest_set.weight}
                </Text>
              </Text>
              <LineChart
                data={{
                  labels: dataProperUnit.labels,
                  datasets: [
                    {
                      data: dataProperUnit.datasets.data_heaviest,
                    },
                  ],
                }}
                width={Dimensions.get("window").width * 0.9} // from react-native
                height={220}
                chartConfig={{
                  fillShadowGradientFromOpacity: 0.3,
                  fillShadowGradientFrom: "blue",
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
          </>
        )}
      </View>
    </LinearGradient>
  );
}
