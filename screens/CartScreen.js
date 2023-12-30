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
import { GET_CART_DETAILS, GET_CART_DETAILS_V2 } from "../graphql/queries";
import {
  ADD_CHECKOUT_EMAIL,
  ADD_CHECKOUT_SHIPPING_ADDRESS,
  CREATE_CART_V2,
  CREATE_EMPTY_CART,
  REMOVE_CART_ITEM,
  REMOVE_CART_ITEM_V2,
  UPDATE_CART_ITEM,
} from "../graphql/mutations";
import LoadingScreen from "../components/LoadingScreen";
import Animated, { Layout } from "react-native-reanimated";
import GiftToggleContainer from "../components/GiftToggleContainer";
import CoupenToggleContainer from "../components/CoupenToggleContainer";

export default function CartScreen() {
  const navigation = useNavigation();

  const cartId = useReactiveVar(cartIdVar);
  console.log("", cartId)

  const [
    createEmptyCart,
    { loading: emptyCartLoading, error: emptyCartError, data: emptyCartData },
  ] = useMutation(CREATE_EMPTY_CART);

  const [
    createCartV2,
    { loading: emptyCartV2Loading, error: emptyCartV2Error, data: emptyCartV2Data },
  ] = useMutation(CREATE_CART_V2);

  const [
    updateLineItem,
    {
      loading: updateLineItemLoading,
      error: updateLineItemError,
      data: updateLineItemData,
    },
  ] = useMutation(UPDATE_CART_ITEM);

  const [
    getCartDetails,
    {
      loading: cartDetailsLoading,
      error: cartDetailsError,
      data: cartDetailsData,
      networkStatus,
      refetch,
    },
  ] = useLazyQuery(GET_CART_DETAILS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    getCartV2Details,
    {
      loading: cartDetailsV2Loading,
      error: cartDetailsV2Error,
      data: cartDetailsV2Data,
      networkStatus: networkStatusV2,
      refetch: refetchV2,
    },
  ] = useLazyQuery(GET_CART_DETAILS_V2, {
    notifyOnNetworkStatusChange: true,
  });


  console.log('NEWLY CREATED CART UPDATED: ', cartDetailsV2Data)
  console.log('NEWLY CREATED CART LOADING: ', cartDetailsV2Loading)
  console.log('NEWLY CREATED CART ERROR: ', cartDetailsV2Error?.message)

  const [
    removeCartItem,
    {
      loading: removeItemLoading,
      error: removeItemError,
      data: removeItemData,
    },
  ] = useMutation(REMOVE_CART_ITEM, {
    notifyOnNetworkStatusChange: true
  });

  const [
    removeCartV2Item,
    {
      loading: removeItemV2Loading,
      error: removeItemV2Error,
      data: removeItemV2Data,
    },
  ] = useMutation(REMOVE_CART_ITEM_V2, {
    notifyOnNetworkStatusChange: true
  });

  // console.log("CARD DETAILS",cartDetailsData.node.lineItems.edges)

  function handleFinalCheckout(buyerObj) {
    const isBuyerAddress =
      buyerObj !== null && Object.keys(buyerObj).length > 0 ? true : false;
    if (isBuyerAddress) {
      navigation.navigate("CheckoutReviewScreen");
    } else {
      navigation.navigate("ShippingAddressUpdateScreen");
    }
  }

  function handleItemRemove(id) {

    removeCartV2Item({
      variables: {
        cartId,
        lineIds: [
          id
        ]
      },
      onCompleted: () => {
        refetchV2()
      }
    })

    // removeCartItem({
    //   variables: {
    //     checkoutId: cartId,
    //     lineItemIds: [id],
    //   },
    //   onCompleted: () => {
    //     refetchV2()
    //   },
    //   // refetchQueries: [
    //   //   {
    //   //     query: GET_CART_DETAILS,
    //   //     variables: {
    //   //       checkoutId: cartId,
    //   //     },
    //   //   },
    //   // ],
    // });
  }

  const handleLineItemUpdate = (line) => {
    updateLineItem({
      variables: {
        cartId,
        lines: line || []
      },
      onCompleted: () => {
        refetchV2()
      }
    })
  }

  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (!cartId) {
      createCartV2({
        variables: {
          lines: []
        }
      });
    }
  }, [cartId]);

  useEffect(() => {
    if (emptyCartV2Data) {
      cartIdVar(emptyCartV2Data?.cartCreate?.cart?.id);
    }
  }, [emptyCartV2Data]);

  useEffect(() => {
    if (cartId) {

      getCartV2Details({
        variables: {
          cartId,
        },
        fetchPolicy: "network-only"
      })

      // getCartDetails({
      //   variables: {
      //     checkoutId: cartId,
      //   },
      //   fetchPolicy: "network-only",
      // });
    }
  }, [cartId]);

  if (emptyCartV2Loading) return <LoadingScreen />;
  if (cartDetailsV2Error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {cartDetailsV2Error.message}</Text>
      </View>
    );

    console.log("CARD ID: ",cartId)

  const cartProducts = cartDetailsV2Data?.cart?.lines?.edges || []

  console.log("aaaaaaaaaaaaaaa", cartDetailsV2Data?.cart?.shippingDiscountAllocations)
  // console.log("bbbbbbbbbbbbbbbb", cartProducts[0]?.node?.variant.product.vendor)
  console.log("bbbbbbbbbbbbbbbb", cartProducts[0]?.node?.discountAllocations[0])

  // const cartItemsId = [...cartItems].reverse();



  return (
    <View className="flex-1">
      {cartDetailsV2Loading && <LoadingScreen />}
      {removeItemLoading && <LoadingScreen />}
      {updateLineItemLoading && <LoadingScreen />}
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
      {cartDetailsV2Data?.cart?.lines?.edges.length === 0 && (
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
      {cartDetailsV2Data?.cart?.lines?.edges.length > 0 && (
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
          {cartProducts.map((item) => {
            return <CartCard
              key={item?.node?.id}
              lineItem={item?.node}
              handleLineItemUpdate={handleLineItemUpdate}
              onRemove={() => handleItemRemove(item?.node?.id)}
            />
          })}

          <GiftToggleContainer />
          <CoupenToggleContainer />

          <View className="px-3 bg-white py-3 mt-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-[16px] text-black font-normal">
                Subtotal
              </Text>
              <Text className="text-[16px] text-red-800 font-normal">
                {cartDetailsV2Data?.cart?.cost?.subtotalAmount?.amount}{" "}
                {cartDetailsV2Data?.cart?.cost?.subtotalAmount?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-[16px] text-black font-normal">
                Tax
              </Text>
              <Text className="text-[16px] text-black font-normal">
                {cartDetailsV2Data?.cart?.cost?.totalTaxAmount?.amount}{" "}
                {cartDetailsV2Data?.cart?.cost?.totalTaxAmount?.currencyCode}
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
                {cartDetailsV2Data?.cart?.cost?.totalAmount?.amount}{" "}
                {cartDetailsV2Data?.cart?.cost?.totalAmount?.currencyCode}
              </Text>
            </View>
            <TouchableOpacity
              // onPress={() =>
              //   handleFinalCheckout(cartDetailsData?.node?.shippingAddress)
              // }
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
