import { View } from "react-native";
import TickIcon from "./Icon/TickIcon";

export default function CheckBox({active}) {
    return (
        <View className={`w-[15px] h-[15px] border ${active ? 'bg-black' : ''} border-gray-500 rounded-[3px] items-center justify-center`}>
            {active && (<TickIcon />)}
        </View>
    )
}