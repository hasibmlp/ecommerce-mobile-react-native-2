import { Animated, Easing, Modal, Pressable, Text, TouchableOpacity, View } from "react-native"
import { useEffect, useRef, useState } from "react";

export default function BottomModal({visible, children, onClose, title}) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isContentAnimated, setContentAnimated] = useState(false)

    // BottomModal
    const transRef = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        isContentAnimated && Animated.timing(transRef, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
        useNativeDriver: true,
        }).start();

        !isContentAnimated && Animated.timing(transRef, {
        toValue: 500,
        duration: 300,
        easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
        useNativeDriver: true,
        }).start(() => setModalVisible(false));

    }, [isContentAnimated]);

    useEffect(() => {
        if(visible === true) {
            setModalVisible(true)
            setContentAnimated(true)
        }else {
            setContentAnimated(false)
        }
    },[visible])


    return (
            <Modal
                transparent={true}
                visible={isModalVisible}
                >
                <View className="flex-1">

                {(<ModalOverlay visible={visible} handleClose={onClose} />)}

                <Animated.View
                    style={{transform: [{ translateY: transRef }],}}
                    className="w-full absolute bottom-0 z-[999] bg-white rounded-[15px] overflow-hidden"
                >
                    <View>
                        <BottomModalHeader title={title} handleClose={onClose} />
                        {children}
                    </View>
                </Animated.View>

                </View>
            </Modal>
        )}

        

    function ModalOverlay ({visible, handleClose}) {
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

function BottomModalHeader({ handleClose, title }) {
        return (
          <View className=" flex-row justify-between items-center px-5 pb-4 pt-6">
            <Text className="text-[22px] font-light text-black">{title}</Text>
            <Pressable
              className=" py-2 px-3"
              onPress={handleClose}
            >
              <Text className="text-[14px] font-medium text-black uppercase">
                Done
              </Text>
            </Pressable>
          </View>
        );
      }
      