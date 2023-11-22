import { Animated, Modal, TouchableOpacity, View } from "react-native"
import VariantSelectionModalContent from "./VariantSelectionModalContent"
import { useEffect, useRef, useState } from "react";
import { PreVariantSelectionProvider } from "../../contexts/PreVariantSelectionContext";

export default function VariantSelectionModal({productId, visible, onClose, context, setImages }) {
    const [isContentAnimated, setContentAnimated] = useState(false)

    // BottomModal
    const transRef = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        isContentAnimated && Animated.timing(transRef, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        }).start();

        !isContentAnimated && Animated.timing(transRef, {
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
        }).start(onClose);

    }, [isContentAnimated]);

    useEffect(() => {
        if(visible === true) setContentAnimated(true)
    },[visible])


    return (
            <Modal
                transparent={true}
                visible={visible}
                >
                <View className="flex-1">

                {(<ModalOverlay visible={visible} handleClose={() => {setContentAnimated(false)}} />)}

                <Animated.View
                    style={{transform: [{ translateY: transRef }],}}
                    className="w-full absolute bottom-0 z-50 bg-white rounded-[15px] overflow-hidden"
                >
                    <PreVariantSelectionProvider productId={productId} getImages={setImages} handleClose={() => {setContentAnimated(false)}}>
                        <VariantSelectionModalContent
                            productId={productId} 
                            handleClose={() => {setContentAnimated(false)}}
                            context={context}
                        />
                    </PreVariantSelectionProvider>
                </Animated.View>

                </View>
            </Modal>
        )}

    function ModalOverlay ({visible, handleClose}) {
        const opacityRef = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(opacityRef, {
              toValue: 0.3,
              delay: 100,
              duration: 200,
              useNativeDriver: true,
            }).start();
        },[visible])

        return (
            <Animated.View
            style={[{ opacity: opacityRef }, !visible && { display: "none" }]}
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