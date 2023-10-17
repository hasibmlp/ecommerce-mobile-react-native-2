import {
  FlatList,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Card } from "./Card";
import { GET_COLLECTION } from "../graphql/queries";

export default function CardSlider({ id, products, mt }) {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: {
      collectionId: id,
    },
  });

  if (loading) return <Text>loading..</Text>;
  if (error) return <Text>error occured {error}</Text>;

  return (
    <View className={`bg-white py-[15px] pb-[40px] flex-col mb-3`}>
      <View className="flex-row justify-between py-[10px] px-[15px]">
        <Text className="text-[18px] font-light text-black capitalize">
          {data.collection.title}
        </Text>
        <Pressable
          onPress={() =>
            navigation.navigate("Collection", { collectionId: id })
          }
        >
          <Text className="text-[11px] text-red-900 font-normal uppercase underline">
            View all
          </Text>
        </Pressable>
      </View>
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data.collection.products.edges?.map((product, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              navigation.navigate("ProductDetailScreen", {
                productId: product.node.id,
              });
            }}
          >
            <Card product={product.node} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
