import { useMutation, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon, TrashIcon } from "react-native-heroicons/outline";
import { GET_CART_DETAILS, GET_CART_ITEM } from "../graphql/queries";
import { cartIdVar } from "../App";
import { REMOVE_CART_ITEM } from "../graphql/mutations";

export default function CartCard({ id, lineId, refetch }) {
  const cartId = cartIdVar();
  const [
    removeCartItem,
    {
      loading: removeItemLoading,
      error: removeItemError,
      data: removeItemData,
    },
  ] = useMutation(REMOVE_CART_ITEM);

  function handleItemRemove(id) {
    removeCartItem({
      variables: {
        checkoutId: cartId,
        lineItemIds: [lineId],
      },
      refetchQueries: [
        {
          query: GET_CART_DETAILS,
          variables: {
            checkoutId: cartId,
          },
        },
      ],
    });
  }

  const { loading, error, data } = useQuery(GET_CART_ITEM, {
    variables: {
      productId: id,
    },
  });

  console.log("CART DATA",data)


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
        <View className="text-[13px] text-gray-600 font-light my-3 flex-row">
          {data.node.selectedOptions.map((option, index) => (
            <Text key={index} className={`mr-5 ${index === data.node.selectedOptions.length - 1 ? '' : 'mb-5'}`}>
              {option.value}
            </Text>
          ))} 
          <Text className="">Qty 1</Text>
        </View>
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
