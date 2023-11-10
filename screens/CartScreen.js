import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  HeartIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import {
  makeVar,
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import CartCard from "../components/CartCard";
import { cartIdVar } from "../App";
import { GET_CART_DETAILS } from "../graphql/queries";
import {
  ADD_CHECKOUT_EMAIL,
  ADD_CHECKOUT_SHIPPING_ADDRESS,
  CREATE_EMPTY_CART,
} from "../graphql/mutations";
import LoadingScreen from "../components/LoadingScreen";
import ToggleContainer from "../components/CoupenToggleContainer";
import Animated, { Layout } from "react-native-reanimated";
import GiftToggleContainer from "../components/GiftToggleContainer";
import CoupenToggleContainer from "../components/CoupenToggleContainer";

export default function CartScreen() {
  const navigation = useNavigation();

  const cartId = useReactiveVar(cartIdVar);

  console.log("CART SCREEN ID", cartId);

  const [
    createEmptyCart,
    { loading: emptyCartLoading, error: emptyCartError, data: emptyCartData },
  ] = useMutation(CREATE_EMPTY_CART);

  const [
    getCartDetails,
    {
      loading: cartDetailsLoading,
      error: cartDetailsError,
      data: cartDetailsData,
    },
  ] = useLazyQuery(GET_CART_DETAILS);

  function handleFinalCheckout(buyerObj) {
    const isBuyerAddress =
      buyerObj !== null && Object.keys(buyerObj).length > 0 ? true : false;
    if (isBuyerAddress) {
      navigation.navigate("CheckoutReviewScreen");
    } else {
      navigation.navigate("ShippingAddressUpdateScreen");
    }
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (!cartId) {
      createEmptyCart();
    }
  }, [cartId]);

  useEffect(() => {
    if (emptyCartData) {
      cartIdVar(emptyCartData?.checkoutCreate?.checkout?.id);
    }
  }, [emptyCartData]);

  useEffect(() => {
    if (cartId) {
      getCartDetails({
        variables: {
          checkoutId: cartId,
        },
        fetchPolicy: "network-only",
      });
    }
  }, [cartId]);

  if (emptyCartLoading) return <LoadingScreen />;
  if (cartDetailsError)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {cartDetailsError.message}</Text>
      </View>
    );

  const cartItems = cartDetailsData?.node?.lineItems?.edges || [];
  const cartItemsId = [...cartItems].reverse();

  // console.log("cartDetailsData IN CART", cartDetailsData?.node?.lineItems?.edges);

  console.log(cartId);

  return (
    <View className="flex-1">
      {cartDetailsLoading && <LoadingScreen />}
      <SafeAreaView className="bg-white">
        <View className="w-full relative flex-row justify-center items-center h-[35px]">
          <Text className="text-[16px] text-black font-normal">
            Your Bag (4)
          </Text>
          <View className="flex-row gap-4 absolute top-1 right-3">
            <HeartIcon size={24} color="black" strokeWidth={1} />
            <QuestionMarkCircleIcon size={24} color="black" strokeWidth={1} />
          </View>
        </View>
      </SafeAreaView>
      {cartDetailsData?.node?.lineItems?.edges.length === 0 && (
        <View className="flex-1 items-center justify-center bg-white">
          <View className="w-[120px] h-[100px]">
            <Image
              className="w-full h-full"
              source={require("../assets/shopping-bag.png")}
            />
          </View>
          <Text className="text-[22px] text-gray-600 font-light max-w-[60%] text-center mt-5 ">
            Your Shopping Bag is currently empty!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeScreen")}
            className="bg-blue-400 p-3 rounded-[5px] mt-5"
          >
            <Text className="text-[14px] text-white font-medium uppercase">
              start shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {cartDetailsData?.node?.lineItems?.edges.length > 0 && (
        <Animated.ScrollView>
          <View className="flex flex-row justify-between bg-white py-4 my-3">
            <View className="flex flex-row gap-2 items-center">
              <UserIcon size={24} color="black" />
              <Text className="text-[14px] text-black font-medium">
                Log in or create an account for faster checkout
              </Text>
            </View>
            <ChevronRightIcon size={24} color="black" />
          </View>
          {cartItemsId.map((item) => (
            <CartCard
              key={item?.node?.variant?.id}
              id={item?.node?.variant?.id}
              lineId={item?.node?.id}
            />
          ))}

          <GiftToggleContainer />
          <CoupenToggleContainer />

          <View className="px-3 bg-white py-3 mt-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-[16px] text-black font-normal">
                Subtotal
              </Text>
              <Text className="text-[16px] text-red-800 font-normal">
                {cartDetailsData?.node?.lineItemsSubtotalPrice?.amount}{" "}
                {cartDetailsData?.node?.lineItemsSubtotalPrice?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <View className="flex-row items-end">
                <Text className="text-[20px] text-black font-normal">
                  Grand Total
                </Text>
                <Text className="text-[13px] text-black font-light ml-2">
                  VAT Inclusive
                </Text>
              </View>
              <Text className="text-[20px] text-black font-medium">
                {cartDetailsData?.node?.totalPrice?.amount}{" "}
                {cartDetailsData?.node?.totalPrice?.currencyCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleFinalCheckout(cartDetailsData?.node?.shippingAddress)
              }
              className="items-center justify-center bg-blue-400 py-4 rounded-[5px] mt-2"
            >
              <Text className="text-[15px] font-medium uppercase text-white">
                secure checkout
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}
