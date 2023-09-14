import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { TruckIcon } from "react-native-heroicons/outline";

export default function BottomModal() {
  return (
    <View style={{ borderTopStartRadius: 180, borderTopEndRadius: 180, transform: [{scaleX: 2.4},] }} className="absolute bottom-0 left-0 right-0 z-10 bg-white">
      <View className="flex-1 items-center justify-center scale-x-[.42]">
        <View className=" py-10 self-stretch px-5 ">
          <View className="gap-y-5">
            <View className="flex-row justify-between items-center">
              <Text className="text-[22px] font-normal text-black">
                Select Size
              </Text>
              <Pressable>
                <Text className="text-[14px] font-medium text-black uppercase">
                  Done
                </Text>
              </Pressable>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[12px] font-normal text-black uppercase">
                Size:
              </Text>
              <Pressable>
                <Text className="text-[12px] font-medium text-red-700 uppercase underline">
                  size guide
                </Text>
              </Pressable>
            </View>
            <View className="flex-row items-center gap-x-3 relative">
              <View className="border-[.5px] border-gray-500 rounded-[5px] py-4 px-4 bg-gray-300">
                <Text className="text-[14px] font-light text-white uppercase">
                  xs
                </Text>
                <View className=""></View>
              </View>
              <View className="border-[.5px] border-gray-500 rounded-[5px] py-4 px-4">
                <Text className="text-[14px] font-light text-black uppercase">
                  s
                </Text>
              </View>
              <View className="border-[.5px] border-gray-500 rounded-[5px] py-4 px-4">
                <Text className="text-[14px] font-light text-black uppercase">
                  m
                </Text>
              </View>
              <View className="border-[.5px] border-gray-500 rounded-[5px] py-4 px-4">
                <Text className="text-[14px] font-light text-black uppercase">
                  l
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-10">
            <TouchableOpacity className=" flex items-center justify-center py-4 w-full bg-red-400 rounded-[5px] ">
              <Text className="text-[14px] text-white font-semibold uppercase">
                Add to bag
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className=" bg-white flex-row items-center justify-center mt-3">
              <View className="flex-row justify-center items-center">
                <TruckIcon size={20} strokeWidth={1} color="black" />
                <Text className="text-[12px] font-normal text-black uppercase ml-2">
                  shipping from uae
                </Text>
              </View>
              <View className="flex-row justify-center items-center">
                <Text className="text-[14px] font-normal text-black">
                  Next day delevery to
                </Text>
                <Text className="text-[12px] font-normal text-red-800 underline">
                  Abudhabi
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
