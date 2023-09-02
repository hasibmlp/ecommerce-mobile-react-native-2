import { View, Image } from "react-native";

export default function ImageBanner() {
  return (
    <View className='mb-3 h-[200px]'>
      <Image
        className="w-full h-full"
        source={require("../assets/banner.jpg")}
      />
    </View>
  );
}
