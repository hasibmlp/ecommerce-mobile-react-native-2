import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BrandCard from "./BrandCard";
import { useNavigation } from "@react-navigation/native";

const data = [
  require("../assets/prod.jpg"),
  require("../assets/prod.jpg"),
  require("../assets/prod.jpg"),
];


export default function BrandCards({ brandsCollection }) {
  const navigation = useNavigation()
  return (
    <View className="bg-white py-4 mb-3">
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {brandsCollection.brands?.map((brand, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              navigation.navigate("ProductDetailScreen", {
                product: product.node,
              });
            }}
          >
            <BrandCard
              brand={brand}
              first={index === 0 ? true : false}
              collectionTitle={index === 0 ? brandsCollection.title : ''}
              collectionDesc={index === 0 ? brandsCollection.desc : ''}
              collectionCta={index === 0 ? brandsCollection.cta : ''}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
