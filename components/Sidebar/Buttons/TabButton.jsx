import React from "react";
import {
  Pressable,
  Text,
  Touchable,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/outline";

export default function TabButton({ title, onPress, activeButton, active, tabValuesSelected=false }) {
  return (
    <TouchableHighlight
      underlayColor="#FFFFFF"
      onPress={onPress}
      className={`w-full h-14 border-b border-gray-200 flex-row items-center ${
        active ? "bg-white" : ""
      }`}
    >
      <View className="w-full h-full items-start justify-center px-3">
        <Text className="text-[11px] text-black font-normal uppercase">
          {title}
        </Text>
        { tabValuesSelected && (<CheckCircleIcon style={{position: 'absolute', right: 6}} size={20} color="black" strokeWidth={1}/>)}
      </View>
    </TouchableHighlight>
  );
}
