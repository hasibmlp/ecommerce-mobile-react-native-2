
import { useContext} from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


const IMAGE_WIDTH = 100
const SPACING = 12

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
    <FlatList
    data={option.values}
    key={(_, index) => index.toString()}
    keyExtractor={(_, index) => index.toString()}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{paddingHorizontal: 12}}
    renderItem={({item, index}) => (
      <TouchableOpacity
          style={{marginRight: SPACING}}
          key={index.toString()}
          onPress={() => handlePress(item)}
          className={`h-10 border-[.5px] rounded-[5px] justify-center px-3 ${
            false
              ? "bg-gray-100 border-gray-300"
              : ""
          } ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === item ? "bg-black" : ""}`}
        >
          <Text
            className={` text-[14px] font-light uppercase ${
              false
                ? "text-gray-500"
                : "text-black"
            } ${activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === item ? "text-white" : ""}`}
          >
            {item}
          </Text>
      </TouchableOpacity>
    )}
  />
  );
}