import { useLazyQuery, useQuery } from "@apollo/client";
import { removeConnectionDirectiveFromDocument } from "@apollo/client/utilities";
import { current } from "@reduxjs/toolkit";
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
import { GET_PRODUCT_VARIANT } from "../graphql/queries";

export default function BottomModal({
  state,
  setState,
  options,
  productId,
  setSelectedVariant,
  handleAddCartBtn,
  handleOptionSelectionProdVariant,
  filteredVariants,
  selectedOption,
  variantSelectionfunctionCombined,
  handleSelectOption
}) {
  const transRef = useRef(new Animated.Value(100)).current;

  const [selectedOptionObj, setSelectedOptionObj] = useState({});

  const [getVariant, { loading: variantLoading, error: variantError, data: variantData }] = useLazyQuery(
    GET_PRODUCT_VARIANT,
    {
      variables: {
        productId,
        selectedOptions: selectedOption,
      },
    }
  );


  useEffect(() => {
    Animated.timing(transRef, {
      toValue: state ? -100 : 600,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state]);

  useEffect(() => {
    console.log("SELECRED OPTIONS IN BOTTOM MODAL",selectedOption)
    if (selectedOption.length === 2) {
      getVariant({
        variables: {
          productId,
          selectedOptions: selectedOption,
        },
      });
      if (variantData) setSelectedVariant(variantData?.product?.variantBySelectedOptions?.id);
    }

    const optionObject = {};

    selectedOption.map((option) => {
      optionObject[option.name] = option.value;
    });

    setSelectedOptionObj(optionObject);
  }, [selectedOption, variantData]);

  // if (variantLoading) return <Text>Loading Variant Selecting..</Text>;
  // if (variantError) return <Text>Error!! {error}</Text>;

  return (
    <Animated.View
      style={{
        borderTopStartRadius: 180,
        borderTopEndRadius: 180,
        transform: [{ scaleX: 2.4 }, { translateY: transRef }],
      }}
      className="absolute bottom-0 left-0 right-0 z-30 bg-white"
    >
      <View className="flex-1 items-center justify-center scale-x-[.42]">
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

            {options.map((option) => (
              <View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-[12px] font-normal text-black uppercase mb-3">
                    {option.name}
                  </Text>
                  {option.name === "Size" && (
                    <Pressable>
                      <Text className="text-[12px] font-medium text-red-700 uppercase underline">
                        size guide
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* {
                  {
                    "Color": "Green Apple",
                    "Size": "XL"
                  }
                } */}

                {option.name === "Size" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row items-center gap-x-3 relative">
                      {option.values.map((item) => (
                        <TouchableOpacity
                          disabled={
                            Object.entries(selectedOptionObj).length !== 0 &&
                            (filteredVariants.some(
                              (variantOption) =>
                                variantOption.selectedOptions.Size === item
                            )
                              ? false
                              : true)
                          }
                          onPress={() => handleSelectOption(option.name, item)}
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
                    {/* {item.values.map((item) => (
                      <View className="h-[130px] w-[80px] bg-gray-300 mr-3">
                        <Image />
                      </View>
                    ))} */}

                    <View className="flex-row items-center gap-x-3 relative">
                      {option.values.map((item) => (
                        <TouchableOpacity
                          onPress={() => variantSelectionfunctionCombined(option.name, item)}
                          className={`border-[.5px] border-gray-500 rounded-[5px] ${
                            selectedOptionObj[option.name] === item
                              ? "bg-[#252525]"
                              : ""
                          } py-3 px-3`}
                        >
                          <Text
                            className={`${
                              selectedOptionObj[option.name] === item
                                ? "text-white"
                                : "text-black"
                            } text-[14px] font-light uppercase`}
                          >
                            {item}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}

                
              </View>
            ))}
          </View>

          <View className="mt-10">
            <TouchableOpacity
              disabled={variantLoading ? true : false}
              onPress={handleAddCartBtn}
              className={` flex items-center justify-center py-4 w-full ${variantLoading ? 'bg-red-200' : 'bg-red-400'}  rounded-[5px] `}
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
