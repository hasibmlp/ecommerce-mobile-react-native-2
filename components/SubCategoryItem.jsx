import { View, Text, Image } from "react-native";
// import { Image } from "expo-image";
import { FONT_FAMILY } from "../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function SubCategoryItem({ title, imgUrl }) {
  return (
    <View className=" items-center justify-end mb-3">
      <Image className="w-full h-[120px]" src={imgUrl} />

      <View className="w-full">
        <Text
          style={FONT_FAMILY.primary}
          className=" text-center text-[16px] text-black bg-white font-light py-4"
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
