
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionSize({ option, availableSizeForColor, context }) {
  const {activeSize, setActiveSize} = useContext(context)
  const avilableOption = availableSizeForColor?.length > 0 ? availableSizeForColor :  option.values
  const isButtonActive = ''

  console.log("AVAILABLE OPTIONS: ",avilableOption)

  const handlePress = (item) => {
    setActiveSize(item)
  }

  return (
    <ScrollView className="px-5" horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((option, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => handlePress(option)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              !option.availableForSale
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${activeSize === option ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                !option.availableForSale
                  ? "text-gray-500"
                  : "text-black"
              } ${activeSize === option ? "text-white" : ""}`}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
