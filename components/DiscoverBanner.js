import { View, Image, Text } from "react-native";

export default function DiscoverBanner() {
  return (
    <View className="mb-3 bg-white">
      <View className="flex-row gap-2">
        <Image
          className="w-[50%] h-[300px]"
          source={require("../assets/boys.jpg")}
        />
        <Image
          className="w-[50%] h-[300px]"
          source={require("../assets/boys.jpg")}
        />
      </View>
      <View className="items-center py-4 gap-1">
        <Text className="text-[18px] text-black font-normal">
          Emirati Heirlooms:
        </Text>
        <Text className="text-[28px] text-black font-medium">
          A Timeless Legacy
        </Text>
        <Text className="text-[14px] text-black font-light w-[350px] text-center">
          Celebrities Emirati Women's Day with our Dedicated elegance look for
          the season and beyond
        </Text>
        <Text className="text-[14px] text-black font-medium uppercase underline">
          Discover Now
        </Text>
      </View>
    </View>
  );
}
