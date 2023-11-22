import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, SafeAreaView, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width
const item_width = -SCREEN_WIDTH

export default function SideBarModal({visible, children}) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isContentAnimated, setContentAnimated] = useState(false)

    const transRef = useRef(new Animated.Value(item_width)).current;

    useEffect(() => {
        isContentAnimated && Animated.timing(transRef, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
        }).start();

        !isContentAnimated && Animated.timing(transRef, {
        toValue: item_width,
        duration: 130,
        useNativeDriver: true,
        }).start(() => setModalVisible(false));

    }, [isContentAnimated]);

    useEffect(() => {
        if(visible === true) {
            setModalVisible(true)
            setContentAnimated(true)
        }
        if(visible === false) {
            setContentAnimated(false)
        }
    },[visible])

    return (
        <Modal
                transparent={true}
                visible={isModalVisible}
                >
                <SafeAreaView/>
                    <View className="flex-1">

                        <Animated.View
                            style={{transform: [{translateX: transRef}]}}
                            className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-white"
                        >
                            {children}
    
                        </Animated.View>
                    </View>
                {/* <SafeAreaView/> */}
        </Modal>
    )
}


