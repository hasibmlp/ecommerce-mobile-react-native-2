import { FlatList, Text, View, Image, SafeAreaView, ScrollView } from "react-native";


export function Card({product}) {
    return (
      <View className="w-[130px] justify-center mr-[10px]">
        <View className='w-full h-[190px] overflow-hidden rounded-[2px]'>
            <Image
            className="h-full w-full"
            src={product.featuredImage.url}
            />
        </View>
        <View className="bg-white items-center gap-[5px]">
          <Text className="text-[13px] font-normal text-black">{product.vendor}</Text>
          <Text numberOfLines={1} className="text-[12px] font-normal text-black w-[70%]">{product.title}</Text>
          <Text className="text-[13px] font-normal text-red-700">100.0</Text>
          <View className="flex-row gap-[8px]">
            <View className="w-[8px] h-[8px] bg-pink-400 rounded-full"></View>
            <View className="w-[8px] h-[8px] bg-pink-400 rounded-full"></View>
            <View className="w-[8px] h-[8px] bg-pink-400 rounded-full"></View>
          </View>
        </View>
      </View>
    );
  }