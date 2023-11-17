import React from "react";
import { Pressable, Text } from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/outline";

export default function TabButton({title, handlePress, activeButton, active}) {
    return (
        <Pressable onPress={() => handlePress(activeButton)} className={`w-full h-14 px-3 border-b border-gray-200 flex-row items-center ${activeButton === title ? 'bg-white' : ''}`}>
            <Text className="text-[11px] text-black font-normal uppercase">{title}</Text>
            {active && (<CheckCircleIcon style={{position: 'absolute', right: 6}} size={20} color="black" strokeWidth={1}/>)}
        </Pressable>
    )
}