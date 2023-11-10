import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionType({ option, availableTypeForColor }) {
  const { type, setType } = useContext(VariantSelectionContext);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((item, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => (type === item ? setType(null) : setType(item))}
            disabled={!availableTypeForColor.includes(item)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              !availableTypeForColor.includes(item)
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${type === item ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                !availableTypeForColor.includes(item)
                  ? "text-gray-500"
                  : "text-black"
              } ${type === item ? "text-white" : ""}`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
