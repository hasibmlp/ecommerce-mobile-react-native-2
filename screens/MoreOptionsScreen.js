import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/buttons/Button";
import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { cartVar, checkoutVisitedVar, userVar } from "../makeVars/MakeVars";
import { useNavigation } from "@react-navigation/native";
import Panel from "../components/actions/Panel";
import {
  BellAlertIcon,
  BellIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  GifIcon,
  GiftIcon,
  MapIcon,
  StarIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { GET_CART_DETAILS_V2 } from "../graphql/queries";
import { CREATE_CART } from "../graphql/mutations";
import LoadingFullScreen from "../components/Sidebar/LoadingFullScreen";

const TAB_WIDTH = 100;
const TABS = ["Home", "Search", "Profile", "MoreOption"];

export default function MoreOptionScreen() {
  const navigation = useNavigation();
  const user = useReactiveVar(userVar);
  // const [ loading, setLoading ] = useState(false)

  const [createCart, { data, loading, error }] = useMutation(CREATE_CART);
  const [getCartDetails, { data: cartDetailData, loading: cartDetailLoading }] =
    useLazyQuery(GET_CART_DETAILS_V2, {
      fetchPolicy: "no-cache",
    });

  const handleLogout = async () => {
    try {
      const cleanUpStorage = async () => {
        await AsyncStorage.removeItem("cart-id");
        cartVar(null);
        checkoutVisitedVar(false);
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

  return (
    <SafeAreaView className="flex-1 bg-white ">
      {cartDetailLoading || loading && <LoadingFullScreen />}
      <View className="w-full items-center bg-neutral-100">
        <View className="w-full bg-white px-3 py-5 shadow-sm z-10">
          <Text className="text-3xl font-light ">More</Text>
        </View>
        <ScrollView className="w-full h-full">
          <View className="mt-3">
            <Profile onLogout={handleLogout} />

            <Panel
            onPress={() => navigation.navigate("ProfileOrdersScreen")}
              style={{ marginTop: 12 }}
              leftIcon={<CheckBadgeIcon size={24} color="black" />}
              rightIcon={<ChevronRightIcon size={24} color="black" />}
            >
              <View className="px-1">
                <Text className="text-sm text-balck font-medium">
                  My Orders
                </Text>
                <Text className="text-xs text-black font-light">
                  Track and Return
                </Text>
              </View>
            </Panel>
            <Panel
              onPress={() => navigation.navigate("ProfileAddressScreen")}
              leftIcon={<MapIcon size={24} color="black" />}
              rightIcon={<ChevronRightIcon size={24} color="black" />}
            >
              <View className="px-1">
                <Text className="text-sm text-balck font-medium">
                  My Addresses
                </Text>
                <Text className="text-xs text-black font-light">
                  Add favourites
                </Text>
              </View>
            </Panel>
          </View>
        </ScrollView>
        {/* <Text className="text-lg mb-3">hello</Text>
        {user && (<Button style={{backgroundColor: 'red'}} colors={['#ff2800']} textColors={["#ffffff"]} onPress={handleLogout} label="log out" flex={false} />)}
        {user === null && (<Button onPress={() => navigation.navigate("AuthScreen")} label="log in" flex={false} />)} */}
      </View>
    </SafeAreaView>
  );
}

const Profile = ({onLogout}) => {
  const navigation = useNavigation();
  const user = useReactiveVar(userVar);
  return (
    <View className="w-full">
      {!user && (
        <Panel
          onPress={() => navigation.navigate("AuthScreen")}
          leftIcon={<UserIcon size={28} color="black" />}
          rightIcon={<ChevronRightIcon size={24} color="black" />}
        >
          <View className="px-1">
            <Text className="text-sm text-balck font-medium">
              Login / Register
            </Text>
            <Text className="text-xs text-black font-light">
              For faster checkout
            </Text>
          </View>
        </Panel>
      )}

      {user && (
        <Panel leftIcon={<ProfileIcon />}>
          <View className="px-1">
            <Text className="text-xl text-balck font-normal">
              Hello {user.firstName}
            </Text>
            <Text className="text-sm text-black font-light">{user.email}</Text>
            <TouchableOpacity onPress={onLogout}>
              <Text className="text-base text-red-500 font-light">Log out</Text>
            </TouchableOpacity>
          </View>
        </Panel>
      )}
    </View>
  );
};

const ProfileIcon = () => {
  return (
    <View className="w-20 h-20 rounded-full bg-neutral-200 overflow-hidden">
      <Image className="w-full h-full" />
    </View>
  );
};
