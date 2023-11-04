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
import {
  GET_PRODUCT_IMAGES,
  GET_PRODUCT_OPTIONS,
  GET_PRODUCT_VARIANTS,
  GET_VARIANT_BY_ID,
} from "../graphql/queries";
import Skeleton from "./Skeleton";

export default function BottomModal({
  state,
  setState,
  productId,
  flatListRef,
  handleAddCartBtn,
  selectedOption,
  setSelectedOption,
  selectedVariant,
  setSelectedVariant,
}) {
  const transRef = useRef(new Animated.Value(500)).current;

  const [selectedOptionObj, setSelectedOptionObj] = useState({});
  const [prodVariants, setProdVariants] = useState([]);
  const [colorOptionImages, setColorOptionImages] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);

  const {
    loading: prodOptionLoading,
    error: prodOptionError,
    data: prodOptionData,
  } = useQuery(GET_PRODUCT_OPTIONS, { variables: { productId }, fetchPolicy: 'network-only' });

  const {
    loading: prodVariantsLoading,
    error: prodVariantsError,
    data: prodVariantsData,
  } = useQuery(GET_PRODUCT_VARIANTS, { variables: { productId }, fetchPolicy: 'network-only' });

  const {
    loading: prodImagesLoading,
    error: prodImagesError,
    data: prodImagesData,
  } = useQuery(GET_PRODUCT_IMAGES, { variables: { productId }, fetchPolicy: 'network-only' });

  const [
    getVariantById,
    { loading: varLoading, error: varError, data: varData },
  ] = useLazyQuery(GET_VARIANT_BY_ID, {fetchPolicy: 'network-only'});

  function handleOptionSelectionProdVariant(option, value) {
    const filteredVariantsArray = prodVariants.filter(
      (variant) =>
        variant.selectedOptions[option] === value &&
        variant.quantityAvailable > 0
    );
    setFilteredVariants(() => filteredVariantsArray);
  }

  function handleSelectOption(name, value) {
    const currentSelected = [...selectedOption];

    const existingIndex = currentSelected.findIndex(
      (option) => option.name === name
    );
    if (existingIndex !== -1) {
      currentSelected.splice(existingIndex, 1);
    }

    currentSelected.push({ name, value });

    setSelectedOption(currentSelected);
  }

  function handleSelectedVariantImage(newFilteredVariants) {
    const index = images?.findIndex(
      (image) => image.id === newFilteredVariants[0]?.imageId
    );

    if (flatListRef?.current) {
      if (index !== -1) {
        flatListRef.current.scrollToIndex({
          animated: false,
          index,
          viewOffset: 0,
          viewPosition: 0,
        });
      }
    }
  }

  function variantSelectionfunctionCombined(optionName, item, optionsCount) {
    if (optionsCount === 1) {
      handleOptionSelectionProdVariant(optionName, item);
    } else if (optionsCount > 1) {
      if (optionName === "Color") {
        handleOptionSelectionProdVariant(optionName, item);
      }
    }
    handleSelectOption(optionName, item);

    setFilteredVariants((prevItem) => {
      handleSelectedVariantImage(prevItem);
      return prevItem;
    });
  }

  const images = prodImagesData?.product?.images?.edges?.map((edge) => {
    return {
      url: edge?.node?.url,
      id: edge?.node?.id,
    };
  });

  useEffect(() => {
    Animated.timing(transRef, {
      toValue: state ? 0 : 500,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state]);

  useEffect(() => {
    const optionObject = {};

    selectedOption && selectedOption.map((option) => {
      optionObject[option.name] = option.value;
    });

    setSelectedOptionObj(optionObject);
  }, [selectedOption]);

  useEffect(() => {
    let getVariantId;
    if (
      prodOptionData?.product?.options.length === 1 &&
      filteredVariants.length > 0
    ) {
      getVariantId = filteredVariants[0]?.id;
    } else if (prodOptionData?.product?.options.length > 1) {
      getVariantId = filteredVariants?.filter(
        (variant) =>
          variant.selectedOptions["Size"] === selectedOptionObj["Size"]
      )[0]?.id;
    }

    setSelectedVariant(() => getVariantId);
  }, [filteredVariants, selectedOptionObj]);

  useEffect(() => {
    const prodVariantsArray = [];
    if (prodVariantsData)
      prodVariantsData.product.variants.edges.map((edge) => {
        const productVariantObj = {
          id: edge.node.id,
          quantityAvailable: edge.node.quantityAvailable,
          imageId: edge.node.image.id,
          imageUrl: edge.node.image.url,
          selectedOptions: {},
        };

        edge.node.selectedOptions.forEach((option) => {
          productVariantObj.selectedOptions[option.name] = option.value;
        });

        prodVariantsArray.push(productVariantObj);
      });
    setProdVariants(prodVariantsArray);
  }, [prodVariantsData]);

  useEffect(() => {
    let firstColorOption;
    if (prodOptionData)
      if (prodOptionData?.product?.options?.length === 1) {
        firstColorOption = prodOptionData?.product?.options[0].values[0];
      } else if (prodOptionData?.product?.options.length > 1) {
        firstColorOption = prodOptionData?.product?.options.find(
          (option) => option.name === "Color"
        )
          ? prodOptionData?.product?.options.find(
              (option) => option.name === "Color"
            ).values[0]
          : null;
      }
    if (prodVariants.length !== 0) {
      if (prodOptionData) {
        variantSelectionfunctionCombined(
          prodOptionData?.product?.options.length === 1
            ? prodOptionData?.product?.options[0].name
            : "Color",
          firstColorOption,
          prodOptionData?.product?.options.length
        );
      }
    }
  }, [prodVariants, prodOptionData]);

  useEffect(() => {
    const selectedSize = selectedOption.find(
      (option) => option.name === "Size"
    );

    if (selectedSize) {
      const sizeValueToCheck = selectedSize.value;

      if (filteredVariants) {
        const sizeExists = filteredVariants.some(
          (variant) => variant.selectedOptions.Size === sizeValueToCheck
        );

        if (!sizeExists || filteredVariants.length === 0) {
          const updateSelectedOption = selectedOption.filter(
            (option) => option.name !== "Size"
          );
          setSelectedOption(updateSelectedOption);
        }
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedVariant) {
      getVariantById({
        variables: {
          variantId: selectedVariant,
        },
      });
    }
  }, [selectedVariant]);

  useEffect(() => {
    const colorOptionImagesArray = [];
    if (prodVariants) {
      const seenColor = new Set();

      prodVariants.forEach((item) => {
        const color = item.selectedOptions.Color;

        if (!seenColor.has(color)) {
          seenColor.add(color);

          const colorOptionImagesObj = {};
          colorOptionImagesObj["imageId"] = item.imageId;
          colorOptionImagesObj["imageUrl"] = item.imageUrl;
          colorOptionImagesObj["color"] = color;
          colorOptionImagesArray.push(colorOptionImagesObj);
        }
      });
    }

    setColorOptionImages(() => colorOptionImagesArray);
  }, [prodVariants]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: transRef }],
      }}
      className="w-full absolute bottom-0 z-50 bg-white rounded-[15px]"
    >
      <View className="flex-1 items-center justify-center ">
        <View className=" py-10 self-stretch px-5 ">
          <View className="gap-y-5">
            <View className=" flex-row justify-between items-center">
              <Text className="text-[22px] font-normal text-black">
                Select Size
              </Text>
              <Pressable className=" py-1 px-2" onPress={() => setState(false)}>
                <Text className="text-[14px] font-medium text-black uppercase">
                  Done
                </Text>
              </Pressable>
            </View>

            {(prodOptionLoading && prodImagesLoading && prodVariantsLoading) && (
              <View>
                <View className="mb-5">
                  <Skeleton width={100} height={20} />
                </View>

                <View className="flex-row w-full mb-5">
                  <Skeleton
                    width={100}
                    height={150}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={100}
                    height={150}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={100}
                    height={150}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={100}
                    height={150}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                </View>

                <View className="w-full flex-row justify-between mb-5">
                  <Skeleton width={100} height={20} />
                  <Skeleton width={100} height={20} />
                </View>

                <View className="flex-row w-full">
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                  <Skeleton
                    width={60}
                    height={50}
                    style={{ marginRight: 12, borderRadius: 5 }}
                  />
                </View>
              </View>
            )}

            {prodOptionData &&
              prodOptionData?.product?.options.map((option, index) => (
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
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
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
                                prodOptionData?.product?.options.length
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
                                Object.entries(selectedOptionObj).length !==
                                  0 &&
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
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {colorOptionImages?.map((imageOption, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          onPress={() =>
                            variantSelectionfunctionCombined(
                              option.name,
                              imageOption.color,
                              prodOptionData?.product?.options.length
                            )
                          }
                        >
                          <View
                            className={`w-[100px] h-[150px] border  ${
                              selectedOptionObj[option.name] ===
                              imageOption.color
                                ? "border-2 border-gray-500"
                                : "border-gray-300"
                            } rounded-[5px] overflow-hidden mr-3`}
                          >
                            <Image
                              className="w-full h-full rounded-[5px]"
                              src={imageOption.imageUrl}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    // <View>
                    //   <Text>hello</Text>
                    //   <Text>hello</Text>
                    //   <Text>hello</Text>
                    //   <Text>hello</Text>
                    //   <Text>hello</Text>
                    // </View>
                  )}
                </View>
              ))}
          </View>

          {handleAddCartBtn && (
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

              {/* <TouchableOpacity className=" bg-white flex-row items-center justify-center mt-3">
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
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
