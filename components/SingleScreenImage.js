import { View, Image, Text } from "react-native";

export default function SingleScreenImage({ image, titles }) {
  return (
    <View className="flex-row gap-2">
      <View className={`w-[100%] h-[250px] justify-end`}>
        <Image
          className="w-full h-full absolute left-0 top-0"
          src={image}
        />
        {titles && (
          <View className="w-full h-[150px] items-center justify-end">
            <Image
              className="absolute w-full h-full "
              source={require("../assets/blue-gradient.png")}
            />
            <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
              {titles[0]}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
