import { View, Image, Text } from "react-native";

export default function CategoryImageBannerItem({title, image}) {
  return (
        <View className='w-[33%] h-full  justify-end'>
          <Image
            className="w-full h-full absolute top-0 left-0"
            source={image}
          />
          <View className='w-full h-[150px] items-center justify-end'>
            <Image className='absolute w-full h-full ' source={require("../assets/transBlack.png")} />
            <Text className='text-[16px] font-medium text-white pb-[20px] uppercase'>{title}</Text>
          </View>
        </View>
  );
}
