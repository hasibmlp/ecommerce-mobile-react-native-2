import { View, Image, Text } from "react-native";

export default function ContentBanner() {
  return (
    <View className=" justify-start bg-white mb-3 h-[350px]">
      <Image
        className="w-full h-full absolute top-0 left-0"
        source={require("../assets/boutique1.jpeg")}
      />
      <View className="w-full items-start ml-5 mt-4">
        <Text className='text-start w-full text-[36px] text-black font-normal uppercase tracking-[4px]'>Reformation's </Text>
        <Text className='text-start w-full text-[20px] text-black font-normal'>Romatic Flair </Text>
        <Text className='text-start w-[200px] text-[13px] text-black font-normal mt-2'>Discover dresses of the moment and sought - after new pieces by the Los-Angeles label </Text>
        <Text className='text-start w-full text-[13px] text-black font-normal uppercase underline mt-2'>shop now</Text>
      </View>
    </View>
  );
}
