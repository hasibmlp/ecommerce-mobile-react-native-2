import { Text, View } from "react-native";

export default function OptionLabel({label, count}) {
    return (
        <View className="ml-2">
            <Text className="text-[14px] text-black font-light ">{label}</Text>
            <Text className="text-[11px] text-gray-500 font-normal mt-1">{count} items</Text>
        </View>
    )
}