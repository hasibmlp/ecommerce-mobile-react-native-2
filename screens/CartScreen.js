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
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";
import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";

import { GET_CART_DETAILS_V2, GET_CUSTOMER } from "../graphql/queries";
import {
  ADD_CART_ITEM_V2,
  CART_BUYER_IDENTITY_UPDATE,
  CHECKOUT_DISCOUNT_CODE_APPLY,
  CREATE_CHECKOUT,
  REMOVE_CART_ITEM_V2,
  REPLACE_CHECKOUT_LINES,
  UPDATE_CART_ITEM,
} from "../graphql/mutations";

import {
  cartIdVar,
  cartVar,
  checkoutIdVar,
  checkoutVisitedVar,
  isLoggedinFrstTimeVar,
  userVar,
} from "../makeVars/MakeVars";
import CartCard from "../components/CartCard";
import GiftToggleContainer from "../components/GiftToggleContainer";
import CoupenToggleContainer from "../components/CoupenToggleContainer";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";
import { FONT_FAMILY } from "../theme";
import Button from "../components/buttons/Button";
import ScreenHeaderV3 from "../components/actions/ScreenHeaderV3";
import SupportModal from "../components/Modal/SupportModal";

export default function CartScreen() {
  const navigation = useNavigation();
  const user = useReactiveVar(userVar);
  const cart = useReactiveVar(cartVar);
  const checkoutVisited = useReactiveVar(checkoutVisitedVar);
  const isLoggedinId = useReactiveVar(isLoggedinFrstTimeVar);

  const [isModalVisible, setModalVisible] = useState(false);

  const shopifyCheckout = useShopifyCheckoutSheet();

  console.log("CARTVAR FROM CART SCREEN", cart);

  const {
    loading: cartDetailsLoading,
    error: cartDetailsError,
    data: cartDetailsData,
    refetch,
  } = useQuery(GET_CART_DETAILS_V2, {
    variables: {
      cartId: cart?.id,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const [
    updateCartBuyerIdentity,
    {
      loading: updateCartBuyerIdentityLoading,
      error: updateCartBuyerIdentityError,
      data: updateCartBuyerIdentityData,
    },
  ] = useMutation(CART_BUYER_IDENTITY_UPDATE);

  const [
    updateLineItem,
    {
      loading: updateLineItemLoading,
      error: updateLineItemError,
      data: updateLineItemData,
    },
  ] = useMutation(UPDATE_CART_ITEM);

  const [
    removeCartItem,
    {
      loading: removeItemLoading,
      error: removeItemError,
      data: removeItemData,
    },
  ] = useMutation(REMOVE_CART_ITEM_V2, {
    notifyOnNetworkStatusChange: true,
  });

  const handleLineItemUpdate = async (line) => {
    const { data } = await updateLineItem({
      variables: {
        cartId: cart?.id,
        lines: line || [],
      },
    });
    if (data) {
      refetch();
      const modifiedUrl = data?.cartLinesUpdate?.cart?.checkoutUrl.replace(
        /\/cart\/c\//,
        "/checkouts/cn/"
      );
      const withoutParams = modifiedUrl.split("?")[0];

      shopifyCheckout.preload(
        checkoutVisited
          ? withoutParams
          : isLoggedinId
          ? data?.cartLinesUpdate?.cart?.checkoutUrl
          : withoutParams
      );
    }
  };

  async function handleItemRemove(ids) {
    const { data } = await removeCartItem({
      variables: {
        cartId: cart?.id,
        lineIds: ids,
      },
    });
    if (data) {
      refetch();
      const modifiedUrl = data?.cartLinesRemove?.cart?.checkoutUrl.replace(
        /\/cart\/c\//,
        "/checkouts/cn/"
      );
      const withoutParams = modifiedUrl.split("?")[0];

      shopifyCheckout.preload(
        checkoutVisited
          ? withoutParams
          : isLoggedinId
          ? data?.cartLinesRemove?.cart?.checkoutUrl
          : withoutParams
      );
    }
  }

  const handleCheckoutV2 = async () => {
    // shopifyCheckout.present(await cart.checkoutUrl);
    // Check if there is a user token exist
    const userToken = await AsyncStorage.getItem("my-key");

    if (!userToken) {
      shopifyCheckout.present(await cart.checkoutUrl);
    } else {
      await updateCartBuyerIdentity({
        variables: {
          buyerIdentity: {
            // customerAccessToken: "22fd41b8bf1c2179c0063f33bc45f465",
            customerAccessToken: userToken,
            email: user?.email,
          },
          cartId: cart?.id,
        },
        onCompleted: (data) => {
          const newCart = { ...cart };
          newCart.buyerIdentity =
            data?.cartBuyerIdentityUpdate?.cart?.buyerIdentity;

          // Replace "/cart/c/" with "/checkouts/cn/"
          const modifiedUrl =
            data?.cartBuyerIdentityUpdate?.cart?.checkoutUrl.replace(
              /\/cart\/c\//,
              "/checkouts/cn/"
            );
          const withoutParams = modifiedUrl.split("?")[0];

          cartVar(newCart);

          // navigation.navigate("CheckoutScreen", {
          //   url: checkoutVisited
          //     ? withoutParams
          //     : isLoggedinId
          //     ? cart?.checkoutUrl
          //     : withoutParams,
          // });
          shopifyCheckout.present(
            checkoutVisited
              ? withoutParams
              : isLoggedinId
              ? cart?.checkoutUrl
              : withoutParams
          );
        },
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // useEffect(() => {
  //   if (cartDetailsData) {
  //     const modifiedUrl = cartDetailsData?.cart?.checkoutUrl.replace(
  //       /\/cart\/c\//,
  //       "/checkouts/cn/"
  //     );
  //     const withoutParams = modifiedUrl.split("?")[0];

  //     shopifyCheckout.preload(
  //       checkoutVisited
  //         ? withoutParams
  //         : isLoggedinId
  //         ? cartDetailsData?.cart?.checkoutUrl
  //         : withoutParams
  //     );
  //   }
  // }, [cartDetailsData]);

  // useEffect(() => {
  //   const getAcessToken = async () => {
  //     const token = await AsyncStorage.getItem("my-key");
  //     if (token !== null) {
  //       setUserToken(token);
  //     } else {
  //       setUserToken(null);
  //     }
  //   };
  //   getAcessToken();
  // });

  // useEffect(() => {
  //    console.log("CART OBJECT CHANGE TRIGGERED!!")
  //   if (cart?.id) {
  //     getCartDetails({
  //       variables: {
  //         cartId: cart?.id,
  //       },
  //     });
  //   }
  // }, [cart?.id, user]);

  // useEffect(() => {
  //   refetch()
  // }, [cart])

  // useEffect(() => {
  //   if (cartDetailsData) {
  //     shopifyCheckout.preload(cartDetailsData?.cart?.checkoutUrl);
  //   }
  // }, [cartDetailsData]);

  const lineItems = cartDetailsData?.cart?.lines?.edges || [];
  const cartProducts = lineItems.filter((i) => !i.node?.attribute);
  const customProducts = lineItems.filter((i) => i.node?.attribute);

  return (
    <View className="flex-1">
      {cartDetailsLoading && <LoadingFullScreen />}
      {removeItemLoading && <LoadingFullScreen />}
      {updateLineItemLoading && <LoadingFullScreen />}
      {updateCartBuyerIdentityLoading && <LoadingFullScreen />}
      <SafeAreaView className="bg-white">
        {/* <View className="w-full relative flex-row justify-center items-center h-[35px]">
          <Text className="text-[16px] text-black font-normal">
            Your Bag (4)
          </Text>
          <View className="flex-row gap-4 absolute top-1 right-3">
            <QuestionMarkCircleIcon size={24} color="black" strokeWidth={1} />
          </View>
        </View> */}
        <ScreenHeaderV3
          left={null}
          label="Bag"
          right={
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <InformationCircleIcon size={28} color="black" />
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
      {cartProducts.length === 0 && (
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
      {cartProducts.length > 0 && (
        <Animated.ScrollView>
          {user === null && (
            <Pressable
              onPress={() => navigation.navigate("AuthScreen")}
              className="flex flex-row justify-between bg-white py-4 my-3"
            >
              <View className="flex flex-row gap-2 items-center">
                <UserIcon size={24} color="black" />
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-[14px] text-black font-normal"
                >
                  Log in or create an account for faster checkout
                </Text>
              </View>
              <ChevronRightIcon size={24} color="black" />
            </Pressable>
          )}
          {cartProducts.map((item) => {
            const assignedCustomProductId = item?.node?.attributes?.find(
              (att) => att.key === "custom-selection-uid"
            )?.value;
            const assignedCustomProduct = customProducts.find(
              (i) => i.node.attribute.value === assignedCustomProductId
            );
            return (
              <CartCard
                key={item?.node?.id}
                lineItem={item?.node}
                assignedCustomProduct={assignedCustomProduct}
                handleLineItemUpdate={handleLineItemUpdate}
                onRemove={() =>
                  handleItemRemove(
                    assignedCustomProduct
                      ? [item?.node?.id, assignedCustomProduct?.node?.id]
                      : [item?.node?.id]
                  )
                }
                onRemoveCustomProduct={() =>
                  handleItemRemove([assignedCustomProduct?.node?.id])
                }
              />
            );
          })}

          <GiftToggleContainer />
          <CoupenToggleContainer
            discountCodes={cartDetailsData?.cart?.discountCodes}
          />

          <View className="px-3 bg-white py-3 mt-3">
            <View className="flex-row justify-between items-center py-2">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-[16px] text-black font-normal"
              >
                Subtotal
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-[16px] text-red-800 font-normal"
              >
                {cartDetailsData?.cart?.cost?.subtotalAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.subtotalAmount?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text
                style={FONT_FAMILY.secondary}
                className="text-[16px] text-black font-normal"
              >
                Tax
              </Text>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-[16px] text-black font-normal"
              >
                {cartDetailsData?.cart?.cost?.totalTaxAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.totalTaxAmount?.currencyCode}
              </Text>
            </View>
            <View className="flex-row justify-between items-center py-2 mb-3">
              <View className="flex-row items-end">
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-[20px] text-black font-normal"
                >
                  Grand Total
                </Text>
                <Text
                  style={FONT_FAMILY.secondary}
                  className="text-[13px] text-black font-light ml-2"
                >
                  VAT Inclusive
                </Text>
              </View>
              <Text
                style={FONT_FAMILY.secondary}
                className="text-[20px] text-black font-medium"
              >
                {cartDetailsData?.cart?.cost?.totalAmount?.amount}{" "}
                {cartDetailsData?.cart?.cost?.totalAmount?.currencyCode}
              </Text>
            </View>

            <Button label="secure checkout" onPress={handleCheckoutV2} />
          </View>
        </Animated.ScrollView>
      )}
      <SupportModal
        isModalVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
