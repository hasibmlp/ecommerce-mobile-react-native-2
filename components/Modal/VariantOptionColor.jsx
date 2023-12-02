import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { getVariantForSingleOption } from "../utils/UtilsFunctions";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import Skeleton from "../Skeleton";

const IMAGE_WIDTH = 100
const SPACING = 12
const SCREEN_WIDTH = Dimensions.get('screen').width

export default function VariantOptionColor({ option, context }) {
  const {variants, setActiveOptions, activeOptions} = useContext(context)
  const scrollRef = useRef()

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



  const handlePress = (optionId, optionName,  optionValue, image) => {
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

  const handleOnScroll = () => {
    if(activeOptions) {
      const index = colorOption.findIndex(op => op.value === activeOptions.find(op => op.name === 'Color')?.value)
      scrollRef.current.scrollToOffset({
        offset: index * (IMAGE_WIDTH + SPACING),
        animated: true,
      })
    }
  }

  useEffect(() => {
    if(activeOptions) {
      const index = colorOption.findIndex(op => op.value === activeOptions.find(op => op.name === 'Color')?.value)
      scrollRef.current.scrollToOffset({
        offset: index * (IMAGE_WIDTH + SPACING),
        animated: true,
      })
    }
  },[activeOptions, variants])

  return (
    <FlatList
      data={colorOption}
      ref={scrollRef}
      key={(_, index) => index.toString()}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal: 12}}
      onLayout={handleOnScroll}
      renderItem={({item, index}) => (
        <TouchableOpacity
          key={index.toString()}
          onPress={() => handlePress(item.id, item.name, item.value,  item.image)}
          className=""
        >
          <View
            style={{marginRight: SPACING}}
            className={`h-[150px] border ${
              activeOptions.find(optionValue => optionValue?.name === option?.name)?.value === item.value ? " border-black" : "border-gray-300"
            } rounded-[5px] overflow-hidden`}
          >
            <Image
              style={{width: IMAGE_WIDTH}}
              className="h-[150px] rounded-[5px]"
              src={item.image.url}
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
}