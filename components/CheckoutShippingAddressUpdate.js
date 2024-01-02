import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useLayoutEffect, useState } from "react";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

import {
  ADD_CHECKOUT_EMAIL,
  ADD_CHECKOUT_SHIPPING_ADDRESS,
} from "../graphql/mutations";
import { cartIdVar, checkoutIdVar } from "../App";
import {
  GET_AVAILABLE_SHIPPING_RATES,
  GET_BUYER_DETAILS,
  GET_CHECKOUT_DETAILS,
} from "../graphql/queries";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const shippingAddressFromSchema = yup.object({
  email: yup.string().email().required("email is required"),
  address1: yup
    .string()
    .required("address is required")
    .min(3, "requires atleast 3 character"),
  address2: yup.string().required().min(3, "requires atleast 3 character"),
  city: yup.string().required("city is required"),
  province: yup.string().required("state is required"),
  country: yup.string().required(),
  firstName: yup
    .string()
    .required("first is required")
    .min(3, "requires atleast 3 character"),
  lastName: yup
    .string()
    .required("last name is required")
    .min(3, "requires atleast 3 character"),
  phone: yup
    .string()
    .required()
    .matches(phoneRegExp, "Enter valid phone number"),
});

const shippingAddressFromSchema2 = yup.object({
  address1: yup
    .string()
    .required("address is required")
    .min(3, "requires atleast 3 character"),
  address2: yup.string().required().min(3, "requires atleast 3 character"),
  city: yup.string().required("city is required"),
  province: yup.string().required("state is required"),
  country: yup.string().required(),
  firstName: yup
    .string()
    .required("first is required")
    .min(3, "requires atleast 3 character"),
  lastName: yup
    .string()
    .required("last name is required")
    .min(3, "requires atleast 3 character"),
  phone: yup
    .string()
    .required()
    .matches(phoneRegExp, "Enter valid phone number"),
});

