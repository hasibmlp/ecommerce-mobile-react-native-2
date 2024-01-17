import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { CheckCircleIcon } from "react-native-heroicons/solid";

import GenderSelector from "../components/GenderSelector";
import GreetingHeader from "../components/GreetingHeader";
import MainContentV2 from "../components/MainContentV2";
import { userVar } from "../makeVars/MakeVars";
import { useReactiveVar } from "@apollo/client";
import Overlay from "../components/Overlay";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { selectGender } from "../redux/features/gender/genderSlice";

const SCREEN_WIDTH = Dimensions.get("screen").width;

const HomeScreen = () => {
  const user = useReactiveVar(userVar);

  console.log("USER LOGGED IN HOME SCREEN : ", user?.email);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const gender = useSelector((state) => state.gender.current);
  const scrollY = useSharedValue(0);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const offset = useSharedValue(-190);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  const screenHeaderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1]);
    return { opacity: opacity };
  });

  const genderSelector1AnimatedStyle = useAnimatedStyle(() => {
    return {
      display: scrollY.value > 100 ? "flex" : "none",
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  useEffect(() => {
    offset.value = withTiming(open ? 0 : -190);
  }, [open]);

  return (
    <View className="flex-1">
      <SafeAreaView className="bg-neutral-50 z-20" />
      {/* <MainHeader /> */}
      <View className="flex-1">
        <Animated.View
          style={screenHeaderAnimatedStyle}
          className="absolute top-0 w-full h-12 flex-row bg-neutral-50 z-20 justify-between"
        >
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            className="flex-row items-center justify-center px-5"
          >
            <Text className="text-sm text-black font-normal mr-1 leading-4 uppercase">
              Shop {gender}
            </Text>
            <ChevronDownIcon size={14} color="black" />
          </TouchableOpacity>
          <View className="flex-row px-3">
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "SearchScreens",
                      },
                    ],
                  })
                );
              }}
              className=" h-full justify-center px-3 mr-2"
            >
              <MagnifyingGlassIcon color="black" size={24} />
            </TouchableOpacity>
            <TouchableOpacity className="h-full justify-center px-1">
              <View className="bg-neutral-200 h-8 w-8 rounded-full items-center justify-center">
                {!user && <UserIcon color="black" size={24} />}
                {user && (
                  <Text className="text-lg text-black text-medium">
                    {user.firstName.slice(0, 1)}
                    {user.lastName.slice(0, 1)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {scrollY.value > 100 && (
          <Animated.View
            style={[genderSelector1AnimatedStyle, animatedStyle]}
            className="h-[190] absolute top-12 z-10 left-0 w-full bg-neutral-50 rounded-b-3xl"
          >
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("women"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between border-b border-neutral-200"
            >
              <Text className="text-sm  text-black font-medium uppe">
                Shop Women
              </Text>
              {gender === "women" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("men"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between border-b border-neutral-200"
            >
              <Text className="text-sm  text-black font-medium uppe">
                Shop Men
              </Text>
              {gender === "men" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("kids"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between"
            >
              <Text className="text-sm  text-black font-medium uppe">
                Shop Kids
              </Text>
              {gender === "kids" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          className="bg-neutral-50"
          onScrollBeginDrag={() => setOpen(false)}
        >
          <View className="h-20 w-full bg-neutral-50 z-[99] px-4 flex-row items-center justify-between">
            <View
              style={{ width: SCREEN_WIDTH }}
              className="absolute bottom-full w-full h-[250] bg-neutral-50 z-50"
            ></View>
            <Pressable onPress={() => setOpen(!open)} className="items-start h-full justify-center">
              <Text style={{fontFamily: 'Nexa-Regular'}} className="text-2xl text-black">
                Good evening! {user?.firstName}
              </Text>
              <View className="flex-row items-center justify-center mt-2">
                <Text style={{fontFamily: 'Nexa-Regular'}} className="text-sm text-black font-normal mr-1 leading-4 uppercase">
                  Shop {gender}
                </Text>
                <ChevronDownIcon size={14} color="black" />
              </View>
            </Pressable>
            <TouchableOpacity className="h-full justify-center px-1 ">
              <View className="bg-neutral-200 h-12 w-12 rounded-full items-center justify-center">
                {!user && <UserIcon color="black" size={24} />}
                {user && (
                  <Text  className="text-xl text-black text-medium">
                    {user.firstName.slice(0, 1)}
                    {user.lastName.slice(0, 1)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={animatedStyle}
            className="h-[190px] absolute top-20 z-50 left-0 w-full bg-neutral-50 rounded-b-3xl"
          >
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("women"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between border-b border-neutral-200"
            >
              <Text style={{fontFamily: 'Nexa-Regular'}} className="text-sm  text-black font-medium uppe">
                Shop Women
              </Text>
              {gender === "women" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("men"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between border-b border-neutral-200"
            >
              <Text style={{fontFamily: 'Nexa-Regular'}} className="text-sm  text-black font-medium uppe">
                Shop Men
              </Text>
              {gender === "men" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(selectGender("kids"));
                setOpen(false);
              }}
              className="w-full px-4 h-14 bg-neutral-50 flex-row items-center justify-between"
            >
              <Text style={{fontFamily: 'Nexa-Regular'}} className="text-sm  text-black font-medium uppe">
                Shop Kids
              </Text>
              {gender === "kids" && (
                <CheckCircleIcon size={24} color="#4baaca" />
              )}
            </TouchableOpacity>
          </Animated.View>

          <Overlay state={open} setState={() => setOpen(false)} />

          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: "SearchScreens",
                    },
                  ],
                })
              );
            }}
            className="h-[50px] flex flex-row bg-white items-center rounded-[10px] flex-1 pl-2 mx-3 mb-3"
          >
            <MagnifyingGlassIcon size={22} color="black" strokeWidth={1} />
            <Text className="text-[14px] font-normal text-gray-500 ml-[15px]">
              Search
            </Text>
          </TouchableOpacity>

          <MemorizeMainContentV2 />
        </Animated.ScrollView>
      </View>
    </View>
  );
};


const MemorizeMainContentV2 = memo(MainContentV2);

export default HomeScreen;
