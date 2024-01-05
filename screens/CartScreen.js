import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  HeartIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from "react-native-reanimated";

import { 
  GET_CART_DETAILS_V2, 
  GET_CUSTOMER,
} from "../graphql/queries";
import {
  CHECKOUT_DISCOUNT_CODE_APPLY,
  CREATE_CART_V2,
  CREATE_CHECKOUT,
  REMOVE_CART_ITEM_V2,
  REPLACE_CHECKOUT_LINES,
  UPDATE_CART_ITEM,
} from "../graphql/mutations";
import { cartIdVar, checkoutIdVar, userVar } from "../App";
import CartCard from "../components/CartCard";
import GiftToggleContainer from "../components/GiftToggleContainer";
import CoupenToggleContainer from "../components/CoupenToggleContainer";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";

export default function CartScreen() {

  const navigation = useNavigation();
  const cartId = useReactiveVar(cartIdVar);
  const checkoutId = useReactiveVar(checkoutIdVar)
  const user2 = useReactiveVar(userVar)

  const [ user, setUser ] = useState(null)
  const [ userToken, setUserToken ] = useState(null)

  const { 
    data: customerData,
    loading: customerLoading,
    error: customerError
   } = useQuery(GET_CUSTOMER, {
    variables: {
      customerAccessToken: userToken,
    }
   })

   const [
    getCartDetails,
    {
      loading: cartDetailsLoading,
      error: cartDetailsError,
      data: cartDetailsData,
      refetch
    },
  ] = useLazyQuery(GET_CART_DETAILS_V2, {
    notifyOnNetworkStatusChange: true,
  });

  console.log("CART DETAILS DATA BUYER: ",cartDetailsData?.cart?.buyerIdentity)

  const [
    createCart,
    { loading: cartCreateLoading, error: cartCreateError, data: cartCreateData },
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
    createCheckout,
    {
      loading: checkoutLoading,
      error: checkoutError,
      data: checkoutData,
    },
  ] = useMutation(CREATE_CHECKOUT);

  const [
    replaceCheckoutLines,
    {
      loading: replaCecheckoutLinesLoading,
      error: replaceCheckoutLinesError,
      data: replaceCheckoutLinesData,
    },
  ] = useMutation(REPLACE_CHECKOUT_LINES);

  const [
    removeCartItem,
    {
      loading: removeItemLoading,
      error: removeItemError,
      data: removeItemData,
    },
  ] = useMutation(REMOVE_CART_ITEM_V2, {
    notifyOnNetworkStatusChange: true
  });

  const [
    checkoutDiscountCodeApply,
    {
      loading: checkoutDiscountCodeLoading,
      error: checkoutDiscountCodeError,
      data: checkoutDiscountCodeData,
    },
  ] = useMutation(CHECKOUT_DISCOUNT_CODE_APPLY);

  const handleLineItemUpdate = (line) => {
    updateLineItem({
      variables: {
        cartId,
        lines: line || []
      },
      onCompleted: () => {
        refetch()
      }
    })
  } 

  function handleItemRemove(id) {
    removeCartItem({
      variables: {
        cartId,
        lineIds: [
          id
        ]
      },
      onCompleted: () => {
        refetch()
      }
    })
  }

  const handleCheckoutV2 = () => {
    if(!checkoutId) {
      createCheckout({
        variables: {
          input: {
            lineItems: checkoutLineItems
          }
        },
      })
    }else {
      replaceCheckoutLines({
        variables: {
          checkoutId,
          lineItems: checkoutLineItems
        }
      })
    }

    if(cartDetailsData?.cart?.discountCodes[0]?.applicable){
      checkoutDiscountCodeApply({
        variables: {
          checkoutId,
          discountCode: cartDetailsData?.cart?.discountCodes[0]?.code
        }
      })
    }

    navigation.navigate("ShippingAddressUpdateScreen")
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const getAcessToken = async () => {
      const token = await AsyncStorage.getItem("my-key")
      if(token !== null) {
        setUserToken(token)
      }else{
        setUserToken(null)
      }
    } 
    getAcessToken()
  })

  useEffect(() => {
    if(customerData?.customer?.id) {
      setUser(customerData.customer)
    }
  },[customerData])

  useEffect(() => {
    if(checkoutData) {
      checkoutIdVar(checkoutData?.checkoutCreate?.checkout?.id)
    }
  }, [checkoutData])

  useEffect(() => {
    if (!cartId) {
      createCart({
        variables: {
          lines: []
        }
      });
    }
  }, [cartId]);

  useEffect(() => {
    if (cartCreateData) {
      cartIdVar(cartCreateData?.cartCreate?.cart?.id);
    }
  }, [cartCreateData]);

  useEffect(() => {
    if (cartId) {
      getCartDetails({
        variables: {
          cartId,
        },
        fetchPolicy: "network-only"
      })
    }
  }, [cartId]);

  const checkoutLineItems = cartDetailsData?.cart?.lines?.edges.map(item => {
    return {
      variantId: item?.node?.merchandise?.id,
      quantity: item?.node?.quantity
    }
  })

  const cartProducts = cartDetailsData?.cart?.lines?.edges || []


  if (cartCreateLoading) return <LoadingFullScreen />;
  if (cartDetailsError)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {cartDetailsError.message}</Text>
      </View>
    );
  return (
    <View className="flex-1">
      {cartDetailsLoading && <LoadingFullScreen />}
      {removeItemLoading && <LoadingFullScreen />}
      {updateLineItemLoading && <LoadingFullScreen />}
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
      {cartDetailsData?.cart?.lines?.edges.length === 0 && (
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
      {cartDetailsData?.cart?.lines?.edges.length > 0 && (
        <Animated.ScrollView>
          {user2 === null && (<Pressable onPress={() => navigation.navigate("AuthScreen")} className="flex flex-row justify-between bg-white py-4 my-3">
            <View className="flex flex-row gap-2 items-center">
              <UserIcon size={24} color="black" />
              <Text className="text-[14px] text-black font-medium">
                Log in or create an account for faster checkout
              </Text>
            </View>
            <ChevronRightIcon size={24} color="black" />
          </Pressable>)}
          {cartProducts.map((item) => {
            return <CartCard
              key={item?.node?.id}
              lineItem={item?.node}
              handleLineItemUpdate={handleLineItemUpdate}
              onRemove={() => handleItemRemove(item?.node?.id)}
            />
          })}

          <GiftToggleContainer />
          <CoupenToggleContainer discountCodes={cartDetailsData?.cart?.discountCodes}/>

          <View className="px-3 bg-white py-3 mt-3">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-[16px] text-black font-normal">
                Subtotal
              </Text>
              <Text className="text-[16px] text-red-800 font-normal">
                {cartDetailsData?.cart?.cost?.subtotalAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.subtotalAmount?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-[16px] text-black font-normal">
                Tax
              </Text>
              <Text className="text-[16px] text-black font-normal">
                {cartDetailsData?.cart?.cost?.totalTaxAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.totalTaxAmount?.currencyCode}
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
                {cartDetailsData?.cart?.cost?.totalAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.totalAmount?.currencyCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCheckoutV2}
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
