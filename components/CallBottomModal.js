import { useEffect, useRef, useState } from "react";
import BottomModal from "./BottomModal";
import Overlay from "./Overlay";
import { Animated, TouchableOpacity } from "react-native";

export default function CallBottomModal({ route }) {

  const [overlayOpen, setOverlayOpen] = useState(true)
  const { open, setOpen, productId } = route.params;

  console.log("OPEN: ",open)

  const opacityRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityRef, {
      toValue: true ? 0.3 : 0,
      delay: 300,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
    {overlayOpen && (<Animated.View
      style={{ opacity: opacityRef }}
      className={` absolute top-0 left-0 bottom-0 right-0 bg-black z-40`}
    >
      <TouchableOpacity
        className="h-full w-full"
        onPress={() => setState(false)}
        onPressIn={() => setState(false)}
      ></TouchableOpacity>
    </Animated.View>)}
      <BottomModal open={open} setOpen={setOverlayOpen} productId={productId} />
    </>
  );
}
