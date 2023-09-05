import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import {
  HeartIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ChevronRightIcon
} from "react-native-heroicons/outline";
import CartCard from "../components/CartCard";

export default function CartScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1">
      <SafeAreaView className='bg-white'>
        <View className="w-full relative flex-row justify-center items-center h-[35px]">
          <Text className='text-[16px] text-black font-normal' >Your Bag (4)</Text>
          <View className='flex-row gap-4 absolute top-1 right-3'>
            <HeartIcon size={24} color="black" strokeWidth={1} />
            <QuestionMarkCircleIcon size={24} color="black" strokeWidth={1} />
          </View>
        </View>
      </SafeAreaView>
      <View className="flex flex-row justify-between bg-white py-4 my-3">
        <View className='flex flex-row gap-2 items-center'>
          <UserIcon size={24} color="black"  />
          <Text className="text-[14px] text-black font-medium">Log in or create an account for faster checkout</Text>
        </View>
        <ChevronRightIcon size={24} color="black" />
      </View>
      <CartCard />      
    </View>
  );
}