import { View, Image, Text } from "react-native";

export default function GenderBanner({ gender, imgUrl }) {
  return (
    <View className=" justify-end bg-white mb-3 h-[150px]">
      <Image
        className="w-full h-full absolute top-0 left-0"
        src={imgUrl}
      />
      <View className="w-full h-[150px] items-center justify-end">
        <Image
          className="absolute w-full h-full"
          source={require("../assets/transBlack.png")}
        />
        <Text className='text-center text-[16px] text-white font-medium pb-[20px]'>Shop {gender}</Text>
      </View>
    </View>
  );
}
