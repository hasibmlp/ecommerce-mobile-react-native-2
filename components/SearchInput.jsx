import { Text, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { FONT_FAMILY } from "../theme";

export default function SearchInput({ text, size }) {
  return (
    <View className="h-[50px] flex flex-row bg-white items-center rounded-[10px] flex-1 pl-2">
      <MagnifyingGlassIcon size={22} color="black" strokeWidth={1} />
      <Text style={FONT_FAMILY.primary} className={`text-[${size}px] font-normal text-gray-500 ml-[15px]`}>
        {text}
      </Text>
    </View>
  );
}
