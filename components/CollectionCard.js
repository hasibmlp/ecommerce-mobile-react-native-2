import {
  FlatList,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";

export function CollectionCard({ product }) {
//   console.log("PRODUCT DETAILS: ",product);
  return (
    <View className=" w-full justify-center mr-[10px] bg-green-500">
      <View className="w-full h-[300px] overflow-hidden rounded-[2px] bg-gray-300">
        {product.featuredImage && (
          <Image
            className="h-full w-full"
            src={product.featuredImage.url}
          />
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
        <View className="flex-row  justify-center items-center mb-2">
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full mr-2"></View>
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full mr-2"></View>
          <View className="w-[8px] h-[8px] bg-pink-400 rounded-full"></View>
        </View>
      </View>
    </View>
  );
}
