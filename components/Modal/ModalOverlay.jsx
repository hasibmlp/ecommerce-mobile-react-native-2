import { useEffect, useRef } from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";

const  ModalOverlay = ({visible, handleClose}) => {
    const opacityRef = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        visible && Animated.timing(opacityRef, {
          toValue: 0.4,
          easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
          useNativeDriver: true,
        }).start();

        !visible && Animated.timing(opacityRef, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
          useNativeDriver: true,
        }).start();
    },[visible])

    return (
        <Animated.View
        style={[{ opacity: opacityRef }]}
        className={` absolute top-0 bottom-0 left-0 bottom-0 right-0 bg-black z-50 `}
      >
        <TouchableOpacity
          className="h-full w-full"
          onPress={handleClose}
          onPressIn={handleClose}
        ></TouchableOpacity>
      </Animated.View>
    )
}

export default ModalOverlay