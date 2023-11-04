
import { useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { TruckIcon } from "react-native-heroicons/outline";
import { GET_PRODUCT_OPTIONS } from "../graphql/queries";

export default function BottomModal({
  state,
  setState,
  selectedVariant,
  setSelectedVariant,
  handleAddCartBtn,
  filteredVariants,
  selectedOption,
  variantSelectionfunctionCombined,
  colorOptionImages,
}) {
  const transRef = useRef(new Animated.Value(500)).current;

  const [selectedOptionObj, setSelectedOptionObj] = useState({});

  const {loading: prodOptionLoading, error: prodOptionError, data: prodOptionData} = useQuery(GET_PRODUCT_OPTIONS, {variables: productId})

  prodOptionData

  useEffect(() => {
    Animated.timing(transRef, {
      toValue: state ? 0 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state]);

  useEffect(() => {
    const optionObject = {};

    selectedOption.map((option) => {
      optionObject[option.name] = option.value;
    });

    setSelectedOptionObj(optionObject);
  }, [selectedOption]);

  useEffect(() => {
    let getVariantId;
    if (prodOptionData.product.options.length === 1 && filteredVariants.length > 0) {
      getVariantId = filteredVariants[0]?.id;
    } else if (prodOptionData.product.options.length > 1) {
      getVariantId = filteredVariants?.filter(
        (variant) =>
          variant.selectedOptions["Size"] === selectedOptionObj["Size"]
      )[0]?.id;
    }

    setSelectedVariant(() => getVariantId);
  }, [filteredVariants, selectedOptionObj]);

  return (
    <Animated.View
      style={{
        transform: [ { translateY: transRef }],
      }}
      className="absolute bottom-0 z-30 bg-white rounded-[15px]"
    >
      <View className="flex-1 items-center justify-center ">
        <View className=" py-10 self-stretch px-5 ">
          <View className="gap-y-5">
            <View className="flex-row justify-between items-center">
              <Text className="text-[22px] font-normal text-black">
                Select Size
              </Text>
              <Pressable className=" py-1 px-2" onPress={() => setState(false)}>
                <Text className="text-[14px] font-medium text-black uppercase">
                  Done
                </Text>
              </Pressable>
            </View>

            {prodOptionData.product.options.map((option, index) => (
              <View key={index.toString()}>
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] font-normal text-black uppercase mb-3">
                    {option.name}: {selectedOptionObj[option.name]}
                  </Text>
                  {option.name === "Size" && (
                    <Pressable>
                      <Text className="text-[12px] font-medium text-red-700 uppercase underline">
                        size guide
                      </Text>
                    </Pressable>
                  )}
                </View>

                {option.name === "Size" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center gap-x-3 relative">
                      {option.values.map((item, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          disabled={
                            Object.entries(selectedOptionObj).length !== 0 &&
                            (filteredVariants.some(
                              (variantOption) =>
                                variantOption.selectedOptions.Size === item
                            )
                              ? false
                              : true)
                          }
                          onPress={() =>
                            variantSelectionfunctionCombined(
                              option.name,
                              item,
                              prodOptionData.product.options.length
                            )
                          }
                          className={`border-[.5px] ${
                            Object.entries(selectedOptionObj).length !== 0 &&
                            (filteredVariants.some(
                              (variantOption) =>
                                variantOption.selectedOptions.Size === item
                            )
                              ? "border-gray-500"
                              : "border-gray-300 bg-gray-50")
                          } rounded-[5px] ${
                            selectedOptionObj[option.name] === item
                              ? "bg-[#252525]"
                              : ""
                          } py-3 px-3`}
                        >
                          <Text
                            className={` ${
                              selectedOptionObj[option.name] === item
                                ? "text-white"
                                : "text-black"
                            } ${
                              Object.entries(selectedOptionObj).length !== 0 &&
                              (filteredVariants.some(
                                (variantOption) =>
                                  variantOption.selectedOptions.Size === item
                              )
                                ? ""
                                : "text-gray-400")
                            }  text-[14px] font-light uppercase`}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}

                {option.name === "Color" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                    {colorOptionImages.map((imageOption, index) => (
                      <TouchableOpacity
                      key={index.toString()}
                      onPress={() =>
                        variantSelectionfunctionCombined(
                          option.name,
                          imageOption.color,
                          prodOptionData.product.options.length
                        )
                      }
                      >
                        <View className={`w-[100px] h-[150px] border  ${
                            selectedOptionObj[option.name] === imageOption.color
                              ? "border-2 border-gray-500"
                              : "border-gray-300"
                          } rounded-[5px] overflow-hidden mr-3`}>
                          <Image
                            className="w-full h-full rounded-[5px]"
                            src={imageOption.imageUrl}
                          />
                        </View>
                      </TouchableOpacity>
                    ))}

                  </ScrollView>
                )}
              </View>
            ))}
          </View>

          <View className="mt-10">
            <TouchableOpacity
              disabled={selectedVariant ? false : true}
              onPress={handleAddCartBtn}
              className={` flex items-center justify-center py-4 w-full ${
                selectedVariant ? "bg-blue-400" : "bg-blue-200"
              }  rounded-[5px] `}
            >
              <Text className="text-[14px] text-white font-semibold uppercase">
                Add to bag
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className=" bg-white flex-row items-center justify-center mt-3">
              <View className="flex-row justify-center items-center">
                <TruckIcon size={20} strokeWidth={1} color="black" />
                <Text className="text-[12px] font-normal text-black uppercase ml-2">
                  shipping from uae
                </Text>
              </View>
              <View className="flex-row justify-center items-center">
                <Text className="text-[14px] font-normal text-black">
                  Next day delevery to
                </Text>
                <Text className="text-[12px] font-normal text-red-800 underline">
                  Abudhabi
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}