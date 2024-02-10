import { Dimensions, FlatList, Pressable, Text, View, Image } from "react-native";
import Skeleton from "../skeletons/Skeleton";
// import { Image } from "expo-image";
import { useContext, useEffect, useRef, useState } from "react";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import { getVariantImages } from "../utils/UtilsFunctions";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;

export default function ImageCarousel({
  width = ITEM_WIDTH,
  height = ITEM_HEIGHT,
  style,
  onPress,
  bounces = true,
}) {
  const { images, activeOptions } = useContext(VariantSelectionContext);
  const flatListRef = useRef();
  const selectedVariantImages = getVariantImages(
    images,
    activeOptions.find((i) => i.name === "Color")?.value
  );
  const imageIndex = images?.findIndex(
    (image) =>
      image.id === activeOptions.find((i) => i.name === "Color")?.image?.id
  );

  useEffect(() => {
    if (flatListRef.current && selectedVariantImages?.length === 0) {
      if (imageIndex > -1) {
        flatListRef.current.scrollToIndex({
          index: imageIndex,
          animated: false,
        });
      }
    }
  }, [activeOptions]);

  const handleOnLayout = () => {
    if (flatListRef.current && selectedVariantImages?.length === 0) {
      if (imageIndex > -1) {
        flatListRef.current.scrollToIndex({
          index: imageIndex,
          animated: false,
        });
      }
    }
  };

  if (!images) return <Skeleton width={ITEM_WIDTH} height={ITEM_HEIGHT} />;
  return (
    <View style={[{ height: height }, style]} className="w-full">
      <FlatList
        bounces={bounces}
        key={(_, index) => index.toString()}
        ref={flatListRef}
        horizontal
        data={
          selectedVariantImages && selectedVariantImages?.length !== 0
            ? selectedVariantImages
            : images
        }
        keyExtractor={(_, index) => index.toString()}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={onPress}>
              <View style={{ width: width, height: height }}>
                  <Image
                    style={{ width: width, height: height }}
                    src={item.url}
                  />
                  {/* <Image
                    style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
                    source={item.url}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={100}
                    cachePolicy="none"
                  /> */}
              </View>
            </Pressable>
          );
        }}
        getItemLayout={(_, index) => {
          return {
            length: width,
            offset: width * index,
            index,
          };
        }}
        onLayout={handleOnLayout}
      />
    </View>
  );
}
