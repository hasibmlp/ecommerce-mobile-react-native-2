import {
  FlatList,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FONT_FAMILY } from "../theme";

export function Card({ product }) {
  return (
    <View className="w-[160px] justify-center mr-[10px]">
      <View className="w-full h-[250px] overflow-hidden rounded-[2px] bg-gray-300">
        {product.images && (
          <Image
            className="h-full w-full"
            src={product.images.edges[0].node.url}
          />
        )}
      </View>
      <View className="bg-white items-center justify-center py-3">
        {product.title && (<Text
        style={FONT_FAMILY.primary}
          numberOfLines={1}
          className="text-[14px] font-normal text-black w-[70%] mb-2 text-center"
        >
          {product.title}
        </Text>)}
       {product.priceRange && ( <Text style={FONT_FAMILY.primary} className="text-[13px] font-normal text-red-700 mb-2 text-center">
          {product.priceRange.minVariantPrice.amount}
        </Text>)}
        <View className="flex-row  justify-center items-center mb-2">
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full mr-2"></View>
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full mr-2"></View>
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full"></View>
        </View>
      </View>
    </View>
  );
}
