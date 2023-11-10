import { Image, Text, View } from "react-native";

export default function RoleCard({ card }) {
  const product = {
    title: "",
    image: require("../assets/prod.jpg"),
  };
  return (
    <View className="flex-row mr-[10px] rounded-[5px]">
      <View className="w-[150px] h-[170px] overflow-hidden rounded-[2px]">
        <View className="flex-1">
          {product.image && (
            <Image
              className="h-full w-full"
              src={card.url}
            />
          )}
        </View>
        <View className=" h-[30px] justify-center">
          <Text className="text-[14px] font-normal text-black text-center uppercase">
            {card.name}
          </Text>
        </View>
      </View>
    </View>
  );
}
