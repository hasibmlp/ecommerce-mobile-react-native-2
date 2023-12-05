import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing, Modal, Pressable, SafeAreaView, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const item_height = SCREEN_HEIGHT
const item_width = -SCREEN_WIDTH

export default function MyModal({visible, children, slide='toRight'}) {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isContentAnimated, setContentAnimated] = useState(false)

    const transRef = useRef(new Animated.Value(item_width)).current;

    let animationStyle
    let fromValue
    let toValue
    if(slide === 'toRight') {
        animationStyle = {translateX: transRef}
        fromValue = 0
        toValue = item_width
    }
    else if(slide === 'toUp') {
        animationStyle = {translateY: transRef}
        fromValue = 0
        toValue = item_height
    }

    useEffect(() => {
        isContentAnimated && Animated.timing(transRef, {
        toValue: fromValue,
        duration: 180,
        easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
        useNativeDriver: true,
        }).start();

        !isContentAnimated && Animated.timing(transRef, {
        toValue: toValue,
        duration: 180,
        easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
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
                    <View className="flex-1">

                        <Animated.View
                            style={{transform: [animationStyle]}}
                            className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-white"
                        >
                            <SafeAreaView className="bg-white"/>
                            
                            {children}
    
                        </Animated.View>
                    </View>
                {/* <SafeAreaView/> */}
        </Modal>
    )
}


