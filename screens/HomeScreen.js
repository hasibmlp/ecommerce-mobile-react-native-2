import {
  Dimensions,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { CheckCircleIcon } from "react-native-heroicons/solid";
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
import { FONT_FAMILY } from "../theme";

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
    const opacity = interpolate(scrollY.value, [0, 40], [0, 1]);
    const zIndex = interpolate(scrollY.value, [0, 40], [0, 120]);
    return { opacity: opacity, zIndex };
  });

  const genderSelector1AnimatedStyle = useAnimatedStyle(() => {
    return {
      display: scrollY.value > 40 ? "flex" : "none",
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
            onPress={() => scrollY.value > 100 && setOpen(!open)}
            className="flex-row items-center justify-center px-5"
          >
            <Text
              style={FONT_FAMILY.primary}
              className="text-sm text-black font-normal mr-1 leading-4 uppercase"
            >
              Shop {gender}
            </Text>
            <ChevronDownIcon size={14} color="black" />
          </TouchableOpacity>
          <View className="flex-row px-3">
            <TouchableOpacity
              onPress={() => {
                scrollY.value > 100 &&
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
            <TouchableOpacity onPress={() => navigation.navigate('MoreOptionsScreen')} className="h-full justify-center px-1">
              <View className="bg-neutral-200 h-10 w-10 rounded-full items-center justify-center">
                {!user && <UserIcon color="black" size={24} />}
                {user && (
                  <Text
                    style={FONT_FAMILY.primary}
                    className="text-lg text-black text-normal"
                  >
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
            <TouchableOpacity
              onPress={() => setOpen(!open)}
              className="items-start h-full justify-center"
            >
              <GreetingCard user={user} />
              <View className="flex-row items-center justify-center mt-2">
                <Text
                  style={FONT_FAMILY.primary}
                  className="text-sm text-black font-normal mr-1 leading-4 uppercase"
                >
                  Shop {gender}
                </Text>
                <ChevronDownIcon size={14} color="black" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MoreOptionsScreen")}
              className="rounded-full bg-neutral-200 h-14 w-14 items-center justify-center"
            >
              {!user && <UserIcon color="black" size={24} />}
              {user && (
                <Text
                  style={FONT_FAMILY.primary}
                  className="text-xl text-black text-normal"
                >
                  {user.firstName.slice(0, 1)}
                  {user.lastName.slice(0, 1)}
                </Text>
              )}
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
              <Text
                style={FONT_FAMILY.primary}
                className="text-sm  text-black font-normal uppe"
              >
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
            <Text
              style={FONT_FAMILY.primary}
              className="text-[14px] font-normal text-gray-500 ml-[15px]"
            >
              Search
            </Text>
          </TouchableOpacity>

          <MemorizeMainContentV2 />
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const GreetingCard = ({user}) => {
  let timeOfDay
  const date = new Date()
  const hour = date.getHours()

  if(hour < 12) {
    timeOfDay = 'morning'
  }else if(hour >= 12 && hour <= 17)
    timeOfDay = 'afternoon'
  else 
    timeOfDay = 'evening'

  return (
    <Text style={FONT_FAMILY.primary} className="text-2xl text-black">
      Good {timeOfDay}! {user?.firstName}
    </Text>
  );
};

const MemorizeMainContentV2 = memo(MainContentV2);

export default HomeScreen;
