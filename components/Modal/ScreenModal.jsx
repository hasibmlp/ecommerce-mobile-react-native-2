import { Modal, View } from "react-native"
import ModalOverlay from "./ModalOverlay"

const ScreenModal = ({children}) => {
    return (
        <Modal transparent={true}>
            <View className="flex-1 items-center justify-center ">
                <ModalOverlay visible={true}/>
                <View  className="w-[80%] h-40 bg-white z-50">
                    {children}
                </View>
            </View>
        </Modal>
    )
}

export default ScreenModal