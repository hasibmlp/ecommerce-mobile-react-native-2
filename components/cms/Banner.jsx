import { LinearGradient } from "expo-linear-gradient";
import { View, Image, Text } from "react-native";

export default function Banner({content}) {
  return (
    <View style={[{height: content.data.height || 250}]} className=" justify-end bg-white mb-3 h-[150px] overflow-hidden">
      <Image
        className="w-full h-full absolute top-0 left-0"
        src={content.data.image.url}
      />
     {content.data.image.title && (<LinearGradient
      colors={['transparent', 'rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.41)']}
      className="w-full h-[70px] items-center justify-end">
        <Text className='text-center text-[16px] text-white font-medium pb-[20px]'>{content.data.image.title}</Text>
      </LinearGradient>)}
    </View>
  );
}
