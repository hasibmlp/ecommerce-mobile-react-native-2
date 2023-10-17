import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import {
  HeartIcon,
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  TagIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";

import {
  GET_CART_DETAILS,
  GET_PRODUCT,
  GET_VARIANT_BY_ID,
} from "../graphql/queries";
import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import FollowButton from "../components/FollowButton";
import HeartButton from "../components/HeartButton";
import BottomModal from "../components/BottomModal";
import Overlay from "../components/Overlay";
import { cartIdVar } from "../App";
import { ADD_CART_ITEM, CREATE_CART } from "../graphql/mutations";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

export default function ProductDetailScreen({ route }) {
  const cartId = useReactiveVar(cartIdVar);

  const flatListRef = useRef();
  const [bottomModal, setBottomModal] = useState(false);
  const [addToCartbuttonDisabled, setaddToCartbuttonDisabled] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [prodVariants, setProdVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [colorOptionImages, setColorOptionImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState([
    {
      name: "Color",
      value: "Navy",
    },
  ]);
  const navigation = useNavigation();
  const { productId } = route.params;
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: {
      productId: productId,
    },
  });
  const [
    getVariantById,
    { loading: varLoading, error: varError, data: varData },
  ] = useLazyQuery(GET_VARIANT_BY_ID);

  const [
    createCart,
    { loading: cartLoading, error: cartError, data: cartData },
  ] = useMutation(CREATE_CART);

  const [
    addCartItem,
    {
      loading: addCartItemLoading,
      error: addCartItemError,
      data: addCartItemData,
    },
  ] = useMutation(ADD_CART_ITEM);

  function handleAddCartBtn() {
    if (selectedVariant) {
      console.log("HANDLE CART FUNCTION SUCCEFULLY RUNNING");

      if (cartId) {
        console.log("CART ID IS SET");
        addCartItem({
          variables: {
            checkoutId: cartId,
            variantId: selectedVariant,
          },
          refetchQueries: [
            {
              query: GET_CART_DETAILS,
              variables: {
                checkoutId: cartId,
              },
            },
          ],
          onCompleted: () => {
            setBottomModal(false);
            navigation.navigate("CartScreen");
          },
        });
      } else {
        console.log("NO CART ID IS SET");
        createCart({
          variables: {
            productQuantity: 1,
            productId: selectedVariant,
          },
          onCompleted: () => {
            setBottomModal(false);
            navigation.navigate("CartScreen");
          },
        });
      }

      setaddToCartbuttonDisabled(false);
      // setTimeout(() => {
      //   navigation.navigate("CartScreen");
      // }, 600);
    } else {
      setBottomModal(true);
    }
  }

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
    const index = images.findIndex(
      (image) => image.id === newFilteredVariants[0]?.imageId
    );

    if (index !== -1) {
      flatListRef.current.scrollToIndex({
        animated: false,
        index,
        viewOffset: 0,
        viewPosition: 0,
      });
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // useEffect(() => {
  //   const currentArray = cartIdVar();
  //   if (currentArray.includes(productId)) setaddToCartbuttonDisabled(true);
  // }, []);

  useEffect(() => {
    const prodVariantsArray = [];
    if (data)
      data.product.variants.edges.map((edge) => {
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

    // const prodVariantImagesArray = []
    // if(data) {
    //   data.product.variants.edges.map((edge) => {
    //     const prodVariantImagesObj = {
    //       id: edge.node.image.id
    //     }

    //     prodVariantImagesArray.push(prodVariantImagesObj)
    //   })
    //   console.log("VARIANT IMAGES",prodVariantImagesArray)
    // }
  }, [data]);

  useEffect(() => {
    let firstColorOption;
    if (data)
      if (data.product.options.length === 1) {
        firstColorOption = data.product.options[0].values[0];
      } else if (data.product.options.length > 1) {
        firstColorOption = data.product.options.find(
          (option) => option.name === "Color"
        )
          ? data.product.options.find((option) => option.name === "Color")
              .values[0]
          : null;
      }
    if (prodVariants.length !== 0) {
      if (data.product.options.length === 1) {
      }
      variantSelectionfunctionCombined(
        data.product.options.length === 1
          ? data.product.options[0].name
          : "Color",
        firstColorOption,
        data.product.options.length
      );
    }
  }, [prodVariants, data]);

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

  useEffect(() => {
    if (cartData) {
      console.log("CART DATA RETURNED ");
      cartIdVar(cartData?.checkoutCreate?.checkout?.id);
    }
  }, [cartData]);

  const images = data?.product?.images?.edges?.map((edge) => {
    return {
      url: edge?.node?.url,
      id: edge?.node?.id,
    };
  });

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading..</Text>
      </View>
    );
  if (error || varError) return <Text>Error occured {error || varError}</Text>;

  console.log("CART DATA", cartData?.cartCreate?.cart?.id);
  console.log("CART DATA IF CARD ID PRESENT", addCartItemData);

  return (
    <View>
      <SafeAreaView className="bg-white" />
      <View className="items-center justify-center bg-white h-[50px] relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-[40px] w-[40px] items-center justify-center absolute left-4 "
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-[20px] font-medium text-black">
          {data.product.vendor}
        </Text>
      </View>
      <SafeAreaView />

      <ScrollView bounces={false}>
        {/* floating back button */}
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-[40px] w-[40px] items-center justify-center rounded-full bg-white absolute z-[1] left-[20px] top-[50px]"
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity> */}

        <View style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}>
          <FlatList
            key={(_, index) => index.toString()}
            ref={flatListRef}
            horizontal
            data={images}
            keyExtractor={(_, index) => index.toString()}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <View>
                  <Image
                    style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
                    src={item.url}
                  />
                </View>
              );
            }}
            getItemLayout={(_, index) => {
              return {
                length: ITEM_WIDTH,
                offset: ITEM_WIDTH * index,
                index,
              };
            }}
          />
        </View>

        <View className="pb-[100px]">
          <View className="items-center gap-[8px] py-[10px] bg-white px-2">
            <HeartButton />
            <View className="py-[5px] w-full max-w-[100px] bg-[#ddd] rounded-[2px] items-center">
              <Text className="text-[11px] text-black uppercase">
                {data.product.vendor}
              </Text>
            </View>
            <Text className="text-[19px] font-medium text-black text-center">
              {data.product.title}
            </Text>

            <Text className="text-[20px] font-normal text-red-800">
              {varData?.node?.price?.amount
                ? varData?.node?.price?.amount
                : data.product.priceRange.minVariantPrice.amount}{" "}
              AED
            </Text>
            <Text className="text-[14px] text-gray-500 font-normal">
              Including VAT
            </Text>

            <View className=" items-center justify-center border rounded-[5px] border-gray-300 self-stretch">
              <View className="bg-gray-100 self-stretch py-1 items-center border-b border-gray-300">
                <Text className="text-[14px] font-normal text-black ">
                  Want to pay in instalments?
                </Text>
              </View>
              <View className="flex-row items-center justify-center py-2">
                <Text className="text-[16px] font-bold text-black mr-1">
                  tabby
                </Text>
                <InformationCircleIcon size={14} color="black" />
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-center bg-white py-5">
            <Text className="text-[14px] font-normal text-black">
              Earn 905 Smile Points.
            </Text>
            <Text className="text-[14px] text-red-800 font-normal underline ml-2">
              Learn Now
            </Text>
          </View>

          <Pressable
            onPress={() => setBottomModal(!bottomModal)}
            className="border-t border-gray-300 py-2 bg-white px-14"
          >
            <View className="flex-row justify-between items-center">
              {data.product.options.map((option, index) => (
                <>
                  <View
                    key={index.toString()}
                    className="items-center justify-center"
                  >
                    <Text className="text-[11px] text-black font-medium uppercase text-center ">
                      {option.name}
                    </Text>
                    <View className="flex-row items-center justify-center gap-x-1 mt-3">
                      <Text className="text-[15px] text-black font-light uppercase">
                        {selectedOption.find((op) => op.name === option.name)
                          ? selectedOption
                              .find((op) => op.name === option.name)
                              .value.slice(0, 12) +
                            (selectedOption.find(
                              (op) => op.name === option.name
                            ).value.length > 12
                              ? "..."
                              : "")
                          : "Select"}
                      </Text>
                      <ChevronDownIcon size={14} color="black" />
                    </View>
                  </View>
                </>
              ))}

              <View className="vertical-divider absolute left-[50%]  h-7 w-[1px] bg-gray-300"></View>
            </View>
          </Pressable>

          <TouchableOpacity className=" border-y py-4 border-gray-300 bg-white">
            <View className="flex-row gap-x-2 justify-center items-center">
              <TruckIcon size={26} strokeWidth={1} color="black" />
              <Text className="text-[14px] font-normal text-black uppercase">
                shipping from uae
              </Text>
            </View>
            <View className="flex-row justify-center items-center gap-x-2 mt-3">
              <Text className="text-[14px] font-normal text-black">
                Next day delevery to
              </Text>
              <Text className="text-[14px] font-normal text-red-800 underline">
                Abudhabi
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex py-4 px-4 bg-white">
            <View className="flex-row gap-x-1 items-center justify-center mb-5">
              <ClockIcon size={20} color="red" />
              <Text className="text-[13px] text-red-500 font-normal">
                Low in stock: only 1 left
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddCartBtn}
              disabled={addToCartbuttonDisabled ? true : false}
              className={`flex items-center justify-center py-4 w-full ${
                addToCartbuttonDisabled ? "bg-gray-300" : "bg-blue-400"
              }  rounded-[5px]`}
            >
              <Text className="text-[14px] text-white font-semibold uppercase">
                {addToCartbuttonDisabled ? "Added to bag" : "Add to bag"}
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <ShowAndHide title="Editor's advice" />
            <ShowAndHide title="Size & Fit" />
            <ShowAndHide title="Delivery % Free Returns" />
          </View>

          <Pressable className="flex-row gap-x-1 items-center justify-between bg-white p-4 mt-4">
            <View className="flex-row gap-x-1 items-center">
              <QuestionMarkCircleIcon size={22} color="black" strokeWidth={1} />
              <View className="flex-row gap-x-1">
                <Text className="text-[13px] text-black font-medium ">
                  Need help?
                </Text>
                <Text className="text-[13px] text-black font-light ">
                  Call, Whatsapp , or email us
                </Text>
              </View>
            </View>
            <ChevronDownIcon size={24} color="black" strokeWidth={1} />
          </Pressable>

          <View className="p-4 bg-white my-4">
            <View className="flex-row justify-between">
              <Text className="text-[16px] text-black font-normal ">
                Emporio Armani
              </Text>
              <FollowButton />
            </View>
            <Text className="text-[13px] text-gray-800 font-normal mt-3">
              Follow this brand to get exciting updateds on new collections,
              offers and more.
            </Text>
          </View>

          <CardSlider id={"gid://shopify/Collection/139270488173"} />
          <CardSlider id={"gid://shopify/Collection/139270488173"} />
        </View>
      </ScrollView>

      <BottomModal
        state={bottomModal}
        setState={setBottomModal}
        options={data.product.options}
        productId={productId}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        handleAddCartBtn={handleAddCartBtn}
        handleOptionSelectionProdVariant={handleOptionSelectionProdVariant}
        prodVariants={prodVariants}
        filteredVariants={filteredVariants}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        handleSelectOption={handleSelectOption}
        variantSelectionfunctionCombined={variantSelectionfunctionCombined}
        colorOptionImages={colorOptionImages}
      />
      <Overlay state={bottomModal} setState={setBottomModal} />

      {/* {bottomAction && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1, 0, topEdge -1  , topEdge, topEdge + 1 ],
                  outputRange: [0, 0, 0, 0, -1],
                }),
              },
            ],
          }}
          className="items-center justify-center gap-[15px] bg-white h-[140px] px-[15px] absolute bottom-0 left-0 right-0"
        >
          <View className="flex-row gap-[5px]">
            <ClockIcon size={16} color="red" />
            <Text className="text-[14px] font-normal text-red-500">
              Low in stock: only 1 left
            </Text>
          </View>
          <TouchableOpacity className="self-stretch bg-red-800 h-[50px] justify-center items-center rounded-full">
            <Text className="text-[16px] text-white font-medium uppercase">
              Add to bag
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )} */}
    </View>
  );
}
