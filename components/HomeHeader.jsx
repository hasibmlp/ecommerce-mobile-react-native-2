import { CommonActions, useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";

export default function HomeHeader() {
  const navigation = useNavigation();
  return (
    <Pressable className="mb-3 pt-[70]" >
      <View className="flex-row p-3 items-center">
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
