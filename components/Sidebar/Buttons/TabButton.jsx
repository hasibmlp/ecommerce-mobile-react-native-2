import { Pressable, Text } from "react-native";

export default function TabButton({title, handlePress, activeButton}) {
    return (
        <Pressable onPress={() => handlePress(activeButton)} className={`w-full py-5 px-2 border-b border-gray-200 ${activeButton === title ? 'bg-white' : ''}`}>
            <Text className="text-[11px] text-black font-normal uppercase">{title}</Text>
        </Pressable>
    )
}