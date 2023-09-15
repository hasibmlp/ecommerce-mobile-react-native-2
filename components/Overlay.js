import { useEffect, useRef } from "react";
import {
  Press,
  View,
  Pressable,
  Animated,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

export default function Overlay({ state, setState }) {
  const opacityRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityRef, {
      toValue: state ? 0.3 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [state]);

  if (!state) return null;

  return (
    <Animated.View
      style={{ opacity: opacityRef }}
      className={` absolute top-0 left-0 bottom-0 right-0 bg-black z-10`}
    >
      <TouchableOpacity
        className="h-full w-full"
        onPress={() => setState(false)}
      >
      </TouchableOpacity>
    </Animated.View>
  );
}
