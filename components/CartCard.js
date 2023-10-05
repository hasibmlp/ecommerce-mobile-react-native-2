import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";
import { GET_CART_ITEM } from "../graphql/queries";
import { cartItemsVar } from "../App";

export default function CartCard({ id }) {
  function handleItemRemove(id) {
    const currentItems = cartItemsVar();
    const updatedArray = currentItems.filter((item) => item !== id);
    cartItemsVar(updatedArray)
  }

  const { loading, error, data } = useQuery(GET_CART_ITEM, {
    variables: {
      productId: id,
    },
  });


  if (loading) return <Text>Loading..</Text>;
  if (error) return <Text>Error occured!! {error}</Text>;

  return (
    <View className="bg-white flex flex-row py-4 px-2 items-center mt-0">
      <Image
        className="h-[140px] w-[100px] rounded-[10px]"
        src={data.node.image.url}
      />
      <View className="flex flex-col ml-4 w-[55%]">
        <Text className="text-[16px] text-black font-medium">
          {data.node.product.title}
        </Text>
        <Text className="text-[13px] text-gray-600 font-light my-3">
          {data.node.selectedOptions[1].value} • {data.node.selectedOptions[0].value} • Qty 1
        </Text>
        <Text className="text-[16px] text-black font-medium">
          {data.node.price.amount} AED
        </Text>
      </View>
      <View className="absolute right-4 top-1">
        <TouchableOpacity
          onPress={() => {
            handleItemRemove(id);
          }}
        >
          <TrashIcon size={24} color="black" strokeWidth={1} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
