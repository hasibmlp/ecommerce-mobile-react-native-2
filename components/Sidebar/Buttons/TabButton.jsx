import { Pressable, Text, View } from "react-native";

export default function TabButton({title, handlePress, activeButton, active}) {
    return (
        <Pressable onPress={() => handlePress(activeButton)} className={`w-full h-14 px-4 justify-center border-b border-gray-200 ${activeButton === title ? 'bg-white' : ''}`}>
            {active &&(<View className="w-[6px] h-full bg-green-400 absolute left-0"></View> )}
            <Text className="text-[11px] text-black font-normal uppercase">{title}</Text>
        </Pressable>
    )
}