import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import ImageCarousel from "./Images/ImageCarousel";
// import VariantSelectionModal from "./Modal/VariantSelectionModal";
import CardSkeleton from "./skeletons/CardSkeleton";
import { FilterSelectionContext } from "../contexts/FilterSelectionContext";

const colors = ["red", "blue", "green", "white", "navy"];

export function CollectionCard({ product }) {
  const [imageWidth, setImageWidth] = useState(203)
  const navigation = useNavigation();
  const [isModalVisisble, setModalVisible] = useState(false)
  const [image2, setImages2] = useState(null)

  const images = [product.featuredImage];

  handlePress= () => {
    navigation.navigate("ProductDetailScreen", { productId: product.id })
  }

  return (
    <View
      key={product.id}
      className=" w-full justify-center mr-[10px]"
    >
      <View onLayout={(event) => {
        setImageWidth(event.nativeEvent.layout.width)
      }} className="w-full h-[300px] overflow-hidden rounded-[2px]">
        {images && (
          <Pressable onPress={handlePress}>
            <Image className="w-full h-full" src={product?.featuredImage?.url} />
          </Pressable>
        )}
      </View>
      
      <Pressable onPress={handlePress} className="bg-white items-center justify-center py-3">
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

        {product.options[0].values[0] !== "Default Title" && (
          <>
            <Pressable
              onPress={() => setModalVisible(true)}
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
          </>
        )}

      </Pressable>
    </View>
  );
}

