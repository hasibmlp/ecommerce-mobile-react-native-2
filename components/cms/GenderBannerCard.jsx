import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image } from "react-native";
import { FONT_FAMILY } from "../../theme";

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
      <Image
        className="w-full h-full absolute top-0 left-0"
        src={imageUrl}
      />
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.20)", "rgba(0, 0, 0, 0.41)"]}
        className="w-full h-[70px] items-center justify-end"
      >
        <Text style={FONT_FAMILY.primary} className="text-center text-[16px] text-white font-normal pb-[20px]">
          Shop {gender}
        </Text>
      </LinearGradient>
    </View>
  );
}
