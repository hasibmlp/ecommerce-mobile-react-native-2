import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronDownIcon, XMarkIcon } from "react-native-heroicons/outline";
import { Formik } from "formik";
import * as yup from "yup";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ADD_CHECKOUT_EMAIL,
  ADD_CHECKOUT_SHIPPING_ADDRESS,
  CUSTOMER_ADDRESS_CREATE,
} from "../graphql/mutations";
import { cartIdVar, checkoutIdVar } from "../App";
import {
  GET_AVAILABLE_COUNTRIES,
  GET_AVAILABLE_SHIPPING_RATES,
  GET_BUYER_DETAILS,
  GET_CHECKOUT_DETAILS,
  GET_CUSTOMER,
} from "../graphql/queries";
import Button from "./buttons/Button";
import RadioButton from "./RadioButton";
import MyModal from "./Modal/MyModal";
import BottomModal from "./Modal/BottomModal";

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const phoneRegExp = /^\+(?:[0-9] ?){6,14}[0-9]$/;

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
  const shippingFormVisible = route.params?.shippingFormVisible
  const [ userToken, setUserToken ] = useState(null)
  const [ isFormModalVisible, setFormModalVisible ] = useState(false)
console.log("STATE PASSED VISIBLITY",isFormModalVisible)
  const [ user, setUser ] = useState(null)
  const [ isUnknown, setUnknown ] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({});
  const checkoutId = useReactiveVar(checkoutIdVar)
  const [ activeAddress, setActiveAddress ] = useState('')



  
  const isLoggedIn = user ? true : false
 


  const navigation = useNavigation();


  const getAcessToken = async () => {
    const token = await AsyncStorage.getItem("my-key")
    if(token !== null) {
      setUserToken(token)
    }else{
      setUserToken(null)
    }
  }

  // const checkoutId = useReactiveVar(cartIdVar);

  const {
    loading: buyerLoading,
    error: buyerError,
    data: buyerData,
  } = useQuery(GET_BUYER_DETAILS, {
    variables: {
      checkoutId,
    },
  });



  const { 
    data: customerData,
    loading: customerLoading,
    error: customerError
   } = useQuery(GET_CUSTOMER, {
    variables: {
      customerAccessToken: userToken,
    }
   })

  const { 
    data: availableCountriesData,
    loading: availableCountriesLoading,
    error: availableCountriesError
   } = useQuery(GET_AVAILABLE_COUNTRIES)

  const [
    updateCheckoutEmail,
    { loading: emailLoading, error: emailError, data: emailData },
  ] = useMutation(ADD_CHECKOUT_EMAIL);

  console.log("UPDATED EMAIL DATA: ", emailData)

  const [
    updateShippingAddress,
    { loading: shippingLoading, error: shippingError, data: shippingData },
  ] = useMutation(ADD_CHECKOUT_SHIPPING_ADDRESS);


  const [
    customerAddressCreate,
    { loading: customerAddressCreateLoading, error: customerAddressCreateError, data:   customerAddressCreateData },
  ] = useMutation(CUSTOMER_ADDRESS_CREATE);
  

  
  const handleEmailShippingUpdate = () => {
    const shippingValues = {
      address1: activeAddress?.address1 || '',
      address2: activeAddress?.address2 || '',
      city: activeAddress?.city || '',
      company: activeAddress?.company || '',
      country: activeAddress?.country || '',
      firstName: activeAddress?.firstName || '',
      lastName: activeAddress?.lastName || '',
      phone: activeAddress?.phone || '',
      province: activeAddress?.province || '',
      zip: activeAddress?.zip || ''
    };

            updateCheckoutEmail({
              variables: {
                checkoutId,
                email: user?.email,
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
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('my-key')
      setUserToken(null)
    }catch(err) {

    }
  }

  useFocusEffect(
    useCallback(() => {
      // Ensure the form is visible when shippingFormVisible is true
      setFormModalVisible(Boolean(route.params?.shippingFormVisible));

    }, [route.params?.shippingFormVisible])
  );

  // useEffect(() => {
  //   isLoggedIn ? setUnknown(false) : setUnknown(true)
  // },[isLoggedIn])

  useEffect(() => {
    if(buyerData) {
      setActiveAddress(buyerData?.node?.shippingAddress)
    }
  }, [buyerData])

  useEffect(() => {
    if(customerData?.customer?.id) {
      setUser(customerData.customer) 
    }else{
      setUser(null)
    }
  },[customerData])

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
        // navigation.navigate("CheckoutReviewScreen");
      }
    }
  }, [emailData, shippingData]);


  useEffect(() => {
    getAcessToken()
  })

  if (emailLoading && shippingLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading..email and shipping update</Text>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 flex-col justify-center"
      enabled
      keyboardVerticalOffset={100}
    >


      <ScrollView> 
        {!customerLoading && (<Formik 
          initialValues={{
              email: buyerData?.node ? buyerData?.node?.email : "",
              address1: buyerData?.node ? buyerData?.node?.shippingAddress?.address1 : "",
              address2: buyerData?.node ? buyerData?.node?.shippingAddress?.address2 : "",
              city: buyerData?.node ? buyerData?.node?.shippingAddress?.city : "",
              province: buyerData?.node ? buyerData?.node?.shippingAddress?.province : "",
              country: buyerData?.node ? buyerData?.node?.shippingAddress?.country : "",
              firstName: buyerData?.node ? buyerData?.node?.shippingAddress?.firstName : "",
              lastName: buyerData?.node ? buyerData?.node?.shippingAddress?.lastName : "",
              phone: buyerData?.node ? buyerData?.node?.shippingAddress?.phone : "",
              zip: buyerData?.node ? buyerData?.node?.shippingAddress?.zip : "", 
            }
          }
          validationSchema={shippingAddressFromSchema}
          onSubmit={(values) => {
            const shippingValues = { ...values };
            delete shippingValues.email;
            delete shippingAddress.province

            updateCheckoutEmail({
              variables: {
                checkoutId,
                email: user?.email ? user?.email : values.email,  
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

            if(user.id){
              customerAddressCreate({
              variables: {
                address: shippingValues,
                  customerAccessToken: userToken
                }
              })
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

            <MyModal visible={isFormModalVisible} slide="toUp">
                  <ModalForm values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} handleSubmit={handleSubmit} onClose={() => setFormModalVisible(false)}/>
            </MyModal>

              <Text>{JSON.stringify(values)}</Text>

              <View className="px-4 py-3 bg-gray-100">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  CONTACT INFORMATION
                </Text>
              </View>

              {isLoggedIn && (<LoggedInComponent user={user} handleLogout={handleLogout} />)}

              {!isLoggedIn && (
                <>
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
                </>
              )}

              <View className="px-4 py-3 bg-gray-100 ">
                <Text className="text-[13px] text-gray-500 font-medium uppercase">
                  Shipping Address
                </Text>
              </View>

              {isLoggedIn && (<UserShippingAddressList user={user} activeAddress={activeAddress} setActiveAddress={setActiveAddress} setUnknown={setUnknown} />)}
              
            {isLoggedIn && (<View className="bg-white pb-5">
              <Button onPress={() => setUnknown(true)} label="Create New Address" type="action" size="sm"/>
            </View>)}

              {isUnknown && (<ShippingAddressForm errors={errors} touched={touched}
              values={values} handleBlur={handleBlur} handleChange={handleChange}  />)}


            {isUnknown && (<TouchableOpacity
              className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5"
              onPress={handleSubmit}
            >
              <Text className="text-[15px] text-white font-medium text-center uppercase">
                save and continue
              </Text>
            </TouchableOpacity>)}
            </View>
          )}
        </Formik>)}
        {!isUnknown && (<TouchableOpacity
          className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5 mb-2"
          onPress={handleEmailShippingUpdate}
        >
          <Text className="text-[15px] text-white font-medium text-center uppercase">
            save and continue
          </Text>
        </TouchableOpacity>)}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ModalForm = ({values, errors, touched, handleChange, handleBlur, handleSubmit,  onClose}) => {

   return (
    <ScrollView className="flex-1">
      <View className="flex-row w-full h-10 items-center">
        <TouchableOpacity onPress={onClose} className=" p-2 absolute right-5">
          <XMarkIcon size={28} color="black" />
        </TouchableOpacity>
      </View>

              <View className="flex-1">

                <View className="px-4 py-3 bg-gray-100">
                  <Text className="text-[13px] text-gray-500 font-medium uppercase">
                    CONTACT INFORMATION
                  </Text>
                </View>


                  <>
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
                  </>


                <View className="px-4 py-3 bg-gray-100 ">
                  <Text className="text-[13px] text-gray-500 font-medium uppercase">
                    Shipping Address
                  </Text>
                </View>

                <ShippingAddressForm errors={errors} touched={touched}
                values={values} handleBlur={handleBlur} handleChange={handleChange}  />

              <TouchableOpacity
                className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5"
                onPress={handleSubmit}
              >
                <Text className="text-[15px] text-white font-medium text-center uppercase">
                  save and continue
                </Text>
              </TouchableOpacity>
              </View>

    </ScrollView>
   )
}


const LoggedInComponent = ({user, handleLogout}) => {
  return (
    <View>
      <View className="flex-row bg-white p-5">
                <View className="w-16 h-16 rounded-full border border-neutral-200 bg-neutral-100 mr-3"></View>
                <View className="items-start">
                    <Text className="mb-2">{user?.email}</Text>
                    <Text className="mb-2">{user?.defaultAddress?.phone}</Text>
                    <View>
                        <Button onPress={handleLogout} label="logout" type="action" size="md" flex={false} />
                    </View>
                </View>
            </View>
            
    </View>
  )
}

const UserShippingAddressList = ({user, activeAddress, setActiveAddress, setUnknown }) => {
  const shippingAddress = user?.addresses?.edges

  const handlePress = (item) => {
    setActiveAddress(item.node)
    setUnknown(false)
  }

  return (
    <View>
      <View className="bg-white py-5">
                {shippingAddress?.map((item, index) => {
                    return (
                    <Pressable key={index.toString()} onPress={() => handlePress(item)} className="flex-row bg-white p-5 items-center">

                    <RadioButton checked={activeAddress === item?.node} />

                    <View className="ml-2">
                      <View className="flex-row">
                              <Text className="text-[16px] text-black font-normal">{item.node.firstName}</Text>
                              <Text className="pl-1 text-[16px] text-black font-normal">{item.node.lastName}</Text>
                      </View>
                      
                      <Text className="text-[16px] text-black font-normal w-[250px]">
                        {item?.node?.address1 +
                          ", " +
                          item?.node?.address2 +
                          ", " +
                          item?.node?.city +
                          ", " +
                          item?.node?.country +
                          (item?.node?.zip
                            ? ", " + item?.node?.zip
                            : "")}
                      </Text>
                    </View>
                </Pressable>)
                })}
                
            </View>
    </View>
  )
}

const ShippingAddressForm = ({values, errors, touched, handleChange, handleBlur, handleSubmit}) => {
  return (
    <View>
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


                <BottomModal visible={false} >
                    <View className="h-40 w-40 bg-red-400"></View>
                </BottomModal>

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
    </View>
  )
}