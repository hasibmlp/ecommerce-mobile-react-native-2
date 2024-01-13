import { View, Image, Text } from "react-native";

export default function SubCategoryItem({title, imgUrl}) {
  return (
      <View className=" items-center justify-end mb-3">
        <Image
          className="w-full h-[120px]"
          src={imgUrl}
        />
        <View className="w-full">
          <Text className=" text-center text-[16px] text-black bg-white font-light py-4">
            {title}
          </Text>
        </View>
      </View>
  );
}
