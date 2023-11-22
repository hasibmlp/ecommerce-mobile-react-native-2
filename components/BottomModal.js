import { useContext, useState } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";

import { GET_PRODUCT_V2 } from "../graphql/queries";
import VariantHeader from "./Modal/VariantHeader";
import ModalSkeleton from "./Modal/ModalSkeleton";
import VariantOption from "./Modal/VariantOption";
import { bottomModaVar } from "../App";
import { VariantSelectionContext } from "../contexts/VariantSelectionContext";
import { getVariantForSingleOption } from "./utils/UtilsFunctions";
import Button from "./buttons/Button";

export default function BottomModal({
  setOpen,
  productId,
}) {
  const [showContent, setShowContent] = useState(true)
  const open = useReactiveVar(bottomModaVar);
  
  // Overlay
  const opacityRef = useRef(new Animated.Value(0)).current;
  // BottomModal
  const transRef = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    open && setShowContent(true)
    // Overlay
    Animated.timing(opacityRef, {
      toValue: open ? 0.3 : 0,
      delay: 200,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Bottom Modal
    Animated.timing(transRef, {
      toValue: open ? 0 : 500,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {!open && setShowContent(false)});
  }, [open]);

  
  return (
    <>
      {/* overlay */}
      <Animated.View
        style={[{ opacity: opacityRef }, !open && { display: "none" }]}
        className={` absolute top-0 left-0 bottom-0 right-0 bg-black z-40`}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={() => bottomModaVar(false)}
          onPressIn={() => bottomModaVar(false)}
        ></TouchableOpacity>
      </Animated.View>

      {/* Bottom Modal */}
      <Animated.View
        style={{
          transform: [{ translateY: transRef }],
        }}
        className="w-full absolute bottom-0 z-50 bg-white rounded-[15px]"
      >
        {showContent && (<VariantSelectionModal open={open} productId={productId} setOpen={setOpen} />)}
        
      </Animated.View>
    </>
  );
}

function VariantSelectionModal({open, productId, setOpen}) {
  const [activeColor, setActiveColor] = useState(null)
  const [activeSize, setActiveSize] = useState(null)
  const [activeType, setActiveType] = useState(null)

  const { data, loading, error } = useQuery(GET_PRODUCT_V2, {
    variables: { productId },
    fetchPolicy: "network-only",
  });

  const imagesv2 = data?.product?.images?.edges.map((edge) => {
    return {
      id: edge?.node?.id,
      url: edge?.node?.url,
    };
  });

  const variants = data?.product?.variants.edges.map((edge) => {
    return edge.node;
  });

  const options = data?.product?.options.map((item) => {
    return {
      name: item.name,
      values: item.values,
    };
  });

  const firstSelectedColor = options?.find(option => option.name === 'Color').values[0]
  let initialColorOption
    if(firstSelectedColor){
      const variant = getVariantForSingleOption(variants, 'Color', firstSelectedColor)
       initialColorOption = {id: variant?.image?.id, value: firstSelectedColor}
    }

  const sortedOptions = options?.sort((a, b) => {
    if (a.name === "Color" && b.name !== "Color") {
      return -1;
    } else if (a.name !== "Color" && b.name === "Color") {
      return 1;
    } else if (a.name === "Size" && b.name !== "Size") {
      return 1;
    } else if (a.name !== "Size" && b.name === "Size") {
      return -1;
    } else {
      return 0;
    }
  });

  const handleAddCartBtn = () => {}

  if (error) {
    reutrn(
      <View className="justify-center items-center">
        <Text>Error occured {error}</Text>
      </View>
    );
  }
  
  return (
    <View className="flex-1 items-center justify-center ">
      <View className=" py-10 self-stretch px-5 ">
        <View className="gap-y-5">
          <VariantHeader open={open} setOpen={setOpen} />
          {loading && <ModalSkeleton />}
          {sortedOptions && sortedOptions.map((option, index) => (
            <VariantOption
              key={index.toString()}
              option={option}
              variants={variants}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              activeSize={activeSize}
              setActiveSize={setActiveSize}
              activeType={activeType}
              setActiveType={setActiveType}
            />
            ))}
        </View>
        <Button label="Add to cart" size="md" onPress={handleAddCartBtn} style={{marginVertical: 12}}/>
      </View>
    </View>
    )
}