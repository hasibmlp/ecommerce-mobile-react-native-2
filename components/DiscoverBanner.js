import { View, Image, Text } from "react-native";
import DoubleScreenImage from "./DoubleScreenImage";

const images = [
  require("../assets/boys.jpg"),
  require("../assets/boys.jpg")
]

export default function DiscoverBanner({
  heading,
  title,
  subTitle,
  cta,
  desc,
  media,
}) {
  return (
    <View className="mb-3 bg-white flex-col">
      {/* <DoubleScreenImage images={images} /> */}
      <Image className="w-full h-[300px]" src={media[0].url} />
      <View className="items-center py-4 gap-1 ">
        <Text className="text-[18px] text-black font-normal">
          {subTitle}
        </Text>
        <Text className="text-[28px] text-black font-medium">
          {title}
        </Text>
        <Text className="text-[14px] text-black font-light w-[350px] text-center">
          {desc}
        </Text>
        <Text className="text-[14px] text-black font-medium uppercase underline">
          {cta}
        </Text>
      </View>
    </View>
  );
}
