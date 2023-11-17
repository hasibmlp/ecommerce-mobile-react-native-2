import { ActivityIndicator, View } from "react-native";

export default function () {
    return(
        <View className="absolute top-0 left-0 bottom-0 right-0 bg-transparent z-50 items-center justify-center">
            <View className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-[0.3]"></View> 
            <ActivityIndicator size='small' color='#000000'/>
        </View>
    )
}