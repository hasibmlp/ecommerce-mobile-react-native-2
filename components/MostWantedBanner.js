import { View, Image, Text } from "react-native";

export default function MostWantedBanner() {
  return (
    <View className="mb-3 items-center bg-white">
        <Text className='text-[22px] text-black font-light py-[15px]'>Most Wanted</Text>
      <View className="flex-row">
        <Image
          className="w-full h-[300px]"
          source={require("../assets/wanted.avif")}
        />
      </View>
      <View className="items-center py-4 gap-3">
        <Text className="text-[14px] text-black font-light w-[350px] text-center">
          Celebrities Emirati Women's Day with our Dedicated
        </Text>
        <Text className="text-[12px] text-red-800 font-medium uppercase underline">
          Discover Now
        </Text>
      </View>
    </View>
  );
}
