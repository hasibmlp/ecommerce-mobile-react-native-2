import {
  Text,
  View,
  Dimensions,
} from "react-native";


const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function GenderSelector() {


  return (
    <View
      style={{ borderBottomStartRadius: 180, borderBottomEndRadius: 180 }}
      className="absolute top-[60px] z-10 w-full h-[170px] bg-gray-100 overflow-hidden scale-x-[2.4] "
    >
      <View className="flex-1 items-center justify-center scale-x-[.42]">
        <View className="p-4 absolute w-[100%] z-10 bg-gray-100 mt-16">
          <View className="border-b-[.5px] border-gray-400">
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Women
            </Text>
          </View>
          <View className="border-b-[.5px] border-gray-400">
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Men
            </Text>
          </View>
          <View className="border-b-[.5px] border-gray-400">
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Kids
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
