import { Text, View, Dimensions } from "react-native";
import {
  BellIcon,
  HeartIcon,
  ChevronDownIcon,
} from "react-native-heroicons/outline";

import InfoSlider from "./InfoSlider";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function HomeHeader() {
  return (
    <View className='mb-3'>
      <View className="flex-row justify-between px-[15px] py-[5px]">
        <View className="items-start">
          <Text className="text-[20px] font-normal text-black ml-[15px] mb-2">
            Good Morning!
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[14px] font-normal text-black ml-[15px] mr-2">
              Shop Women
            </Text>
            <ChevronDownIcon size={16} color="black" />
          </View>
        </View>
        <View className="h-[42px] w-[42px] rounded-full bg-white justify-center items-center">
          <HeartIcon size={24} color="black" />
        </View>
      </View>

      <View className="flex-row gap-[10px] px-[15px] py-[10px]">
        <View className="h-[42px] bg-white justify-center rounded-[10px] flex-1">
          <Text className="text-[14px] font-normal text-black ml-[15px]">
            Search
          </Text>
        </View>
        <View className="h-[42px] w-[42px] rounded-[10px] bg-white justify-center items-center">
          <BellIcon size={24} color="black" />
        </View>
      </View>

      <InfoSlider />
    </View>
  );
}
