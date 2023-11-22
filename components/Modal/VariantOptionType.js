
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionType({ option, availableTypeForColor, context }) {
  const {activeType, setActiveType} = useContext(context)
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => (activeType === item ? setActiveType(null) : setActiveType(item))}
            disabled={!availableTypeForColor.includes(item)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              !availableTypeForColor.includes(item)
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${activeType === item ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                !availableTypeForColor.includes(item)
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
