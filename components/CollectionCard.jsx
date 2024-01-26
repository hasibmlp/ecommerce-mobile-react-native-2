import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { Image } from "expo-image";
import { PlusIcon } from "react-native-heroicons/outline";
import BottomModal from "./Modal/BottomModal";
import { getVariantForSingleOption } from "./utils/UtilsFunctions";
import ColorSwatchImage from "./buttons/ColorSwatchImage";
import PriceContainer from "./PriceContainer";
import { FONT_FAMILY } from "../theme";
import { useLazyQuery } from "@apollo/client";
import { GET_VARIANT_OF_PRODUCTS } from "../graphql/queries";
import Skeleton from "./skeletons/Skeleton";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export function CollectionCard({ product, onPress }) {
  const navigation = useNavigation();
  const images = [product.featuredImage];

  handlePress = () => {
    onPress();
  };

  const amount = {
    price: product?.priceRange.minVariantPrice.amount,
    comparePrice: product?.compareAtPriceRange?.minVariantPrice.amount,
    currencyCode: product?.priceRange.minVariantPrice.currencyCode,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      key={product.id}
      className=" w-full justify-center mr-[10px] "
    >
      <View className="w-full h-[300px] overflow-hidden rounded-[2px]">
        {images && (
          <Image
            style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
            // className="flex-1 w-full bg-neutral-200"
            source={product?.featuredImage?.url}
            placeholder={blurhash}
            contentFit="cover"
            transition={100}
            cachePolicy="none"
          />
          // <Pressable onPress={handlePress}>
          //   {/* <Image
          //     className="w-full h-full"
          //     src={product?.featuredImage?.url}
          //   /> */}
          // </Pressable>
        )}
      </View>

      <View
        onPress={handlePress}
        className="bg-white items-center justify-center py-3"
      >
        <Text
          style={FONT_FAMILY.primary}
          className="text-[12px] text-black font-medium uppercase mb-2"
        >
          {product.vendor}
        </Text>
        {product.title && (
          <Text
            style={FONT_FAMILY.primary}
            numberOfLines={1}
            className="text-[13px] font-normal text-black w-[90%] mb-2 text-center"
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

        {<ColorSwatchesContainer product={product} />}
      </View>
    </TouchableOpacity>
  );
}

function ColorSwatchesContainer({ product }) {
  const [isModalVisisble, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const [getVariantsOfProducts, { data, loading, error }] = useLazyQuery(
    GET_VARIANT_OF_PRODUCTS, {
      fetchPolicy: "no-cache"
    }
  );

  const handleColorOptionPress = (item) => {
    navigation.navigate("ProductDetailScreen", {
      productId: product.id,
      colorValue: item,
    });
    setModalVisible(false);
  };

  const handleColorOptions = () => {
    console.log("PRESSED!!!!", product.id);
    getVariantsOfProducts({
      variables: {
        productId: product?.id,
      },
    });

    setModalVisible(true);
  };

  // console.log("PRODUCT VARIANTS: ", data?.product?.variants);

  const variants = data?.product?.variants.edges.map((edge) => {
    return edge.node;
  });

  if (
    product.options[0].values[0] !== "Default Title" &&
    product.options.some((op) => op.name === "Color") &&
    product.options.find((op) => op.name === "Color")?.values.length > 1
  )
    return (
      <View>
        <TouchableOpacity
          onPress={handleColorOptions}
          className="flex-row  justify-center items-center mb-2 p-1 rounded-full bg-gray-100"
        >
          {product?.options
            .find((op) => op.name === "Color")
            ?.values.slice(0, 4)
            .map((item, index) => (
              <ColorSwatchImage
                key={item}
                size="sm"
                value={item}
                style={{ marginRight: 2 }}
                disableWhenUnavailable={false}
              />
            ))}
          {product?.options.find((op) => op.name === "Color")?.values.length >
            4 && (
            <View className="w-[12px] h-[12px] rounded-full mr-1 bg-white border border-gray-400 items-center justify-center">
              <PlusIcon size={11} color="black" />
            </View>
          )}
        </TouchableOpacity>

        <BottomModal
          title="Select Color"
          visible={isModalVisisble}
          onClose={() => setModalVisible(false)}
        >
          <PreSelectionColor
            product={product}
            loading={loading}
            options={product.options}
            variants={data?.product?.variants}
            handlePress={handleColorOptionPress}
          />
        </BottomModal>
      </View>
    );
  else return <View className="w-4 h-4 mb-3"></View>;
}

function PreSelectionColor({ options, variants, handlePress, loading }) {
  const option = options?.find((op) => op?.name === "Color");

  const colorOption =
    variants?.edges.length > 0 > 0 && option.id
      ? option?.values.map((value) => {
          const variant = variants.edges.find(
            (variant) =>
              variant.node.selectedOptions.find(
                (item) => item.name === option.name
              )?.value === value
          );
          return {
            id: option.id,
            name: option.name,
            value: value,
            image: {
              id: variant?.node?.image.id,
              url: variant?.node?.image.url,
            },
          };
        })
      : [];

  if (loading)
    return (
      <View className="w-full pb-24 px-5 flex-row">
        <Skeleton width={100} height={150} rounded style={{marginRight: 12}}/>
        <Skeleton width={100} height={150} rounded style={{marginRight: 12}}/>
        <Skeleton width={100} height={150} rounded style={{marginRight: 12}}/>
        <Skeleton width={100} height={150} rounded style={{marginRight: 12}}/>
      </View>
    );

  return (
    <View className="pb-12">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="px-5 flex-row">
          {colorOption &&
            colorOption.map((item, index) => (
              <TouchableOpacity
                onPress={() => handlePress(item)}
                key={index.toString()}
                className="mr-3 w-[100px] self-start items-center"
              >
                <View className="w-[100px] h-[150px] rounded-[5px] border border-gray-300">
                  {/* <Image className="w-full h-full" src={item.image.url} /> */}
                  <Image
                    style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
                    source={item.image.url}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={100}
                  />
                </View>

                <View className="py-1 items-center">
                  <Text
                    style={FONT_FAMILY.primary}
                    className="text-[14px] text-balck font-normal pb-2"
                  >
                    {item.value}
                  </Text>
                  <ColorSwatchImage value={item.value} size="sm" />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
