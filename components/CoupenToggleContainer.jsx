import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MinusIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import Animated, {
  FadeIn,
  FadeOut,
  FadingTransition,
  Layout,
} from "react-native-reanimated";
import { Formik } from "formik";
import * as yup from "yup";
import { useMutation, useReactiveVar } from "@apollo/client";
import { UPDATE_CART_DISCOUT_CODE } from "../graphql/mutations";
import { cartVar } from "../App";
import { GET_CART_DETAILS_V2 } from "../graphql/queries";
import LoadingFullScreen from "./Sidebar/LoadingFullScreen";

const coupenCodeValidationSchema = yup.object({
  coupenCode: yup.string().required("Please enter a promo code"),
});

export default function CoupenToggleContainer({discountCodes}) {
  const cart = useReactiveVar(cartVar)
  const [open, setOpen] = useState(false);

  
  const [updateCartDiscountCode, { data, loading, error }] = useMutation(UPDATE_CART_DISCOUT_CODE)
  
  const handleSubmit = (values) => {
    if(values.coupenCode) {
      updateCartDiscountCode({
        variables: {
          cartId: cart?.id,
          discountCodes: [values.coupenCode]
        },
        refetchQueries: [
          {
            query: GET_CART_DETAILS_V2,
            variables: {
              cartId: cart?.id,
            },
          },
        ],
      })
    }

  }

  const handleRemove = () => {
    updateCartDiscountCode({
      variables: {
        cartId: cart?.id,
        discountCodes: ['']
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS_V2,
          variables: {
            cartId: cart?.id,
          },
        },
      ],
    })
  }

  useEffect(() => {
    if(data?.cartDiscountCodesUpdate?.cart?.discountCodes[0]?.applicable === false && data?.cartDiscountCodesUpdate?.cart?.discountCodes[0]?.code.length > 0 )
      Alert.alert("Please enter a valed code")
  }, [data])


  return (
    <Animated.View className="bg-white mt-3">
      {loading && (<LoadingFullScreen />)}
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}
        className="flex-row justify-between items-center py-5 px-4"
      >
        <Text className="text-[15px] text-black font-medium">
          Add a Coupen Code
        </Text>
        <View>
          {open && <MinusIcon size={20} color="black" />}
          {!open && <PlusIcon size={20} color="black" />}
        </View>
      </Pressable>
      {open && (
        <Formik
          initialValues={{ coupenCode: "" }}
          onSubmit={handleSubmit}
          validationSchema={coupenCodeValidationSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View className="pb-3">
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                className="bg-white px-4 justify-center py-3 "
              >
                <TextInput
                  placeholder="Enter coupen code"
                  onChangeText={handleChange("coupenCode")}
                  onBlur={handleBlur("coupenCode")}
                  value={values.coupenCode}
                  className={`h-12 border ${
                    errors.coupenCode ? "border-red-500" : "border-gray-400"
                  } rounded-[5px] px-2`}
                />
                <TouchableOpacity
                  onPress={handleSubmit}
                  className="border border-gray-500 absolute right-8 rounded-[5px] py-2 px-3 self-end"
                >
                  <Text className="text-[14px] text-black font-normal uppercase">
                    Apply
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              {errors.coupenCode && <Text className="text-[14px] text-red-500 font-normal px-4 pt-1">{errors.coupenCode}</Text>}
            </View>
          )}
        </Formik>
      )}
      {discountCodes[0]?.applicable && (<View className="flex-row px-4 pb-4">
        {discountCodes.map((item, index) => (
          <Pressable key={index.toString()} onPress={handleRemove} className="border border-neutral-500 px-2 py-2 rounded-md flex-row items-center">
            <Text>{item.code}</Text>
            <XMarkIcon size={24} color="black" />
          </Pressable>
        ))}
      </View>)}
    </Animated.View>
  );
}
