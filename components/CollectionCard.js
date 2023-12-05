import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PlusIcon } from "react-native-heroicons/outline";
import BottomModal from "./Modal/BottomModal";
import { getVariantForSingleOption } from "./utils/UtilsFunctions";
import ColorSwatchImage from "./buttons/ColorSwatchImage";
import PriceContainer from "./PriceContainer";

export function CollectionCard({ product }) {
  const navigation = useNavigation();
  const images = [product.featuredImage];

  handlePress= () => {
    navigation.navigate("ProductDetailScreen", { productId: product.id })
  }

  
  const amount = {
    price: product?.priceRange.minVariantPrice.amount,
    comparePrice: product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: product?.priceRange.minVariantPrice.currencyCode
  }
  
  return (
    <View
      key={product.id}
      className=" w-full justify-center mr-[10px]"
    >
      <View className="w-full h-[300px] overflow-hidden rounded-[2px]">
        {images && (
          <Pressable onPress={handlePress}>
            <Image className="w-full h-full" src={product?.featuredImage?.url} />
          </Pressable>
        )}
      </View>
      
      <Pressable onPress={handlePress} className="bg-white items-center justify-center py-3">
        <Text className="text-[12px] text-black font-medium uppercase mb-2">{product.vendor}</Text>
        {product.title && (
          <Text
            numberOfLines={1}
            className="text-[13px] font-normal text-black w-[90%] mb-2 text-center"
          >
            {product.title}
          </Text>
        )}
        {product.priceRange && (
          <PriceContainer containerStyle={{marginBottom: 8}} amount={amount}/>
        )}

        {product.options[0].values[0] !== "Default Title" && product.options.some(op => op.name === 'Color') && product.options.find(op => op.name === 'Color')?.values.length > 1 && (
          <ColorSwatchesContainer product={product} />
        )}

      </Pressable>
    </View>
  );
}

function ColorSwatchesContainer({product}) {
  const [isModalVisisble, setModalVisible] = useState(false)
  const navigation = useNavigation()

  const handleColorOptionPress = (item) => {
    navigation.navigate("ProductDetailScreen", { productId: product.id, colorValue: item })
    setModalVisible(false)
  }

  const variants = product?.variants.edges.map((edge) => {
    return edge.node;
  });
  return (
    <View>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="flex-row  justify-center items-center mb-2 p-1 rounded-full bg-gray-100"
        >
          {product?.options.find(op => op.name === 'Color')?.values.slice(0, 4).map((item, index) => (
            <ColorSwatchImage key={item} size="sm" value={item} style={{marginRight: 2}} disableWhenUnavailable={true} />
          ))}
          {product?.options.find(op => op.name === 'Color')?.values.length > 4 && (
            <View className="w-[12px] h-[12px] rounded-full mr-1 bg-white border border-gray-400 items-center justify-center">
              <PlusIcon size={11} color="black" />
            </View>
          )}
        </Pressable>

        <BottomModal title="Select Color" visible={isModalVisisble} onClose={() => setModalVisible(false)}>
            <PreSelectionColor product={product} options={product.options} variants={variants} handlePress={handleColorOptionPress}/>
        </BottomModal>
    </View>
  )
}


function PreSelectionColor({options, variants, handlePress}) {

  const option = options.find(op => op.name === 'Color')
  const colorOption = option?.values.map((value) => {
    const variant = getVariantForSingleOption(variants, 'Color', value)
    return {
      id: option.id,
      name: option.name,
      value: value,
      image: {
        id: variant.image.id,
        url: variant.image.url,
      },
    };
  });
  return (
    <View className="pb-12">
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="px-5 flex-row">
              {colorOption && colorOption.map((item, index) => (
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  key={index.toString()}
                  className="mr-3 w-[100px] self-start items-center"
                >
                  <View className="w-[100px] h-[150px] rounded-[5px] border border-gray-300">
                    <Image
                      className="w-full h-full"
                      src={item.image.url}
                    />
                  </View>

                  <View className="py-1 items-center">
                    <Text className="text-[14px] text-balck font-normal pb-2">{item.value}</Text>
                    <ColorSwatchImage value={item.value} size="sm"/>
                  </View>
                  
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
    </View>
  )
}