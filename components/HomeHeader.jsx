import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";

export default function HomeHeader({ handleToggleMenu, value }) {
  const navigation = useNavigation();
  return (
    <Pressable className="mb-3" onPress={() => handleToggleMenu(!value)}>
      <View className="flex-row gap-[10px] px-[15px] pt-[70px]">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SearchScreens", { openSearchInput: true })
          }
          className="h-[50px] flex flex-row bg-white items-center rounded-[10px] flex-1 pl-2"
        >
          <MagnifyingGlassIcon size={22} color="black" strokeWidth={1} />
          <Text className="text-[14px] font-normal text-gray-500 ml-[15px]">
            Search
          </Text>
        </TouchableOpacity>
        {/* <SearchInput text={'Search'} size={14} /> */}
        {/* <View className="h-[50px] w-[50px] rounded-[10px] bg-white justify-center items-center">
          <BellIcon size={24} color="black" />
        </View> */}
      </View>
    </Pressable>
  );
}
