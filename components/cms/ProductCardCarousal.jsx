import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { GET_COLLECTION } from "../../graphql/queries";

import Skeleton from "../skeletons/Skeleton";
import ProductCard from "./ProductCard";

export default function ProductCardCarousal({ content }) {
  const navigation = useNavigation();
  const { loading, error, data } = useQuery(GET_COLLECTION, {
    variables: {
      collectionId: content.data.collectionId,
    },
  });

  if (error) return <Text>error occured {error}</Text>;

  return (
    <View className={`bg-white py-[15px] pb-[40px] flex-col mb-3`}>
      <View className="flex-row justify-between py-[10px] px-[15px]">
        {!data && loading && <Skeleton width={100} height={12} rounded />}
        {data && (
          <Text className="text-[18px] font-light text-black capitalize">
            {data.collection.title}
          </Text>
        )}
        <Pressable
          onPress={() =>
            navigation.navigate("Collection", {
              collectionId: content.data.collectionId,
            })
          }
        >
          <Text className="text-[11px] text-red-900 font-normal uppercase underline">
            View all
          </Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row px-2">
          {data &&
            data.collection.products.edges?.map((product, index) => (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  navigation.navigate("ProductDetailScreen", {
                    productId: product.node.id,
                  });
                }}
              >
                <ProductCard product={product.node} width={150} height={230} />
              </TouchableOpacity>
            ))}
          {!data && loading && (
            <>
              <View className="items-center mr-2">
                <Skeleton width={150} height={230} />
                <Skeleton
                  width={130}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
                <Skeleton
                  width={80}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
              </View>
              <View className="items-center mr-2">
                <Skeleton width={150} height={230} />
                <Skeleton
                  width={130}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
                <Skeleton
                  width={80}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
              </View>
              <View className="items-center mr-2">
                <Skeleton width={150} height={230} />
                <Skeleton
                  width={130}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
                <Skeleton
                  width={80}
                  height={11}
                  rounded
                  style={{ marginTop: 8 }}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
