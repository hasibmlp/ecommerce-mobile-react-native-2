import { Image, Text, TouchableOpacity, View } from "react-native";
import PriceContainer from "../PriceContainer";
import ColorSwatchImage from "../buttons/ColorSwatchImage";
import { PlusIcon } from "react-native-heroicons/outline";

export default function ProductCard({context, product,  width=160, height=250, style, onpress}) {
    const amount = {
        price: product?.priceRange.minVariantPrice.amount,
        comparePrice: product?.compareAtPriceRange?.minVariantPrice.amount,
        currencyCode: product?.priceRange.minVariantPrice.currencyCode
      }
    const totalColorCount = product?.options.find(op => op.name === 'Color')?.values.length
    const TOTALNUMBEROFCOLORSHOWN = 4
    const totalNumberOfReminingColor = product?.options.find(op => op.name === 'Color')?.values.length -TOTALNUMBEROFCOLORSHOWN
    return(
        <TouchableOpacity onPress={onpress} style={[{width},style]} className="justify-center mr-[10px]">
      <View style={{height}} className="w-full overflow-hidden rounded-[2px] bg-gray-300">
        {product.featuredImage?.url && (
          <Image
            className="h-full w-full"
            src={product.featuredImage?.url} 
          />
        )}
      </View>
      <View className="bg-white items-center justify-center py-3">
        {product.title && (<Text
          numberOfLines={1}
          className="text-[13px] font-normal text-black w-[90%] mb-2 text-center"
        >
          {product.title}
        </Text>)}
        {product.priceRange && (
          <PriceContainer containerStyle={{marginBottom: 8}} amount={amount} />
        )}
        {totalColorCount > 1 && <View className="flex-row  justify-center items-center mb-2">
            {product?.options.find(op => op.name === 'Color')?.values.slice(0, 4).map((item, index) => (
                <ColorSwatchImage key={item} size="xs" value={item} style={{marginRight: 2}} disableWhenUnavailable={true} />
            ))}
            <Text className="ml-1 text-[13px] text-black font-light">{totalNumberOfReminingColor > 0 && '+' +  totalNumberOfReminingColor}</Text>
        </View>}
      </View>
    </TouchableOpacity>
    )
}