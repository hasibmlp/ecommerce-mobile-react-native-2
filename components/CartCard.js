import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Image, Text, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

export default function CartCard() {
  return (
    <View className="bg-white flex flex-row py-4 items-center gap-5 mt-0">
      <Image
        className="h-[140px] w-[100px] rounded-[10px]"
        source={require("../assets/prod.jpg")}
      />
      <View className="flex flex-col ">
        <Text className="text-[16px] text-black font-medium">
          Amazing Product
        </Text>
        <Text className="text-[13px] text-gray-600 font-light my-3">
          One Size • White • Qty 1
        </Text>
        <Text className="text-[16px] text-black font-medium">$ 60.00</Text>
      </View>
      <View className="absolute right-4 top-1">
        <TrashIcon size={24} color="black" strokeWidth={1} />
      </View>
    </View>
  );
}
