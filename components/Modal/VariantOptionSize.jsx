
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";

export default function VariantOptionSize({ option, availableSizeForColor, context }) {
  const {setActiveOptions, activeOptions} = useContext(context)
  const avilableOption = availableSizeForColor?.length > 0 ? availableSizeForColor :  option.values
  const isButtonActive = ''


  const handlePress = (optionValue) => {

    setActiveOptions(prevState => {
      const prevOptions = [...prevState]
      const findIndex = prevOptions.findIndex(optionItem => optionItem.name === option.name)
      if(findIndex > -1) {
        prevOptions.splice(findIndex , 1)
        prevOptions.push({id: option.id, name: option.name, value: optionValue})
      }else {
        prevOptions.push({id: option.id, name: option.name, value: optionValue})
      }
      return prevOptions
    })
  }

  return (
    <ScrollView className="px-5" horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((value, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => handlePress(value)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === value ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase text-black ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === value ? "text-white" : ""}`}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
