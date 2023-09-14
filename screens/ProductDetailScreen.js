import { useLayoutEffect, useRef, useSate, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  HeartIcon,
  ClockIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "react-native-heroicons/outline";
import ShowAndHide from "../components/ShowAndHide";
const images = [
  require("../assets/boys.jpg"),
  require("../assets/boys.jpg"),
  require("../assets/boys.jpg"),
];

const screen_width = Dimensions.get("screen").width;
const screen_height = Dimensions.get("screen").height;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

export default function ProductDetailScreen() {
  const [bottomAction, setBottomAction] = useState(null);

  const topEdge = bottomAction?.y;

  console.log(bottomAction);
  console.log(topEdge);

  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View>
      <ScrollView bounces={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-[40px] w-[40px] items-center justify-center rounded-full bg-white absolute z-[1] left-[20px] top-[50px]"
        >
          <ChevronLeftIcon size={20} color="black" />
        </TouchableOpacity>

        <FlatList
          horizontal
          data={images}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <Image
                style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
                className="h-[600px]"
                source={item}
              />
            );
          }}
        />

        <View className="pb-[100px]">
          <View className="items-center gap-[8px] py-[10px]">
            <TouchableOpacity className="bg-white h-[50px] w-[50px] rounded-full items-center justify-center absolute z-1 right-[15px] -top-[25px]">
              <HeartIcon color="black" size={30} strokeWidth={1} />
            </TouchableOpacity>
            <View className="py-[5px] w-full max-w-[100px] bg-[#ddd] rounded-[2px] items-center">
              <Text className="text-[11px] text-black uppercase">
                new season
              </Text>
            </View>
            <Text className="text-[20px] font-medium text-black">
              Boucheron
            </Text>
            <Text className="text-[14px] font-normal text-black">
              this is amzing product with beautiful patters, 12mm
            </Text>
            <Text className="text-[18px] font-light text-red-800">
              12,00 AED
            </Text>
          </View>

          <Pressable className="border-t border-gray-300 py-2">
            <Text className="text-[11px] text-black font-medium uppercase text-center ">
              size
            </Text>
            <View className="flex-row items-center justify-center gap-x-1 mt-3">
              <Text className="text-[18px] text-black font-light uppercase">
                26 eu
              </Text>
              <ChevronDownIcon size={14} color="black" />
            </View>
          </Pressable>

          <TouchableOpacity className=" border py-5 border-gray-300">
            <View className="flex-row gap-x-2 justify-center items-center">
              <TruckIcon size={26} strokeWidth={1} color="black" />
              <Text className="text-[14px] font-normal text-black uppercase">
                shipping from uae
              </Text>
            </View>
            <View className="flex-row justify-center items-center gap-x-2 mt-3">
              <Text className="text-[14px] font-normal text-black">
                Next day delevery to
              </Text>
              <Text className="text-[14px] font-normal text-red-800 underline">
                Abudhabi
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex gap-y-4 py-5 px-4">
            <View className="flex-row gap-x-1 items-center justify-center">
              <ClockIcon size={20} color="red" />
              <Text className="text-[13px] text-red-500 font-normal">
                Low in stock: only 1 left
              </Text>
            </View>
            <TouchableOpacity className="flex items-center justify-center py-4 w-full bg-red-400 rounded-[5px]">
              <Text className="text-[14px] text-white font-normal uppercase">
                Add to bag
              </Text>
            </TouchableOpacity>
          </View>

          <ShowAndHide title="Editor's advice" />
          <ShowAndHide title="Size & Fit" />
          <ShowAndHide title="Delivery % Free Returns" />

          

        </View>
      </ScrollView>

      {/* {bottomAction && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-1, 0, topEdge -1  , topEdge, topEdge + 1 ],
                  outputRange: [0, 0, 0, 0, -1],
                }),
              },
            ],
          }}
          className="items-center justify-center gap-[15px] bg-white h-[140px] px-[15px] absolute bottom-0 left-0 right-0"
        >
          <View className="flex-row gap-[5px]">
            <ClockIcon size={16} color="red" />
            <Text className="text-[14px] font-normal text-red-500">
              Low in stock: only 1 left
            </Text>
          </View>
          <TouchableOpacity className="self-stretch bg-red-800 h-[50px] justify-center items-center rounded-full">
            <Text className="text-[16px] text-white font-medium uppercase">
              Add to bag
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )} */}
    </View>
  );
}
