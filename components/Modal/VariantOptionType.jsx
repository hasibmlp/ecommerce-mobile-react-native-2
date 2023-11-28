
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VariantOptionType({ option, context }) {
  const {activeType, setActiveType} = useContext(context)
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => (activeType === item ? setActiveType(null) : setActiveType(item))}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              false
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${activeType === item ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                false
                  ? "text-gray-500"
                  : "text-black"
              } ${activeType === item ? "text-white" : ""}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
