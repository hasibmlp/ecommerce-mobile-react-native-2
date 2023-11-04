import { View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { useLayoutEffect } from "react";

export default function Skeleton({ width, height, style }) {
  const translateX = useRef(new Animated.Value(-width)).current;


  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        useNativeDriver: true,
        duration: 1000,
      })
    ).start();
  }, [width]);

  return (
    <View style={[{ width: width, height: height}, style]} className=" bg-gray-200 overflow-hidden">
      <Animated.View
        className="w-full h-full overflow-hidden"
        style={{ transform: [{ translateX: translateX }] }}
      >
        <LinearGradient
          className="w-full h-full"
          colors={["transparent", "rgba(0, 0, 0, 0.03)", "transparent"]}
          start={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}
