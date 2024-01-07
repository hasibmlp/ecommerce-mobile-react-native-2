import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  EnvelopeIcon,
  LockClosedIcon,
  PencilIcon,
} from "react-native-heroicons/outline";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";

import RadioButton from "./RadioButton";
import { cartIdVar, checkoutIdVar, userVar } from "../App";
import {
  GET_AVAILABLE_SHIPPING_RATES,
  GET_CHECKOUT_DETAILS,
} from "../graphql/queries";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SET_SHIPPING_METHOD } from "../graphql/mutations";
import LoadingScreen from "./LoadingScreen";

export default function CheckoutReview({ route }) {
  // const checkoutId = useReactiveVar(cartIdVar);
  const checkoutId = useReactiveVar(checkoutIdVar);
  const user = useReactiveVar(userVar);

  const navigation = useNavigation();

  const [shippingReady, setShippingReady] = useState(false);

  const {
    loading: detailLoading,
    error: detailError,
    data: detailData,
  } = useQuery(GET_CHECKOUT_DETAILS, {
    variables: {
      checkoutId,
    },
  });

  const {
    loading: shippingLineRatesLoading,
    error: shippingLineRatesError,
    data: shippingLineRatesData,
    startPolling,
    stopPolling,
  } = useQuery(GET_AVAILABLE_SHIPPING_RATES, {
    variables: {
      checkoutId,
    },
    fetchPolicy: "network-only",
  });

  const [
    setShippingMethod,
    {
      loading: shippingMethodLoading,
      error: shippingMethodError,
      data: shippingMethodData,
    },
  ] = useMutation(SET_SHIPPING_METHOD);

  function handleShippingMethod(shippingHandle) {
    setShippingMethod({
      variables: {
        checkoutId,
        shippingRateHandle: shippingHandle,
      },
      refetchQueries: [GET_AVAILABLE_SHIPPING_RATES],
    });
  }

  useEffect(() => {
    if (shippingLineRatesData) {
      if (shippingLineRatesData?.node?.availableShippingRates) {
        setShippingReady(
          shippingLineRatesData?.node?.availableShippingRates?.ready
        );
      }
    }
  }, [shippingLineRatesData]);

  useEffect(() => {
    if (!shippingReady) {
      startPolling(5000);
    } else {
      stopPolling();
    }
  }, [shippingLineRatesData, shippingReady]);

  if (detailLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading..</Text>
      </View>
    );
  if (detailError)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {detailError.message}</Text>
      </View>
    );

  return (
    <ScrollView>
      {shippingMethodLoading && <LoadingScreen />}
      <View className="bg-gray-100 py-5 px-4">
        <Text className="text-[14px] text-black font-normal uppercase">
          delevery address
        </Text>
      </View>
      <View className="px-4 py-3 bg-white flex-row justify-between">
        <View>
          <View className="flex-row">
            <Text className="text-[16px] text-black font-medium">Name:</Text>
            <Text className="text-[16px] text-black font-normal ml-2">
              {detailData?.node?.shippingAddress?.firstName +
                " " +
                detailData?.node?.shippingAddress?.lastName}
            </Text>
          </View>
          <View className="flex-row mt-2">
            <Text className="text-[16px] text-black font-medium">Email:</Text>
            <Text className="text-[16px] text-black font-normal ml-2">
              {detailData?.node?.email}
            </Text>
          </View>
          <View className="flex-row mt-2">
            <Text className="text-[16px] text-black font-medium">Phone:</Text>
            <Text className="text-[16px] text-black font-normal ml-2">
              {detailData?.node?.shippingAddress?.phone}
            </Text>
          </View>
          <View className="flex-row mt-2">
            <Text className="text-[16px] text-black font-medium">Address:</Text>
            <Text className="text-[16px] text-black font-normal ml-2 w-[250px]">
              {detailData?.node?.shippingAddress?.address1 +
                ", " +
                detailData?.node?.shippingAddress?.address2 +
                ", " +
                detailData?.node?.shippingAddress?.city +
                ", " +
                detailData?.node?.shippingAddress?.country +
                (detailData?.node?.shippingAddress?.zip
                  ? ", " + detailData?.node?.shippingAddress?.zip
                  : "")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.push("ShippingAddressUpdateScreen", {
              shippingFormVisible: true,
            });
          }}
          className=" self-start p-1"
        >
          <PencilIcon size={20} color="black" />
        </TouchableOpacity>
      </View>

      {!user && (
        <View>
          <View className="bg-gray-100 py-5 px-4">
            <Text className="text-[14px] text-black font-normal uppercase">
              create account (optional)
            </Text>
          </View>
          <View className="bg-white py-5 px-3">
            <Text>
              Save your details, delivery address and checkout quicker next
              time.
            </Text>
            <View className="flex-row items-center border-b border-gray-100 py-3">
              <EnvelopeIcon size={23} color="black" />
              <Text className="text-[13px] text-black font-medium ml-3">
                {detailData?.node?.email}
              </Text>
            </View>
            <View className="flex-row items-center pt-3">
              <LockClosedIcon size={23} color="black" />
              <View className="">
                <Text className="text-[13px] text-black font-medium ml-3">
                  Set password
                </Text>
                <TextInput
                  className="text-[13px] text-black font-medium ml-3 mt-1"
                  placeholder="Minimun 6 character"
                />
              </View>
            </View>
          </View>
        </View>
      )}

      <View className="bg-gray-100 py-5 px-4">
        <Text className="text-[14px] text-black font-normal uppercase">
          Shipment method
        </Text>
        {shippingLineRatesLoading && <ActivityIndicator size="small" />}
      </View>

      {shippingLineRatesData?.node?.availableShippingRates?.ready &&
        shippingLineRatesData?.node?.availableShippingRates?.shippingRates.map(
          (item, index) => (
            <Pressable
              onPress={() => {
                handleShippingMethod(item?.handle);
              }}
              key={index.toString()}
              className="px-4 py-3 bg-white flex-row justify-between items-center border-b border-gray-100"
            >
              <Text className="text-[14px] text-black font-normal w-[280px]">
                {item?.title}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-[14px] text-black font-normal mr-3">
                  {item?.price?.amount === "0.0"
                    ? "Free"
                    : item?.price?.amount + " " + item?.price?.currencyCode}
                </Text>
                <RadioButton
                  checked={
                    shippingLineRatesData?.node?.shippingLine &&
                    (shippingLineRatesData?.node?.shippingLine.handle ===
                    item?.handle
                      ? true
                      : false)
                  }
                />
              </View>
            </Pressable>
          )
        )}

      <View className="bg-gray-100 py-5 px-4">
        <Text className="text-[14px] text-black font-normal uppercase">
          payment summary
        </Text>
      </View>
      <View className="px-3 bg-white py-3">
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-[16px] text-black font-normal">Subtotal</Text>
          <Text className="text-[16px] text-red-800 font-light">
            {detailData?.node?.subtotalPrice?.amount}{" "}
            {detailData?.node?.subtotalPrice?.currencyCode}
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-[16px] text-black font-normal">Delivery</Text>
          <Text className="text-[16px] text-red-800 font-light">
            {shippingLineRatesData?.node?.shippingLine
              ? shippingLineRatesData?.node?.shippingLine?.price?.amount ===
                "0.0"
                ? "Free"
                : shippingLineRatesData?.node?.shippingLine?.price?.amount +
                  " " +
                  shippingLineRatesData?.node?.shippingLine?.price?.currencyCode
              : "--"}{" "}
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
            {detailData?.node?.totalPrice?.amount}{" "}
            {detailData?.node?.totalPrice?.currencyCode}
          </Text>
        </View>
        <TouchableOpacity
          disabled={!shippingLineRatesData?.node?.shippingLine ? true : false}
          onPress={() => {
            navigation.navigate("CheckoutScreen", {
              url:
                detailData?.node?.webUrl +
                "&previous_step=shipping_method&step=payment_method",
            });
          }}
          className={`items-center justify-center ${
            !shippingLineRatesData?.node?.shippingLine
              ? "bg-blue-200"
              : "bg-blue-400"
          }  py-4 rounded-[5px] mt-2`}
        >
          <Text className="text-[15px] font-medium uppercase text-white">
            Continue to Pay and Order
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
