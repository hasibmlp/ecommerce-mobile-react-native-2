import { Dimensions, FlatList, Image, Pressable, View } from "react-native";
import Skeleton from "../Skeleton";
import { useContext, useEffect, useRef } from "react";
import { VariantSelectionContext } from "../../contexts/VariantSelectionContext";
import { getVariantImages } from "../utils/UtilsFunctions";

const screen_width = Dimensions.get("screen").width;
const ITEM_WIDTH = screen_width;
const ITEM_HEIGHT = ITEM_WIDTH / 0.7;


export default function ImageCarousel ({ width=ITEM_WIDTH, height = ITEM_HEIGHT, style, onPress, bounces=true }) {
  const {images, activeColor} = useContext(VariantSelectionContext)
  const flatListRef = useRef();
  const selectedVariantImages = getVariantImages(images, activeColor?.value)
    
    useEffect(() => {
      if(activeColor?.value && images && selectedVariantImages?.length === 0){
        const imageIndex = images?.findIndex(image => image.id === activeColor?.id)
        if(imageIndex > -1) {
          flatListRef.current.scrollToIndex({
            index: imageIndex,
            animated: false
          })
        }
      }
    },[activeColor])
  
  
    if(!images) return <Skeleton width={ITEM_WIDTH} height={ITEM_HEIGHT} />
    return (
      <View style={[{height: height },style]} className="w-full">
          <FlatList
            bounces={bounces}
            key={(_, index) => index.toString()}
            ref={flatListRef}
            horizontal
            data={selectedVariantImages && selectedVariantImages?.length !== 0 ? selectedVariantImages : images}
            keyExtractor={(_, index) => index.toString()}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <Pressable onPress={onPress}>
                  <Image
                    style={{ width: width, height: height }}
                    src={item.url}
                  />
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
          />
      </View>
    )
  }