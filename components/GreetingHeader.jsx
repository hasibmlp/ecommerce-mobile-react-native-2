import { Text, View, Pressable, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "react-native-heroicons/outline";
import { useEffect, useRef } from "react";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../App";

export default function GreetingHeader({ state, handleToggleMenu }) {
  const currentGender = useSelector((state) => state.gender.current);
  const rotateRef = useRef(new Animated.Value(0)).current
  const user = useReactiveVar(userVar)

  useEffect(() => {
    Animated.timing(rotateRef, {
      toValue: state? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()

  },[state])

  const rotate = rotateRef.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

  return (
    <Pressable
      onPress={() => handleToggleMenu(!state)}
      className="flex-row justify-between  py-[5px] absolute top-0 left-0 right-0 z-20 bg-gray-100"
    >
      <View className="items-start">
        <Text className="text-[20px] font-normal text-black ml-[15px] mb-2">
          Good Morning! {user?.firstName}
        </Text>
        <Pressable
          className="flex-row items-center"
          onPress={() => handleToggleMenu(!state)}
        >
          <Text className="text-[14px] font-normal text-black ml-[15px] mr-2">
            Shop {currentGender}
          </Text>

          <Animated.View style={{transform: [{rotate: rotate}]}}>
            <ChevronDownIcon size={16} color="black" />
          </Animated.View>

        </Pressable>
      </View>
      <View className="h-[42px] w-[42px] mr-4 rounded-full bg-white justify-center items-center">
        <HeartIcon size={24} color="black" />
      </View>
    </Pressable>
  );
}
