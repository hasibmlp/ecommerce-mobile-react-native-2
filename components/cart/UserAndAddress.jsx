import { KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native"
import Button from "../buttons/Button"
import RadioButton from "../RadioButton"
import { useState } from "react"
import { Formik } from "formik"

const UserAndAddress = () => {
    const [ activeAddress, setActiveAddress ] = useState('')
    const isLoggedIn = false
    if(isLoggedIn)
    return (
        <View className="flex-1">
            <View className="flex-row bg-white p-5">
                <View className="w-16 h-16 rounded-full border border-neutral-200 bg-neutral-100 mr-3"></View>
                <View className="items-start">
                    <Text className="mb-2">haseebabdullach@gmail.com</Text>
                    <Text className="mb-2">+971503690173</Text>
                    <View>
                        <Button label="logout" type="action" size="md" flex={false} />
                    </View>
                </View>
            </View>
            <View className="bg-white py-5">
                <Button label="Create New Address" type="action" size="sm"/>
                <Pressable onPress={() => setActiveAddress('first')} className="flex-row bg-white p-5 items-center">
                    <RadioButton checked={activeAddress === 'first'} />
                    <View>
                        <View className="flex-row">
                            <Text className="pl-3">Abdulla</Text>
                            <Text className="pl-2">Haseeb</Text>
                        </View>
                        <Text className="pl-3">Address 1</Text>
                        <Text className="pl-3">Address 2</Text>
                        <Text className="pl-3">Saudi Arabia</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => setActiveAddress('second')} className="flex-row bg-white p-5 items-center">
                    <RadioButton checked={activeAddress === 'second'} />
                    <View>
                        <View className="flex-row">
                            <Text className="pl-3">Abdulla</Text>
                            <Text className="pl-2">Haseeb</Text>
                        </View>
                        <Text className="pl-3">Address 1</Text>
                        <Text className="pl-3">Address 2</Text>
                        <Text className="pl-3">Saudi Arabia</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => setActiveAddress('third')} className="flex-row bg-white p-5 items-center">
                    <RadioButton checked={activeAddress === 'third'} />
                    <View>
                        <View className="flex-row">
                            <Text className="pl-3">Abdulla</Text>
                            <Text className="pl-2">Haseeb</Text>
                        </View>
                        <Text className="pl-3">Address 1</Text>
                        <Text className="pl-3">Address 2</Text>
                        <Text className="pl-3">Saudi Arabia</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )

    if(!isLoggedIn)
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
    )
}

export default UserAndAddress