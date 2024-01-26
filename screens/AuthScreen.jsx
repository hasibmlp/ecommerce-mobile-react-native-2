import { useNavigation } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import * as Yup from "yup";

import { ScreenHeader } from "../components/actions/ScreenHeader";
import Button from "../components/buttons/Button";
import {
  CART_BUYER_IDENTITY_UPDATE,
  CREATE_CART,
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_TOKEN,
  CUSTOMER_RECOVER,
} from "../graphql/mutations";
import { GET_CART_DETAILS_V2, GET_CUSTOMER } from "../graphql/queries";
import { cartVar, isLoggedinFrstTimeVar, userVar } from "../makeVars/MakeVars";
import CheckBox from "../components/Sidebar/Buttons/Checkbox";
import MyModal from "../components/Modal/MyModal";
import { XMarkIcon } from "react-native-heroicons/outline";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const AuthScreen = () => {
  const cart = useReactiveVar(cartVar);
  const isLoggedinFrstTime = useReactiveVar(isLoggedinFrstTimeVar);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("log");
  const [isModalVisible, setModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [createUserToken, { data, loading, error }] = useMutation(
    CREATE_CUSTOMER_TOKEN
  );
  const [
    createCustomer,
    {
      data: customerCreationData,
      loading: customerCreationLoading,
      error: customerCreationError,
    },
  ] = useMutation(CREATE_CUSTOMER);
  const [
    customerRecover,
    {
      data: customerRecoverData,
      loading: customerRecoverLoading,
      error: customerRecoverError,
    },
  ] = useMutation(CUSTOMER_RECOVER);

  const [
    updateCartBuyer,
    {
      data: updateCartBuyerData,
      loading: updateCartBuyerLoading,
      error: updateCartBuyerError,
    },
  ] = useMutation(CART_BUYER_IDENTITY_UPDATE);

  const [
    getUser,
    {
      data: customrDetailsData,
      loading: customerDetailsLoading,
      error: customerDetailsError,
    },
  ] = useLazyQuery(GET_CUSTOMER, {
    fetchPolicy: 'no-cache'
  });

  const [createCart] = useMutation(CREATE_CART);
  const [getCartDetails, { data: cartDetailData }] =
    useLazyQuery(GET_CART_DETAILS_V2, {
      fetchPolicy: 'no-cache'
    });

  // console.log("USER ACCESS TOKEN CREATED: ", data?.customerAccessTokenCreate?.customerAccessToken?.accessToken)

  const handleLogin = async (values) => {
    try {
      await createUserToken({
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
        onCompleted: (data) => {
          const handleTokenStorage = async () => {
            if (
              (await data?.customerAccessTokenCreate?.customerAccessToken) ===
              null
            ) {
              Alert.alert(
                await data?.customerAccessTokenCreate?.customerUserErrors[0]
                  .message
              );
            } else {
              const token = await data?.customerAccessTokenCreate
                ?.customerAccessToken?.accessToken;
              if (token) {
                await getUser({
                  variables: {
                    customerAccessToken: token,
                  },
                  onCompleted: async (data) => {
                    console.log("USER UPDATED SUCCESFULLY");
                    const user = await data.customer;
                    if (await user) {
                      userVar(await user);
                      isLoggedinFrstTimeVar(true);
                    }

                    const token = await AsyncStorage.getItem("my-key");
                    console.log("CUSTOMER USER GET CODE RUN ....", token);

                    // await AsyncStorage.removeItem("cart-id");
                    // cartVar(null);

                    // console.log(
                    //   "REMOVED CART FORM ASYNC STORAGE AND CARTVAR",
                    //   cart
                    // );

                    // const cartInput = {
                    //   buyerIdentity: {
                    //     email: user?.email,
                    //     phone: user?.phone,
                    //     customerAccessToken: token,
                    //   },
                    // };

                    // await createCart({
                    //   variables: {
                    //     input: cartInput,
                    //   },
                    //   onCompleted: (data) => {
                    //     console.log("CART CREATED SUCCEFULLY");
                    //     const set = async () => {
                    //       if (data?.cartCreate?.cart?.id) {
                    //         try {
                    //           await AsyncStorage.setItem(
                    //             "cart-id",
                    //             data?.cartCreate?.cart?.id
                    //           );
                    //           console.log("CART ID SET TO ASYNC STORAGE");
                    //         } catch (e) {
                    //           console.log(
                    //             "Error setting cart ID in AsyncStorage:",
                    //             e
                    //           );
                    //         }
                    //       }
                    //     };
                    //     set();
                    //   },
                    //   refetchQueries: [
                    //     {
                    //       query: GET_CART_DETAILS_V2,
                    //     },
                    //   ],
                    // });

                    // const cartId = await AsyncStorage.getItem("cart-id");

                    // console.log("CART ID IN GETTING CART: ", cartId);
                    // await getCartDetails({
                    //   variables: {
                    //     cartId: "gid://shopify/Cart/Z2NwLXVzLWVhc3QxOjAxSEtZRFFGVFoxQTMzQkpOMkpSMVNCSkY5",
                    //   },
                    //   onCompleted: async (data) => {
                    //     console.log(
                    //       "cart details fetched successfully in authScreen"
                    //     );
                    //     cartVar(await data?.cart);
                    //   },
                    // });

                    updateCartBuyer({
                      variables: {
                        buyerIdentity: {
                          customerAccessToken: token,
                          email: user.email,
                          phone: user.phone,
                        },
                        cartId: cart?.id,
                      },
                      onCompleted: (data) => {
                        const newCart = { ...cart };
                        newCart.buyerIdentity =
                          data?.cartBuyerIdentityUpdate?.cart?.buyerIdentity;
                        cartVar(newCart);
                        console.log(
                          "BUYER IDENTITY ADDED: ",
                          JSON.stringify(data, null, 2)
                        );
                      },
                    });
                  },
                });
              }
              try {
                if (token !== null) await AsyncStorage.setItem("my-key", token);
              } catch (e) {}
            }
          };

          if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
            setStatusMessage({
              message:
                data.customerAccessTokenCreate.customerUserErrors[0].message,
              status: "error",
            });
          } else {
            handleTokenStorage();
          }
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleRegister = (values) => {
    console.log("REGISTER VALUES: ", values);
    const loginValues = { email: values?.email, password: values?.password };

    try {
      createCustomer({
        variables: {
          input: values,
        },
        onCompleted: (data) => {
          console.log(
            "REGISTER IS WORKING ",
            data.customerCreate.customerUserErrors.length > 0
          );
          if (data.customerCreate.customerUserErrors.length > 0) {
            setStatusMessage({
              message: data.customerCreate.customerUserErrors[0].message,
              status: "error",
            });
          } else {
            handleLogin(loginValues);
          }
        },
      });
    } catch (e) {
      console.log("ERROR OCCURED REGISTERING USER: ", e);
    }
  };

  const handleForgotPassword = (values) => {
    try {
      console.log("RECOVER EMAIL PRESSED");
      customerRecover({
        variables: {
          email: values.email,
        },
        onCompleted: (data) => {
          if (data.customerRecover?.customerUserErrors.length === 0) {
            setModalVisible(false);
            setStatusMessage({
              message: "Password reset link has been sent to your email",
              status: "success",
            });
          } else {
            setModalVisible(false);
            setStatusMessage({
              message:
                data.customerRecover?.customerUserErrors[0]?.message ||
                "unknown error",
              status: "error",
            });
          }
        },
        onError: (err) => {
          console.log("Error in handling forgot password query", err);
        },
      });
    } catch (e) {
      console.log("Error in handling forgot password", e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // useEffect(() => {
  //   const getToken = async () => {
  //     console.log("SLJSLFJKSFJD", customrDetailsData?.customer?.email);
  //     const token = await AsyncStorage.getItem("my-key");
  //     console.log("CUSTOMER USER GET CODE RUN ....", token);

  //     updateCartBuyer({
  //       variables: {
  //         buyerIdentity: {
  //           customerAccessToken: token,
  //           email: customrDetailsData?.customer?.email,
  //         },
  //         cartId: cart?.id,
  //       },
  //       onCompleted: (data) => {
  //         console.log("BUYER IDENTITY ADDED: ", JSON.stringify(data, null, 2));
  //       },
  //     });
  //   };

  //   getToken();
  // }, [customrDetailsData]);

  // useEffect(() => {
  //   const handleTokenStorage = async () => {
  //     if (data?.customerAccessTokenCreate?.customerAccessToken === null) {
  //       Alert.alert(
  //         data?.customerAccessTokenCreate?.customerUserErrors[0].message
  //       );
  //     } else {
  //       const token =
  //         data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  //       if (token) {
  //         getUser({
  //           variables: {
  //             customerAccessToken: token,
  //           },
  //           onCompleted: async (data) => {
  //             if (await data?.customer) {
  //               userVar(await data?.customer);
  //               console.log("USER UPDATED SUCCESFULLY");
  //               navigation.navigate("MainScreen");
  //             }
  //           },
  //         });
  //       }
  //       try {
  //         if (token !== null) await AsyncStorage.setItem("my-key", token);
  //       } catch (e) {}
  //     }
  //   };

  //   handleTokenStorage();
  // }, [data?.customerAccessTokenCreate?.customerAccessToken]);

  // useEffect(() => {
  //   if (customrDetailsData?.customer) {
  //     userVar(customrDetailsData?.customer);
  //     console.log("USER UPDATED SUCCESFULLY");
  //     navigation.navigate("MainScreen");
  //   }
  // }, [customrDetailsData]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* {loading && <LoadingFullScreen />} */}
      {/* {customerDetailsLoading && <LoadingFullScreen />}
      {customerCreationLoading && <LoadingFullScreen />} */}
      <View className="flex-1 items-center bg-neutral-50">
        <ScreenHeader />

        <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "log" && (
          <LoaginScreen
            handleLogin={handleLogin}
            handleForgotPassword={handleForgotPassword}
            customerRecoverData={customerRecoverData}
            isModalVisible={isModalVisible}
            setModalVisible={setModalVisible}
            customerRecoverLoading={customerRecoverLoading}
            loading={
              loading || customerCreationLoading || customerDetailsLoading
            }
            setStatusMessage={setStatusMessage}
          />
        )}

        {activeTab === "reg" && (
          <RegisterScreen
            handleRegister={handleRegister}
            loading={
              loading || customerCreationLoading || customerDetailsLoading
            }
          />
        )}

        <StatusMessage
          status={statusMessage}
          completed={() => setStatusMessage(null)}
        />
      </View>
    </SafeAreaView>
  );
};

const TabHeader = ({ activeTab, setActiveTab }) => {
  return (
    <View className="w-full flex-row bg-white shadow-sm justify-between mt-10">
      <Pressable
        onPress={() => setActiveTab("log")}
        className="flex-1 items-center justify-center"
      >
        <Text
          className={`text-lg py-4 ${
            activeTab === "log" ? "text-black" : "text-neutral-500"
          }`}
        >
          Log in
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setActiveTab("reg")}
        className="flex-1 items-center justify-center"
      >
        <Text
          className={`text-lg py-4 ${
            activeTab === "reg" ? "text-black" : "text-neutral-500"
          }`}
        >
          Register
        </Text>
      </Pressable>
    </View>
  );
};

const RegisterScreen = ({ handleRegister, loading }) => {
  const [isHidePassword, setHidePassword] = useState(true);
  const registerValidationSchema = Yup.object({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    phone: Yup.string().required(),
    acceptsMarketing: Yup.boolean(),
  });

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      className="w-full flex-1"
    >
      <View className="flex-1 w-full px-10">
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            acceptsMarketing: false,
          }}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              <View className="mb-10 items-center mt-16">
                <Text className="text-3xl text-black font-light">Hello</Text>
                <Text className="text-base text-black font-light ">
                  Create an account
                </Text>
              </View>
              <View
                className={`${
                  errors.firstName && touched.firstName ? "h-16" : "h-14"
                } mb-4 justify-between`}
              >
                <TextInput
                  placeholder="FirstName*"
                  placeholderTextColor={
                    errors.firstName && touched.firstName ? "#D10000" : "black"
                  }
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                  secureTextEntry={false}
                  className={`flex-1 text-[16px] font-normal border-b ${
                    errors.firstName && touched.firstName
                      ? "border-red-300 text-red-600"
                      : "border-neutral-300 text-black"
                  } `}
                />
                {errors.firstName && touched.firstName && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.firstName}
                  </Text>
                )}
              </View>
              <View
                className={`${
                  errors.lastName && touched.lastName ? "h-16" : "h-14"
                } mb-4 justify-between`}
              >
                <TextInput
                  placeholder="LastName*"
                  placeholderTextColor={
                    errors.lastName && touched.lastName ? "#D10000" : "black"
                  }
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                  secureTextEntry={false}
                  className={`flex-1 text-[16px] font-normal border-b ${
                    errors.lastName && touched.lastName
                      ? "border-red-300 text-red-600"
                      : "border-neutral-300 text-black"
                  } `}
                />
                {errors.lastName && touched.lastName && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.lastName}
                  </Text>
                )}
              </View>

              <View
                className={`${
                  errors.email && touched.email ? "h-16" : "h-14"
                } mb-4 justify-between`}
              >
                <TextInput
                  placeholder="Email*"
                  placeholderTextColor={
                    errors.email && touched.email ? "#D10000" : "black"
                  }
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  secureTextEntry={false}
                  className={`flex-1 text-[16px] font-normal border-b ${
                    errors.email && touched.email
                      ? "border-red-300 text-red-600"
                      : "border-neutral-300 text-black"
                  } `}
                />
                {errors.email && touched.email && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View
                className={`${
                  errors.password && touched.password ? "h-16" : "h-14"
                } mb-4 justify-between mt-3`}
              >
                <View className="flex-1 justify-center">
                  <TextInput
                    placeholder="Password*"
                    secureTextEntry={isHidePassword}
                    placeholderTextColor={
                      errors.password && touched.password ? "#D10000" : "black"
                    }
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    className={`flex-1 text-[16px] font-normal border-b ${
                      errors.password && touched.password
                        ? "border-red-300 text-red-600"
                        : "border-neutral-300 text-black"
                    } `}
                  />
                  <View className="absolute right-3">
                    {!isHidePassword && (
                      <Button
                        size="sm"
                        label="hide"
                        type="action"
                        onPress={() => setHidePassword(true)}
                      />
                    )}
                    {isHidePassword && (
                      <Button
                        size="sm"
                        label="show"
                        type="action"
                        onPress={() => setHidePassword(false)}
                      />
                    )}
                  </View>
                </View>

                {errors.password && touched.password && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <View
                className={`${
                  errors.phone && touched.phone ? "h-16" : "h-14"
                } mb-4 justify-between`}
              >
                <TextInput
                  placeholder="phone*"
                  placeholderTextColor={
                    errors.phone && touched.phone ? "#D10000" : "black"
                  }
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  keyboardType="phone-pad"
                  secureTextEntry={false}
                  className={`flex-1 text-[16px] font-normal border-b ${
                    errors.phone && touched.phone
                      ? "border-red-300 text-red-600"
                      : "border-neutral-300 text-black"
                  } `}
                />
                {errors.phone && touched.phone && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.phone}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={() =>
                  setFieldValue("acceptsMarketing", !values.acceptsMarketing)
                }
                className="flex-row items-center mb-8"
              >
                <CheckBox active={values.acceptsMarketing} />
                <Text className="ml-2">Newsletter subsciption</Text>
              </Pressable>

              <Button
                onPress={handleSubmit}
                label="create account"
                colors={["#42a5f5", "#90caf9"]}
                textColors={["#ffffff"]}
                style={{ marginBottom: 12 }}
                loading={loading}
              />
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const LoaginScreen = ({
  handleLogin,
  handleForgotPassword,
  isModalVisible,
  setModalVisible,
  customerRecoverLoading,
  loading,
  setStatusMessage,
}) => {
  const [isHidePassword, setHidePassword] = useState(true);

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required!"),
    password: Yup.string().required("Password is required!"),
  });

  const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required!"),
  });

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      className="w-full flex-1"
    >
      <View className="flex-1 w-full px-10">
        {/* <View style={{width: SCREEN_WIDTH}} className="bg-red-500 w-full h-10 absolute items-center justify-center">
        <Text className="text-sm text-white font-medium">
          Please fill all the red fields
        </Text>
      </View> */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View className="mb-10 items-center mt-16">
                <Text className="text-3xl text-black font-light">Welcome</Text>
                <Text className="text-base text-black font-light ">
                  Login to continue
                </Text>
              </View>

              <View
                className={`${
                  errors.password && touched.password ? "h-16" : "h-14"
                } mb-4 justify-between`}
              >
                <TextInput
                  placeholder="Email*"
                  placeholderTextColor={
                    errors.email && touched.email ? "#D10000" : "black"
                  }
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  secureTextEntry={false}
                  className={`flex-1 text-[16px] font-normal border-b ${
                    errors.email && touched.email
                      ? "border-red-300 text-red-600"
                      : "border-neutral-300 text-black"
                  } `}
                />
                {errors.email && touched.email && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View
                className={`${
                  errors.password && touched.password ? "h-16" : "h-14"
                } mb-4 justify-between mt-3`}
              >
                <View className="flex-1 justify-center">
                  <TextInput
                    placeholder="Password*"
                    secureTextEntry={isHidePassword}
                    placeholderTextColor={
                      errors.password && touched.password ? "#D10000" : "black"
                    }
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    className={`flex-1 text-[16px] font-normal border-b ${
                      errors.password && touched.password
                        ? "border-red-300 text-red-600"
                        : "border-neutral-300 text-black"
                    } `}
                  />
                  <View className="absolute right-3">
                    {!isHidePassword && (
                      <Button
                        size="sm"
                        label="hide"
                        type="action"
                        onPress={() => setHidePassword(true)}
                      />
                    )}
                    {isHidePassword && (
                      <Button
                        size="sm"
                        label="show"
                        type="action"
                        onPress={() => setHidePassword(false)}
                      />
                    )}
                  </View>
                </View>

                {errors.password && touched.password && (
                  <Text className={`text-xs text-red-600 text-normal mt-2`}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <Button
                onPress={() => {
                  handleSubmit();
                  Object.keys(errors).length > 0 &&
                    setStatusMessage({
                      message: "Please fill all red fields",
                      status: "error",
                    });
                }}
                label="Log In"
                style={{ marginBottom: 20 }}
                colors={["#42a5f5"]}
                textColors={["#ffffff"]}
                loading={loading}
              />
              <Button
                onPress={() => setModalVisible(true)}
                size="sm"
                label="forgot password"
                type="action"
              />
            </>
          )}
        </Formik>
        <MyModal slide="toUp" visible={isModalVisible}>
          <View className="flex-1 bg-neutral-50">
            {/* {customerRecoverLoading && <LoadingFullScreen />} */}

            <View className="flex-row w-full h-10 items-center bg-white justify-center">
              <Text className="text-base text-black font-normal">
                Forgot Password
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className=" p-2 absolute right-5"
              >
                <XMarkIcon size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View className="w-[90%] mx-auto mt-16">
              <Text className="text-lg text-neutral-800 font-light text-center">
                To retrieve your password, please enter your email address below
                and click 'Retrieve Password'.
              </Text>
              <Text className="text-sm text-neutral-800 font-light text-center mt-3">
                A Password reset link will then be sent to your email
              </Text>

              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={forgotPasswordValidationSchema}
                onSubmit={handleForgotPassword}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                    <View
                      className={`${
                        errors.password && touched.password ? "h-16" : "h-14"
                      } my-5 justify-between`}
                    >
                      <TextInput
                        placeholder="Email*"
                        placeholderTextColor={
                          errors.email && touched.email ? "#D10000" : "black"
                        }
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        className={`flex-1 text-[16px] font-normal border-b ${
                          errors.email && touched.email
                            ? "border-red-300 text-red-600"
                            : "border-neutral-300 text-black"
                        } `}
                      />
                      {errors.email && touched.email && (
                        <Text
                          className={`text-xs text-red-600 text-normal mt-2`}
                        >
                          {errors.email}
                        </Text>
                      )}
                    </View>

                    <Button
                      onPress={handleSubmit}
                      label="Retrieve Password"
                      style={{ marginBottom: 12 }}
                      colors={["#42a5f5", "#90caf9"]}
                      textColors={["#ffffff"]}
                      loading={customerRecoverLoading}
                    />
                  </>
                )}
              </Formik>
            </View>

            <View className="flex-1"></View>
          </View>
        </MyModal>
      </View>
    </ScrollView>
  );
};

const StatusMessage = ({ status, completed }) => {
  const [visible, setVisible] = useState(false);
  const sv = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: sv.value,
  }));

  useEffect(() => {
    sv.value = withDelay(500, withTiming(SCREEN_WIDTH));

    setTimeout(() => {
      sv.value = withTiming(0);
      completed();
    }, 4000);
  }, [status]);

  if (status === null) return null;

  return (
    <Animated.View
      style={[{ width: SCREEN_WIDTH }, animatedStyle]}
      className={`${
        status.status === "success" ? "bg-green-500" : "bg-red-500"
      } w-full h-10 absolute top-28 items-center justify-center overflow-hidden`}
    >
      <View style={{ width: SCREEN_WIDTH }} className="absolute items-center">
        <Text className="text-sm text-white font-medium">{status.message}</Text>
      </View>
    </Animated.View>
  );
};

export default AuthScreen;