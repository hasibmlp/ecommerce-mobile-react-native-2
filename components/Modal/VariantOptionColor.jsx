import { useContext } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { getVariantForSingleOption } from "../utils/UtilsFunctions";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import Skeleton from "../Skeleton";

export default function VariantOptionColor({ option, context }) {
  const {variants, activeColor, setActiveColor} = useContext(context)

  const images = option.values.map((value) => {
    const variant = getVariantForSingleOption(variants, 'Color', value)
    return {
      id: variant.image.id,
      url: variant.image.url,
      colorValue: value,
    };
  });

  handlePress = (imageId, colorValue) => {
    setActiveColor({id: imageId, value: colorValue})
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="h-[150px] px-5"
    >
      {images.map((item, index) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() => handlePress(item.id, item.colorValue)}
          className=""
        >
          <View
            className={`w-[100px] h-[150px] border ${
              activeColor?.value === item.colorValue ? " border-black" : "border-gray-300"
            } rounded-[5px] overflow-hidden mr-3`}
          >
            <Image
              className="w-[100px] h-[150px] rounded-[5px]"
              src={item.url}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
