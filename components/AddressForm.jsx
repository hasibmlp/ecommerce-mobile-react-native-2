import { Formik } from "formik";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChevronDownIcon,
  MapIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import MyModal from "./Modal/MyModal";
import LoadingFullScreen from "./Sidebar/LoadingFullScreen";
import { GET_CUSTOMER, GET_SHIPPING_COUNTRIES } from "../graphql/queries";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import RadioButton from "./buttons/RadioButton";
import { userVar } from "../App";
import Button from "./buttons/Button";
import {
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} from "../graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "./Sidebar/Buttons/Checkbox";

const AddressForm = ({ onClose, formData }) => {
  const user = useReactiveVar(userVar);
  const [userToken, setUserToken] = useState(null);

  console.log(userToken);

  useEffect(() => {
    const getToken = async () => {
      try {
        token = await AsyncStorage.getItem("my-key");
        if (token) {
          setUserToken(token);
        } else {
          setUserToken(null);
        }
      } catch (e) {
        console.log("Error getting user token: ", e);
      }
    };
    getToken();
  }, [user]);

  const [customerAddressCreate, { data, loading, error }] = useMutation(
    CUSTOMER_ADDRESS_CREATE
  );

  const [
    defaultAddressUpdate,
    {
      data: defaultAddressUpdateData,
      loading: defaultAddressUpdateLoading,
      error: defaultAddressUpdateError,
    },
  ] = useMutation(CUSTOMER_DEFAULT_ADDRESS_UPDATE);

  const [
    addressUpdate,
    {
      data: addressUpdateData,
      loading: addressUpdateLoading,
      error: addressUpdateError,
    },
  ] = useMutation(CUSTOMER_ADDRESS_UPDATE);

  const [
    addressDelete,
    {
      data: addressDeleteData,
      loading: addressDeleteLoading,
      error: addressDeleteError,
    },
  ] = useMutation(CUSTOMER_ADDRESS_DELETE);

  const handleFormSubmit = (values) => {
    const shippingAddress = { ...values };
    shippingAddress.country = "United Arab Emirates";
    delete shippingAddress.defaultAddress;

    console.log("default address", values);

    if (values?.defaultAddress) {
      defaultAddressUpdate({
        variables: {
          addressId: formData?.id,
          customerAccessToken: userToken,
        },
      });
    }

    if (formData === "new") {
      customerAddressCreate({
        variables: {
          customerAccessToken: userToken,
          address: shippingAddress,
        },
        onCompleted: (data) => {
          onClose();
        },
        refetchQueries: [
          {
            query: GET_CUSTOMER,
            variables: {
              customerAccessToken: userToken,
            },
          },
        ],
      });
    } else {
      addressUpdate({
        variables: {
          address: shippingAddress,
          customerAccessToken: userToken,
          id: formData?.id,
        },
        onCompleted: () => {
          onClose();
        },
        refetchQueries: [
          {
            query: GET_CUSTOMER,
            variables: {
              customerAccessToken: userToken,
            },
          },
        ],
      });
    }
  };

  const handleAddressDelete = () => {
    addressDelete({
      variables: {
        customerAccessToken: userToken,
        id: formData?.id,
      },
      onCompleted: () => {
        onClose();
      },
      refetchQueries: [
        {
          query: GET_CUSTOMER,
          variables: {
            customerAccessToken: userToken,
          },
        },
      ],
    });
  };

  console.log(data);
  console.log(loading);
  console.log(error);

  return (
    <ScrollView className="flex-1">
      <View className="flex-row w-full h-10 items-center">
        <TouchableOpacity onPress={onClose} className=" p-2 absolute right-5">
          <XMarkIcon size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          city: formData.city,
          province: formData.province,
          address1: formData.address1,
          address2: formData.address2,
          zip: formData.zip,
          phone: formData.phone,
          defaultAddress: formData.id === user?.defaultAddress?.id,
        }}
        onSubmit={handleFormSubmit}
      >
        {({
          handleBlur,
          handleChange,
          handleReset,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View className="flex-1">
            <View className="px-4 py-3 bg-gray-100 ">
              <Text className="text-[13px] text-gray-500 font-medium uppercase">
                Shipping Address
              </Text>
            </View>

            {loading && <LoadingFullScreen />}
            {addressUpdateLoading && <LoadingFullScreen />}
            {addressDeleteLoading && <LoadingFullScreen />}

            <ShippingAddressForm
              formData={formData}
              errors={errors}
              touched={touched}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />

            <TouchableOpacity
              className="bg-blue-400 py-4 rounded-[5px] mx-4 mt-5"
              onPress={handleSubmit}
            >
              <Text className="text-[15px] text-white font-medium text-center uppercase">
                save and continue
              </Text>
            </TouchableOpacity>

            {formData !== "new" && (
              <Button
                onPress={handleAddressDelete}
                style={{ marginTop: 22 }}
                label="remove address"
                type="action"
                flex={false}
              />
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default AddressForm;

const ShippingAddressForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  formData,
  setFieldValue,
}) => {
  const user = useReactiveVar(userVar);
  const [countryModal, setCountryModal] = useState(false);

  const { data, error, loading } = useQuery(GET_SHIPPING_COUNTRIES);

  const handleCountrySelect = (value) => {
    setFieldValue("country", value);
    setCountryModal(false);
  };

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
        {errors.phone && touched.phone ? (
          <View className="bg-red-500 py-2 px-4">
            <Text className="text-[14px] text-white font-medium ">
              {errors.phone}
            </Text>
          </View>
        ) : null}

        <View className="px-4 py-3 border-b border-gray-100 bg-white">
          <Text
            className={`text-[16px] ${
              errors.phone && touched.phone ? "text-red-500" : "text-black"
            } font-medium mb-1`}
          >
            Phone*
          </Text>
          <TextInput
            onChangeText={handleChange("phone")}
            onBlur={handleBlur("phone")}
            placeholder="e.g +971505050505"
            className="text-[16px] text-black font-normal"
            value={values.phone}
          />
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

        <Pressable
          onPress={() => setCountryModal(true)}
          className="px-4 py-3 border-b border-gray-100 bg-white"
        >
          <Text
            className={`text-[16px] ${
              errors.country && touched.country ? "text-red-500" : "text-black"
            } font-medium mb-1`}
          >
            Country*
          </Text>
          {/* <TextInput
                      onChangeText={handleChange("country")}
                      onBlur={handleBlur("country")}
                      placeholder="United Arab Emirates"
                      className="text-[16px] text-black font-normal"
                      value={values.country}
                    /> */}
          <View className="flex-row justify-between">
            <Text className="text-[16px] text-black font-normal">
              {values.country || "Select country*"}
            </Text>
            <ChevronDownIcon size={20} color="black" />
          </View>
        </Pressable>

        <MyModal
          slide="toUp"
          visible={countryModal}
          onClose={() => setCountryModal(false)}
        >
          <View className="flex-1 bg-neutral-100">
            {loading && <LoadingFullScreen />}
            <View className="bg-white h-10 items-center flex-row border-b border-neutral-200">
              <View className="flex-1 flex-row">
                <View className="p-3">
                  <MapIcon size={24} color="black" />
                </View>
                <TextInput placeholder="Search Country" />
              </View>
              <Pressable
                onPress={() => setCountryModal(false)}
                className="px-3 items-center justify-center border-l border-neutral-300"
              >
                <Text className="text-base text-black font-normal">Cancel</Text>
              </Pressable>
            </View>
            {data && (
              <ScrollView className="">
                {data.shop.shipsToCountries.map((item) => (
                  <Pressable
                    onPress={() => handleCountrySelect("United Arab Emirates")}
                    key={item}
                    className="bg-white w-full h-12 justify-center px-3 border-b border-neutral-200"
                  >
                    <Text className="text-base">{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </MyModal>
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
              errors.city && touched.city ? "text-red-500" : "text-black"
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
        <Text className={`text-[16px] text-black font-medium mb-1`}>Zip</Text>
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

        {formData !== "new" && (
          <Pressable
            onPress={() =>
              setFieldValue("defaultAddress", !values.defaultAddress)
            }
            className="flex-row items-center px-4 mt-3"
          >
            <CheckBox active={values.defaultAddress} />
            <Text className="text-base ml-2">Set this as default address</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
