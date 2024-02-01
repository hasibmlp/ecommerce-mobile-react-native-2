import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { GET_PROUDCTS_BY_IDS } from "../graphql/queries";
import ProductCard from "./cms/ProductCard";
import { FONT_FAMILY } from "../theme";
import CardSkeleton from "./skeletons/CardSkeleton";

export default function YouMayLikeCardSlider({ ids, products, mt }) {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_PROUDCTS_BY_IDS, {
    variables: {
      ids: ids,
    },
    fetchPolicy: "no-cache",
  });

  if (loading)
    return (
      <View className="w-full flex-row bg-white">
        <CardSkeleton width={150} height={230} style={{ marginRight: 12 }} />
        <CardSkeleton width={150} height={230} style={{ marginRight: 12 }} />
        <CardSkeleton width={150} height={230} style={{ marginRight: 12 }} />
      </View>
    );
  if (error) return <Text>error occured {error}</Text>;

  return (
    <View className={`bg-white py-[15px] pb-[40px] flex-col mb-3`}>
      <View className="flex-row justify-between py-[10px] px-[15px]">
        <Text
          style={FONT_FAMILY.primary}
          className="text-[18px] font-light text-black capitalize"
        >
          You May also Like
        </Text>
      </View>
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data.nodes.map((product, index) => (
          <ProductCard
            key={product?.id}
            product={product}
            width={150}
            height={230}
            onPress={() => {
              navigation.push("ProductDetailScreen", {
                productId: product.id,
              });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
