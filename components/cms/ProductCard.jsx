import { Image, Text, TouchableOpacity, View } from "react-native";
// import { Image } from "expo-image";

import PriceContainer from "../PriceContainer";
import ColorSwatchImage from "../buttons/ColorSwatchImage";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function ProductCard({
  context,
  product,
  width = 160,
  height = 250,
  style,
  onPress,
}) {
  const amount = {
    price: product?.priceRange.minVariantPrice.amount,
    comparePrice: product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: product?.priceRange.minVariantPrice.currencyCode,
  };
  const totalColorCount = product?.options.find((op) => op.name === "Color")
    ?.values.length;
  const TOTALNUMBEROFCOLORSHOWN = 4;
  const totalNumberOfReminingColor =
    product?.options.find((op) => op.name === "Color")?.values.length -
    TOTALNUMBEROFCOLORSHOWN;

  const featuredImage =
    product?.featuredImage ?? product?.images?.edges[0]?.node;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ width }, style]}
      className="justify-start mr-[10px]"
    >
      <View
        style={{ height }}
        className="w-full overflow-hidden rounded-[2px] bg-gray-300"
      >
        {featuredImage?.url && (
          <Image
            source={{ uri: featuredImage?.url }}
            className="w-full h-full"
          />
        )}
      </View>
      <View className="bg-white items-center justify-center py-3">
        {product.vendor && (
          <Text
            style={FONT_FAMILY.primary}
            numberOfLines={1}
            className="text-sm font-normal text-black w-[90%] mb-1 text-center"
          >
            {product.vendor}
          </Text>
        )}
        {product.title && (
          <Text
            style={FONT_FAMILY.secondary}
            numberOfLines={1}
            className="text-xs font-normal text-black w-[90%] mb-2 text-center"
          >
            {product.title}
          </Text>
        )}
        {product.priceRange && (
          <PriceContainer
            containerStyle={{ marginBottom: 8 }}
            amount={amount}
          />
        )}
        {totalColorCount > 1 && (
          <View className="flex-row  justify-center items-center mb-2">
            {product?.options
              .find((op) => op.name === "Color")
              ?.values.slice(0, 4)
              .map((item, index) => (
                <ColorSwatchImage
                  key={item}
                  size="xs"
                  value={item}
                  style={{ marginRight: 2 }}
                  disableWhenUnavailable={false}
                />
              ))}
            <Text
              style={FONT_FAMILY.primary}
              className="ml-1 text-[13px] text-black font-light"
            >
              {totalNumberOfReminingColor > 0 &&
                "+" + totalNumberOfReminingColor}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
