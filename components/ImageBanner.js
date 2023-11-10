import { View, Image } from "react-native";

export default function ImageBanner({imgUrl, height}) {
  return (
    <View className={`mb-3 h-[${height}px]`}>
      <Image
        className="w-full h-full"
        src={imgUrl}
      />
    </View>
  );
}
