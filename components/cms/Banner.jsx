import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image } from "react-native";
// import { Image } from "expo-image";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function Banner({ content }) {
  return (
    <View
      style={[{ height: content.data.height || 250 }]}
      className=" justify-end bg-white mb-3 h-[150px] overflow-hidden"
    >
      <Image
        className="w-full h-full absolute top-0 left-0"
        src={content.data.image.url}
      />
      {content.data.image.title && (
        <LinearGradient
          colors={["transparent", "rgba(0, 0, 0, 0.20)", "rgba(0, 0, 0, 0.41)"]}
          className="w-full h-[70px] items-center justify-end"
        >
          <Text style={FONT_FAMILY.primary} className="text-center text-[16px] text-white font-normal pb-[20px]">
            {content.data.image.title}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
}
