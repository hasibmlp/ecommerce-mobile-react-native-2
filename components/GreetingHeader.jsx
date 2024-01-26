import {
  Text,
  View,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { useEffect, useRef } from "react";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../makeVars/MakeVars";
import Overlay from "./Overlay";
import { useNavigation } from "@react-navigation/native";

export default function GreetingHeader({ state, handleToggleMenu }) {
  const navigation = useNavigation()
  const currentGender = useSelector((state) => state.gender.current);
  const rotateRef = useRef(new Animated.Value(0)).current;
  const user = useReactiveVar(userVar);

  useEffect(() => {
    Animated.timing(rotateRef, {
      toValue: state ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state]);

  const rotate = rotateRef.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
      <View className="flex-row h-[70] bg-neutral-50 items-center justify-between absolute top-0 left-0 right-0 z-40">
        <TouchableOpacity
          onPress={() => handleToggleMenu(!state)}
          className="items-start h-full justify-center"
        >
          <Text className="text-[20px] font-normal text-black ml-[15px] mb-2 ">
            Good Morning! {user?.firstName}
          </Text>
          <View
            className="flex-row items-center"
          >
            <Text className="text-[14px] font-normal text-black ml-[15px] mr-2">
              Shop {currentGender}
            </Text>

            <Animated.View style={{ transform: [{ rotate: rotate }] }}>
              <ChevronDownIcon size={16} color="black" />
            </Animated.View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("MoreOptionsScreen")} className="h-14 w-14 mr-4 rounded-full bg-white justify-center items-center">
          {!user && <UserIcon size={24} color="black" />}
          {user && (
            <View>
              <Text className="text-xl text-black font-normal">
                {user.firstName.slice(0, 1)}
                {user.lastName.slice(0, 1)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
  );
}
