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
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon,
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
  GET_PRODUCT_IMAGES,
  GET_VARIANT_BY_ID,
} from "../graphql/queries";
import ShowAndHide from "../components/ShowAndHide";
import CardSlider from "../components/CardSlider";
import FollowButton from "../components/FollowButton";
import HeartButton from "../components/HeartButton";
import {
  bottomModaVar,
  cartIdVar,
  selctedProductForBottomModalVar,
} from "../App";
import { ADD_CART_ITEM, CREATE_CART } from "../graphql/mutations";
import Skeleton from "../components/Skeleton";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

export default function ProductDetailScreen({ route }) {
  const cartId = useReactiveVar(cartIdVar);

  const flatListRef = useRef();
  const [bottomModalOpen, setBottomModalOpen] = useState(false);
  const [addToCartbuttonDisabled, setaddToCartbuttonDisabled] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
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

  const {
    loading: prodImagesLoading,
    error: prodImagesError,
    data: prodImagesData,
  } = useQuery(GET_PRODUCT_IMAGES, { variables: { productId } });

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
            setBottomModalOpen(false);
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
            setBottomModalOpen(false);
            navigation.navigate("CartScreen");
          },
        });
      }

      setaddToCartbuttonDisabled(false);
      // setTimeout(() => {
      //   navigation.navigate("CartScreen");
      // }, 600);
    } else {
      setBottomModalOpen(true);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (cartData) {
      console.log("CART DATA RETURNED ");
      cartIdVar(cartData?.checkoutCreate?.checkout?.id);
    }
  }, [cartData]);

  const images = prodImagesData?.product?.images?.edges?.map((edge) => {
    return {
      url: edge?.node?.url,
      id: edge?.node?.id,
    };
  });

  if (error || varError) return <Text>Error occured {error || varError}</Text>;

  console.log("CART DATA", cartData?.cartCreate?.cart?.id);
  console.log("CART DATA IF CARD ID PRESENT", addCartItemData);

  return (
    <View className="flex-1">
      <SafeAreaView className="bg-white" />
      <View className="items-center justify-center bg-white h-[50px] relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-[40px] w-[40px] items-center justify-center absolute left-4 "
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity>
        {data && (
          <Text className="text-[20px] font-medium text-black">
            {data.product.vendor}
          </Text>
        )}

        {!data && <Skeleton width={150} height={20} />}
      </View>
      <SafeAreaView />

      <ScrollView bounces={false}>
        <View style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}>
          {images && (
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
          )}
          {!images && <Skeleton width={ITEM_WIDTH} height={ITEM_HEIGHT} />}
        </View>

        <View className="pb-[100px]">
          <View className="items-center gap-[8px] py-[10px] bg-white px-2">
            <HeartButton />

            {!data && (
              <View className="items-center">
                <Skeleton
                  width={100}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton width={350} height={20} style={{ marginBottom: 4 }} />
                <Skeleton
                  width={300}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton width={100} height={20} style={{ marginBottom: 6 }} />
                <Skeleton
                  width={350}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton
                  width={100}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
                <Skeleton
                  width={150}
                  height={20}
                  style={{ marginBottom: 12 }}
                />
              </View>
            )}

            {data && (
              <View className="items-center">
                <View className="py-[5px] w-full max-w-[100px] bg-[#ddd] rounded-[2px] items-center mb-3">
                  <Text className="text-[11px] text-black uppercase">
                    {data.product.vendor}
                  </Text>
                </View>
                <Text className="text-[19px] font-medium text-black text-center mb-3">
                  {data.product.title}
                </Text>

                <Text className="text-[20px] font-normal text-red-800 mb-[2px]">
                  {varData?.node?.price?.amount
                    ? varData?.node?.price?.amount
                    : data.product.priceRange.minVariantPrice.amount}{" "}
                  AED
                </Text>
                <Text className="text-[14px] text-gray-500 font-normal mb-3">
                  Including VAT
                </Text>

                <View className=" items-center justify-center border rounded-[5px] border-gray-300 self-stretch mb-3">
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

                <View className="flex-row items-center justify-center bg-white mb-1">
                  <Text className="text-[14px] font-normal text-black">
                    Earn 905 Smile Points.
                  </Text>
                  <Text className="text-[14px] text-red-800 font-normal underline ml-2">
                    Learn Now
                  </Text>
                </View>
              </View>
            )}
          </View>

          {data && (
            <Pressable
              onPress={() => {
                bottomModaVar(true);
                selctedProductForBottomModalVar(productId);
              }}
              className="border-t border-gray-300 py-2 bg-white px-14"
            >
              <View className="flex-row justify-between items-center">
                {data &&
                  data.product.options.map((option, index) => (
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
                            {selectedOption.find(
                              (op) => op.name === option.name
                            )
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
          )}

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

          {data && (
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
          )}

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

    </View>
  );
}
