import { View, Image, Text } from "react-native";

export default function TripleeScreenImage({ images, titles }) {
  return (
    <View className="flex-row gap-2">
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          source={images[0]}
        />
        {titles && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {titles[0]}
            </Text>
          </View>
        )}
      </View>
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          source={images[1]}
        />
        {titles && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {titles[1]}
            </Text>
          </View>
        )}
      </View>
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          source={images[2]}
        />
        {titles && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {titles[2]}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
