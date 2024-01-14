import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/buttons/Button";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../makeVars/MakeVars";
import { useNavigation } from "@react-navigation/native";
import Panel from "../components/actions/Panel";
import {
  BellAlertIcon,
  BellIcon,
  ChevronRightIcon,
  GifIcon,
  GiftIcon,
  StarIcon,
  UserIcon,
} from "react-native-heroicons/outline";

const TAB_WIDTH = 100;
const TABS = ["Home", "Search", "Profile", "MoreOption"];

export default function MoreOptionScreen() {
  const navigation = useNavigation();
  const user = useReactiveVar(userVar);

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="w-full items-center bg-neutral-100">
        <View className="w-full bg-white px-3 py-5 shadow-sm z-10">
          <Text className="text-3xl font-light ">More</Text>
        </View>
        <ScrollView className="w-full h-full">
          <View className="mt-3">
            <Profile />

            <Panel
              style={{ marginTop: 12 }}
              leftIcon={<BellIcon size={24} color="black" />}
              rightIcon={<ChevronRightIcon size={24} color="black" />}
            >
              <View className="px-1">
                <Text className="text-sm text-balck font-medium">
                  Notification
                </Text>
                <Text className="text-xs text-black font-light">
                  Stay up to date on latest offers and more.
                </Text>
              </View>
            </Panel>

            <Panel
              style={{ marginTop: 12 }}
              leftIcon={<BellIcon size={24} color="black" />}
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
              leftIcon={<StarIcon size={24} color="black" />}
              rightIcon={<ChevronRightIcon size={24} color="black" />}
            >
              <View className="px-1">
                <Text className="text-sm text-balck font-medium">
                  My Favourites
                </Text>
                <Text className="text-xs text-black font-light">
                  Add favourites
                </Text>
              </View>
            </Panel>
            <Panel
              leftIcon={<GiftIcon size={24} color="black" />}
              rightIcon={<ChevronRightIcon size={24} color="black" />}
            >
              <View className="px-1">
                <Text className="text-sm text-balck font-medium">
                  Smile Rewards
                </Text>
                <Text className="text-xs text-black font-light">
                  Earn and Reward
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

const Profile = () => {
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
        <Panel
          onPress={() => navigation.navigate("ProfileScreen")}
          leftIcon={<ProfileIcon />}
          rightIcon={<ChevronRightIcon size={24} color="black" />}
        >
          <View className="px-1">
            <Text className="text-xl text-balck font-normal">
              Hello {user.firstName}
            </Text>
            <Text className="text-sm text-black font-light">{user.email}</Text>
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
