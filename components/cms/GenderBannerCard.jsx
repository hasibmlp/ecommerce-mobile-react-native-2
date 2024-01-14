import { LinearGradient } from "expo-linear-gradient";
import { View, Text } from "react-native";
import { Image } from "expo-image";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function GenderBannerCard({
  gender,
  imageUrl,
  style,
  height = 150,
}) {
  return (
    <View
      style={[{ height: height }, style]}
      className=" justify-end bg-white mb-3 h-[150px] overflow-hidden"
    >
      {/* <Image
        className="w-full h-full absolute top-0 left-0"
        src={imageUrl}
      /> */}
      <View className="w-full h-full absolute top-0 left-0">
        <Image
          style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
          // className="flex-1 w-full bg-neutral-200"
          source={imageUrl}
          placeholder={blurhash}
          contentFit="cover"
          transition={100}
        />
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.20)", "rgba(0, 0, 0, 0.41)"]}
        className="w-full h-[70px] items-center justify-end"
      >
        <Text className="text-center text-[16px] text-white font-medium pb-[20px]">
          Shop {gender}
        </Text>
      </LinearGradient>
    </View>
  );
}
