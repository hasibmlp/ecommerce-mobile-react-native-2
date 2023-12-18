import { Text, View, Dimensions, Pressable, Alert } from "react-native";
import {
  BellIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon
} from "react-native-heroicons/outline";

import InfoSlider from "./cms/InfoSlider";
import { useSelector } from "react-redux";
import SearchInput from "./SearchInput";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function HomeHeader({handleToggleMenu, value}) {

  

  return (
    <Pressable className="mb-3" onPress={() => handleToggleMenu(!value)}>
      

      <View className="flex-row gap-[10px] px-[15px] pt-[70px]">
        
        <View className="h-[50px] flex flex-row bg-white items-center rounded-[10px] flex-1 pl-2">
          <MagnifyingGlassIcon size={22} color='black' strokeWidth={1} />
          <Text className="text-[14px] font-normal text-gray-500 ml-[15px]">
            Search
          </Text>
        </View>
        {/* <SearchInput text={'Search'} size={14} /> */}
        <View className="h-[50px] w-[50px] rounded-[10px] bg-white justify-center items-center">
          <BellIcon size={24} color="black" />
        </View>
      </View>
      
    </Pressable>
  );
}
