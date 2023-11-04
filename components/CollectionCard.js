import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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
import { PlusIcon } from "react-native-heroicons/outline";

const colors = ["red", "blue", "green", "white", "navy"];

export function CollectionCard({
  product,
  bottomModalSetState,
  setSelectedProductId,
}) {
  //   console.log("PRODUCT DETAILS: ",product);
  const navigation = useNavigation();

  const [bottomModal, setBottomModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedOption, setSelectedOption] = useState([
    {
      name: "Color",
      value: "Navy",
    },
  ]);

  const handleColorOptions = (id) => {
    setSelectedProductId(id);
    bottomModalSetState(true)

    
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ProductDetailScreen", { productId: product.id });
      }}
      key={product.id}
      className=" w-full justify-center mr-[10px]"
    >
      <View className="w-full h-[300px] overflow-hidden rounded-[2px]">
        {product.featuredImage && (
          <Image className="h-full w-full" src={product.featuredImage.url} />
        )}
      </View>
      <View className="bg-white items-center justify-center py-3">
        {product.title && (
          <Text
            numberOfLines={1}
            className="text-[14px] font-normal text-black w-[70%] mb-2 text-center"
          >
            {product.title}
          </Text>
        )}
        {product.priceRange && (
          <Text className="text-[13px] font-normal text-red-700 mb-2 text-center">
            {product.priceRange.minVariantPrice.amount}
          </Text>
        )}

        <Pressable
          onPress={() => handleColorOptions(product.id)}
          className="flex-row  justify-center items-center mb-2 p-1 rounded-full bg-gray-100"
        >
          {colors.slice(0, 4).map((item, index) => (
            <View
              key={index.toString()}
              style={{ backgroundColor: item }}
              className="w-[12px] h-[12px] rounded-full mr-[2px] border border-gray-400"
            ></View>
          ))}
          {colors.length > 4 && (
            <View className="w-[12px] h-[12px] rounded-full mr-1 bg-white border border-gray-400 items-center justify-center">
              <PlusIcon size={11} color="black" />
            </View>
          )}
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}
