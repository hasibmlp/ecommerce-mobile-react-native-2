import React from "react";
import { Pressable, Text, Touchable, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/outline";

export default function TabButton({title, onPress, activeButton, active}) {
    return (
        <TouchableHighlight underlayColor="#FFFFFF" onPress={onPress} className={`w-full h-14 px-3 border-b border-gray-200 flex-row items-center ${active ? 'bg-white' : ''}`}>
            <Text className="text-[11px] text-black font-normal uppercase">{title}</Text>
            {/* { (<CheckCircleIcon style={{position: 'absolute', right: 6}} size={20} color="black" strokeWidth={1}/>)} */}
        </TouchableHighlight>
    )
}