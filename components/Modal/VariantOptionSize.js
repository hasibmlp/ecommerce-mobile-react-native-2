import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionSize({ option, availableSizeForColor }) {
  const { size, setSize } = useContext(VariantSelectionContext);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => setSize(item)}
            disabled={!availableSizeForColor.includes(item)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              !availableSizeForColor.includes(item)
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${size === item ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                !availableSizeForColor.includes(item)
                  ? "text-gray-500"
                  : "text-black"
              } ${size === item ? "text-white" : ""}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
