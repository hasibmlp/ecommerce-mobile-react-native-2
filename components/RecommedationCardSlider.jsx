import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { GET_PRODUCT_RECOMMENDATIONS } from "../graphql/queries";
import ProductCard from "./cms/ProductCard";
import { FONT_FAMILY } from "../theme";

export default function RecommedationCardSlider({ id, products, mt }) {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_PRODUCT_RECOMMENDATIONS, {
    variables: {
      proudctId: id,
    },
    fetchPolicy: "no-cache",
  });

  if (loading) return <Text>loading..</Text>;
  if (error) return <Text>error occured {error}</Text>;

  return (
    <View className={`bg-white py-[15px] pb-[40px] flex-col mb-3`}>
      <View className="flex-row justify-between py-[10px] px-[15px]">
        <Text
          style={FONT_FAMILY.primary}
          className="text-2xl font-light text-black capitalize"
        >
          Rcommended
        </Text>
      </View>
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data?.productRecommendations?.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            width={150}
            height={230}
            onPress={() =>
              navigation.push("ProductDetailScreen", { productId: product.id })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
