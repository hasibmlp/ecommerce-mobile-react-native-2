import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BrandCard from "./BrandCard";
import RoleCard from "./RoleCard";

const data = [
  require("../assets/prod.jpg"),
  require("../assets/prod.jpg"),
  require("../assets/prod.jpg"),
];

export default function RoleCards({roles}) {

  return (
    <View className="bg-white py-4 mb-3">
      <Text className="text-[22px] font-normal text-black mb-4 text-start px-4">
        {roles.title}
      </Text>
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {roles.cards?.map((card, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              navigation.navigate("ProductDetailScreen", {
                product: product.node,
              });
            }}
          >
            <RoleCard
              card={card}
              first={index === 0 ? true : false}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
