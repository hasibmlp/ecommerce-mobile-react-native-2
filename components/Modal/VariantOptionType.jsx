
import { useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VariantOptionType({ option, context }) {
  const {activeOptions, setActiveOptions} = useContext(context)

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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5">
      <View className="flex-row items-center gap-x-3 relative">
        {option.values.map((value, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => handlePress(value)}
            className={`border-[.5px] rounded-[5px] py-3 px-3 ${
              false
                ? "bg-gray-100 border-gray-300"
                : ""
            } ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === value ? "bg-black" : ""}`}
          >
            <Text
              className={` text-[14px] font-light uppercase ${
                false
                  ? "text-gray-500"
                  : "text-black"
              } ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === value ? "text-white" : ""}`}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