export default function CheckoutShippingAddressUpdate({ route }) {
  // const checkoutId = useReactiveVar(cartIdVar);
  const { context } = route.params
  const checkoutId = useReactiveVar(checkoutIdVar)

  const navigation = useNavigation();

  const [shippingAddress, setShippingAddress] = useState({});

  const {
    loading: buyerLoading,
    error: buyerError,
    data: buyerData,
  } = useQuery(GET_BUYER_DETAILS, {
    variables: {
      checkoutId,
    },
  });


  const [
    updateCheckoutEmail,
    { loading: emailLoading, error: emailError, data: emailData },
  ] = useMutation(ADD_CHECKOUT_EMAIL);

  const [
    updateShippingAddress,
    { loading: shippingLoading, error: shippingError, data: shippingData },
  ] = useMutation(ADD_CHECKOUT_SHIPPING_ADDRESS);

  useEffect(() => {
    if (emailData && shippingData) {
      if (checkoutId !== emailData.checkoutEmailUpdateV2.checkout.id) {
        cartIdVar(emailData.checkoutEmailUpdateV2.checkout.id);
      }

      if (
        shippingData.checkoutShippingAddressUpdateV2.checkoutUserErrors
          .length !== 0
      ) {
        Alert.alert(
          shippingData.checkoutShippingAddressUpdateV2.checkoutUserErrors[0]
            .message
        );
      } else {
        navigation.navigate("CheckoutReviewScreen");
      }
    }
  }, [emailData, shippingData]);

  if (emailLoading && shippingLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading..</Text>
      </View>
    );
  if (emailError && shippingError)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {emailError.message || shippingError.message}</Text>
      </View>
    );

  if (buyerLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading..</Text>
      </View>
    );
  if (buyerError)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error occured {buyerError.message}</Text>
      </View>
    );

  if (context === 'checkoutUserUpdate')
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 flex-col justify-center"
      enabled
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <Formik
          initialValues={{
            email: buyerData?.node?.email ? buyerData?.node?.email : "",
            address1: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.address1
              : "",
            address2: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.address2
              : "",
            city: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.city
              : "",
            province: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.province
              : "",
            country: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.country
              : "",
            firstName: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.firstName
              : "",
            lastName: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.lastName
              : "",
            phone: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.phone
              : "",
            zip: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.zip
              : "",
          }}
          validationSchema={shippingAddressFromSchema}
          onSubmit={(values) => {
            const shippingValues = { ...values };
            delete shippingValues.email;


            updateCheckoutEmail({
              variables: {
                checkoutId,
                email: values.email,
              },
              refetchQueries: [
                GET_CHECKOUT_DETAILS,
                GET_BUYER_DETAILS,
                GET_AVAILABLE_SHIPPING_RATES,
              ],
            });

            if (!emailLoading) {
              updateShippingAddress({
                variables: {
                  checkoutId,
                  shippingAddress: shippingValues,
                },
                refetchQueries: [
                  GET_CHECKOUT_DETAILS,
                  GET_BUYER_DETAILS,
                  GET_AVAILABLE_SHIPPING_RATES,
                ],
              });
            }
            
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <View className="flex-1">
              <View className="px-4 py-3 bg-gray-100 ">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  Shipping Address
                </Text>
              </View>

              <View>
                {errors.country && touched.country ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.country}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.country && touched.country
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Country*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("country")}
                    onBlur={handleBlur("country")}
                    placeholder="United Arab Emirates"
                    className="text-[16px] text-black font-normal"
                    value={values.country}
                  />
                </View>
              </View>

              <View>
                {errors.province && touched.province ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.province}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.province && touched.province
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    State*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("province")}
                    onBlur={handleBlur("province")}
                    placeholder="e.g Business Bay"
                    className="text-[16px] text-black font-normal"
                    value={values.province}
                  />
                </View>
              </View>

              <View>
                {errors.city && touched.city ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.city}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.city && touched.city
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    City*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("city")}
                    onBlur={handleBlur("city")}
                    placeholder="e.g Business Bay"
                    className="text-[16px] text-black font-normal"
                    value={values.city}
                  />
                </View>
              </View>

              <View className="px-4 py-3 border-b border-gray-100 bg-white">
                <Text className={`text-[16px] text-black font-medium mb-1`}>
                  Zip
                </Text>
                <TextInput
                  onChangeText={handleChange("zip")}
                  onBlur={handleBlur("zip")}
                  placeholder="123123"
                  className="text-[16px] text-black font-normal"
                  value={values.zip}
                />
              </View>

              <View>
                {errors.address1 && touched.address1 ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.address1}
                    </Text>
                  </View>
                ) : null}
                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.address1 && touched.address1
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Delivery Address*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("address1")}
                    onBlur={handleBlur("address1")}
                    placeholder="Building name / street"
                    className="text-[16px] text-black font-normal"
                    value={values.address1}
                  />
                </View>
              </View>

              <View>
                {errors.address2 && touched.address2 ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.address2}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.address2 && touched.address2
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Apartment# / Hotel Room# / Villa*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("address2")}
                    onBlur={handleBlur("address2")}
                    placeholder="e.g. Apartment 1234"
                    className="text-[16px] text-black font-normal"
                    value={values.address2}
                  />
                </View>
              </View>

              <View className="px-4 py-3 bg-gray-100">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  HOW CAN WE CONTACT YOU?
                </Text>
              </View>

              <View>
                {(errors.firstName && touched.firstName) ||
                (errors.lastName && touched.lastName) ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.firstName} {errors.lastName}
                    </Text>
                  </View>
                ) : null}

                <View className="flex-row justify-between items-center border-b border-gray-100 bg-white">
                  <View className="px-4 py-3 w-[50%]">
                    <TextInput
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      placeholder="First Name*"
                      placeholderTextColor={`${
                        errors.firstName && touched.firstName ? "red" : "black"
                      }`}
                      className={`text-[16px] text-black font-normal h-10 `}
                      value={values.firstName}
                    />
                  </View>
                  <View className="px-4 py-3 w-[50%]">
                    <TextInput
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      placeholder="Last Name*"
                      placeholderTextColor={`${
                        errors.lastName && touched.lastName ? "red" : "black"
                      }`}
                      className={`text-[16px] text-black font-normal h-10`}
                      value={values.lastName}
                    />
                  </View>
                  <View className="w-[1px] h-6 bg-gray-300 absolute left-[50%]"></View>
                </View>
              </View>

              <View>
                {errors.email && touched.email ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.email}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 w-full border-b border-gray-100 bg-white">
                  <TextInput
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Email*"
                    placeholderTextColor={`${
                      errors.email && touched.email ? "red" : "black"
                    }`}
                    className="text-[16px] text-black font-normal h-10"
                    value={values.email}
                  />
                </View>
              </View>

              <View>
                {errors.phone && touched.phone ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.phone}
                    </Text>
                  </View>
                ) : null}

                <View className="flex-row items-center px-4 py-3 w-full border-b border-gray-100 bg-white">
                  <View className="flex-row items-center max-w-[25%] mr-5 border-r border-gray-100 bg-white pr-5">
                    <Text
                      className={`text-[16px] ${
                        errors.phone && touched.phone
                          ? "text-red-500"
                          : "text-black"
                      } font-normal mr-4`}
                    >
                      +971
                    </Text>
                    <ChevronDownIcon size={20} color="black" />
                  </View>
                  <View className="w-full">
                    <TextInput
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      placeholder="Phone*"
                      placeholderTextColor={`${
                        errors.phone && touched.phone ? "red" : "black"
                      }`}
                      keyboardType="numeric"
                      className="text-[16px] text-black font-normal h-10 "
                      value={values.phone}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5"
                onPress={handleSubmit}
              >
                <Text className="text-[15px] text-white font-medium text-center uppercase">
                  save and continue
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (context === 'userShippingAddressUpdate')
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 flex-col justify-center"
      enabled
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <Formik
          initialValues={{
            address1: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.address1
              : "",
            address2: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.address2
              : "",
            city: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.city
              : "",
            province: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.province
              : "",
            country: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.country
              : "",
            firstName: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.firstName
              : "",
            lastName: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.lastName
              : "",
            phone: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.phone
              : "",
            zip: buyerData?.node?.shippingAddress
              ? buyerData?.node?.shippingAddress?.zip
              : "",
          }}
          validationSchema={shippingAddressFromSchema2}
          onSubmit={(values) => {
            const shippingValues = { ...values };

            updateShippingAddress({
              variables: {
                checkoutId,
                shippingAddress: shippingValues,
              },
              refetchQueries: [
                GET_CHECKOUT_DETAILS,
                GET_BUYER_DETAILS,
                GET_AVAILABLE_SHIPPING_RATES,
              ],
            });
            
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <View className="flex-1">
              <View className="px-4 py-3 bg-gray-100 ">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  Shipping Address
                </Text>
              </View>

              <View>
                {errors.country && touched.country ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.country}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.country && touched.country
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Country*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("country")}
                    onBlur={handleBlur("country")}
                    placeholder="United Arab Emirates"
                    className="text-[16px] text-black font-normal"
                    value={values.country}
                  />
                </View>
              </View>

              <View>
                {errors.province && touched.province ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.province}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.province && touched.province
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    State*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("province")}
                    onBlur={handleBlur("province")}
                    placeholder="e.g Business Bay"
                    className="text-[16px] text-black font-normal"
                    value={values.province}
                  />
                </View>
              </View>

              <View>
                {errors.city && touched.city ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.city}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.city && touched.city
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    City*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("city")}
                    onBlur={handleBlur("city")}
                    placeholder="e.g Business Bay"
                    className="text-[16px] text-black font-normal"
                    value={values.city}
                  />
                </View>
              </View>

              <View className="px-4 py-3 border-b border-gray-100 bg-white">
                <Text className={`text-[16px] text-black font-medium mb-1`}>
                  Zip
                </Text>
                <TextInput
                  onChangeText={handleChange("zip")}
                  onBlur={handleBlur("zip")}
                  placeholder="123123"
                  className="text-[16px] text-black font-normal"
                  value={values.zip}
                />
              </View>

              <View>
                {errors.address1 && touched.address1 ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.address1}
                    </Text>
                  </View>
                ) : null}
                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.address1 && touched.address1
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Delivery Address*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("address1")}
                    onBlur={handleBlur("address1")}
                    placeholder="Building name / street"
                    className="text-[16px] text-black font-normal"
                    value={values.address1}
                  />
                </View>
              </View>

              <View>
                {errors.address2 && touched.address2 ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.address2}
                    </Text>
                  </View>
                ) : null}

                <View className="px-4 py-3 border-b border-gray-100 bg-white">
                  <Text
                    className={`text-[16px] ${
                      errors.address2 && touched.address2
                        ? "text-red-500"
                        : "text-black"
                    } font-medium mb-1`}
                  >
                    Apartment# / Hotel Room# / Villa*
                  </Text>
                  <TextInput
                    onChangeText={handleChange("address2")}
                    onBlur={handleBlur("address2")}
                    placeholder="e.g. Apartment 1234"
                    className="text-[16px] text-black font-normal"
                    value={values.address2}
                  />
                </View>
              </View>

              <View className="px-4 py-3 bg-gray-100">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  HOW CAN WE CONTACT YOU?
                </Text>
              </View>

              <View>
                {(errors.firstName && touched.firstName) ||
                (errors.lastName && touched.lastName) ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.firstName} {errors.lastName}
                    </Text>
                  </View>
                ) : null}

                <View className="flex-row justify-between items-center border-b border-gray-100 bg-white">
                  <View className="px-4 py-3 w-[50%]">
                    <TextInput
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      placeholder="First Name*"
                      placeholderTextColor={`${
                        errors.firstName && touched.firstName ? "red" : "black"
                      }`}
                      className={`text-[16px] text-black font-normal h-10 `}
                      value={values.firstName}
                    />
                  </View>
                  <View className="px-4 py-3 w-[50%]">
                    <TextInput
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      placeholder="Last Name*"
                      placeholderTextColor={`${
                        errors.lastName && touched.lastName ? "red" : "black"
                      }`}
                      className={`text-[16px] text-black font-normal h-10`}
                      value={values.lastName}
                    />
                  </View>
                  <View className="w-[1px] h-6 bg-gray-300 absolute left-[50%]"></View>
                </View>
              </View>

              <View>
                {errors.phone && touched.phone ? (
                  <View className="bg-red-500 py-2 px-4">
                    <Text className="text-[14px] text-white font-medium ">
                      {errors.phone}
                    </Text>
                  </View>
                ) : null}

                <View className="flex-row items-center px-4 py-3 w-full border-b border-gray-100 bg-white">
                  <View className="flex-row items-center max-w-[25%] mr-5 border-r border-gray-100 bg-white pr-5">
                    <Text
                      className={`text-[16px] ${
                        errors.phone && touched.phone
                          ? "text-red-500"
                          : "text-black"
                      } font-normal mr-4`}
                    >
                      +971
                    </Text>
                    <ChevronDownIcon size={20} color="black" />
                  </View>
                  <View className="w-full">
                    <TextInput
                      onChangeText={handleChange("phone")}
                      onBlur={handleBlur("phone")}
                      placeholder="Phone*"
                      placeholderTextColor={`${
                        errors.phone && touched.phone ? "red" : "black"
                      }`}
                      keyboardType="numeric"
                      className="text-[16px] text-black font-normal h-10 "
                      value={values.phone}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5"
                onPress={handleSubmit}
              >
                <Text className="text-[15px] text-white font-medium text-center uppercase">
                  save and continue
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );

}
