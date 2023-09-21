import { View, Image, Text } from "react-native";

export default function TripleeScreenImage({ images }) {
  return (
    <View className="flex-row gap-2">
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          src={images[0].url}
        />
        {images[0].title && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {images[0].title}
            </Text>
          </View>
        )}
      </View>
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          src={images[1].url}
        />
        {images[1].title && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {images[1].title}
            </Text>
          </View>
        )}
      </View>
      <View className="w-[32%] h-[230px] justify-end">
        <Image
          className="w-full h-full absolute left-0 top-0"
          src={images[2].url}
        />
        {images[2].title && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/transBlack.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {images[2].title}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
