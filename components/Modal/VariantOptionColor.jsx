import { useContext } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { getVariantForSingleOption } from "../utils/UtilsFunctions";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import Skeleton from "../Skeleton";

export default function VariantOptionColor({ option, context }) {
  const {variants, setActiveOptions, activeOptions} = useContext(context)


  const colorOption = option.values.map((value) => {
    const variant = getVariantForSingleOption(variants, 'Color', value)
    return {
      id: option.id,
      name: option.name,
      value: value,
      image: {
        id: variant.image.id,
        url: variant.image.url,
      },
    };
  });

  handlePress = (optionId, optionName,  optionValue, image) => {
    setActiveOptions(prevState => {
      const prevOptions = [...prevState]
      const findIndex = prevOptions.findIndex(option => option.name === optionName)
      if(findIndex > -1) {
        prevOptions.splice(findIndex , 1)
        prevOptions.push({id: optionId, name: optionName, value: optionValue, image})
      }else {
        prevOptions.push({id: optionId, name: optionName, value: optionValue, image})
      }
      return prevOptions
    })


  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="h-[150px] px-5"
    >
      {colorOption.map((item, index) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() => handlePress(item.id, item.name, item.value,  item.image)}
          className=""
        >
          <View
            className={`w-[100px] h-[150px] border ${
              activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === item.value ? " border-black" : "border-gray-300"
            } rounded-[5px] overflow-hidden mr-3`}
          >
            <Image
              className="w-[100px] h-[150px] rounded-[5px]"
              src={item.image.url}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
