import { View, Image, Text } from "react-native";

export default function DiscoverBoutiqueItem({title, image}) {
  return (
      <View className=" items-center justify-end mb-3">
        <Image
          className="w-full h-[120px]"
          source={image}
        />
        <View className="w-full">
          <Text className=" text-center text-[16px] text-black bg-white font-light py-4">
            {title}
          </Text>
        </View>
      </View>
  );
}
