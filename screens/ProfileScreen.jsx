import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeftOnRectangleIcon } from "react-native-heroicons/outline";

import {
  cartVar,
  checkoutVisitedVar,
  isLoggedinFrstTimeVar,
  userVar,
} from "../makeVars/MakeVars";
import Button from "../components/buttons/Button";
import Panel from "../components/actions/Panel";
import { ScreenHeader } from "../components/actions/ScreenHeader";
import { useEffect, useState } from "react";
import { CREATE_CART } from "../graphql/mutations";
import AddressList from "../components/AddressList";
import { GET_CART_DETAILS_V2 } from "../graphql/queries";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";

const ProfileScreen = ({ route }) => {
  const user = useReactiveVar(userVar);
  const cart = useReactiveVar(cartVar);
  const intention = route.params?.intention;

  const [createCart, { data, loading, error }] = useMutation(CREATE_CART);
  const [getCartDetails, { data: cartDetailData, loading: cartDetailLoading }] =
    useLazyQuery(GET_CART_DETAILS_V2);

  const handleLogout = async () => {
    try {
      const cleanUpStorage = async () => {
        await AsyncStorage.removeItem("cart-id");
        cartVar(null);
        checkoutVisitedVar(false)
      };

      const setCart = async () => {
        try {
          const cartInput = {};

          await createCart({
            variables: {
              input: cartInput,
            },
            onCompleted: (data) => {
              console.log("CART CREATED SUCCEFULLY");
              const set = async () => {
                if (data?.cartCreate?.cart?.id) {
                  try {
                    await AsyncStorage.setItem(
                      "cart-id",
                      data?.cartCreate?.cart?.id
                    );
                    console.log("CART ID SET TO ASYNC STORAGE");
                  } catch (e) {
                    console.log("Error setting cart ID in AsyncStorage:", e);
                  }
                }
              };
              set();
            },
          });
        } catch (e) {
          console.log("Error setting up the cart: ", e);
        }
      };

      const getCart = async () => {
        const cartId = await AsyncStorage.getItem("cart-id");

        console.log("CART ID IN GETTING CART: ", cartId);
        if (cartId) {
          console.log("FETCHING CART CODE ABOUT RUN");
          getCartDetails({
            variables: {
              cartId: cartId,
            },
            onCompleted: async (data) => {
              console.log("cart details fetched successfully from profile");
              cartVar(await data?.cart);
              await AsyncStorage.removeItem("my-key");
              userVar(null);
            },
          });
        }
      };

      const initializeCart = async () => {
        await setCart();
        await getCart();
      };

      const initilalizeLogout = async () => {
        await cleanUpStorage();
        await initializeCart();
      };

      initilalizeLogout();
    } catch (e) {
      console.log("log out failed!");
    }
  };

  useEffect(() => {
    if (intention === "logout") {
      handleLogout();
    }
  }, [intention]);

  console.log("CART DETAILS FROM PROFILE: ", cartDetailData);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading && <LoadingFullScreen />}
      {cartDetailLoading && <LoadingFullScreen />}
      <ScrollView className="bg-neutral-100">
        <View className="flex-1 bg-neutral-100 ">
          <ScreenHeader title="Personal Information" />
          <View className="w-full p-8 items-center bg-white mt-32 ">
            <View className=" border-4 border-[#fff] absolute -top-10 rounded-full">
              <View className="w-20 h-20 rounded-full bg-neutral-200"></View>
            </View>
            <Text className="text-xl text-balck font-normal mt-4">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-sm text-black font-light">{user?.email}</Text>
            <Button style={{ marginTop: 12 }} label="Edit" type="action" />
          </View>

          <InformationContainer />

          <Panel
            onPress={handleLogout}
            style={{ marginTop: 12 }}
            alignment="center"
          >
            <View className="flex-row items-center">
              <ArrowLeftOnRectangleIcon size={28} color="black" />
              <Text className="text-lg font-normal ml-1">Log out</Text>
            </View>
          </Panel>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const InformationContainer = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <View className="mt-3">
      <View className="w-full flex-row">
        <Pressable
          onPress={() => setActiveTab("add")}
          className={`flex-1 items-center py-4`}
        >
          <Text
            className={`${
              activeTab === "add" ? "text-black" : "text-neutral-500"
            }`}
          >
            My Addresses
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("card")}
          className={`flex-1 items-center py-4`}
        >
          <Text
            className={`${
              activeTab === "card" ? "text-black" : "text-neutral-500"
            }`}
          >
            My Cards
          </Text>
        </Pressable>
      </View>

      <View className="">
        {activeTab === "add" && <AddressList />}
        {activeTab === "card" && (
          <Panel alignment="center" label="No Card Information" />
        )}
      </View>
    </View>
  );
};
