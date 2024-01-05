import { Image, Text, View } from "react-native"
import Button from "../buttons/Button"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"

const InitialSplashScreen = () => {
    const navigation = useNavigation()
    return (
        <View className="flex-1 items-center ">
                <View className="absolute flex-1 top-0 left-0 right-0 bottom-0">
                    <Image className="w-full h-full" source={require("../../assets/scrubset.jpg")} />
                </View>
                <View className="flex-1 items-center justify-center">
                    <Text style={{color: '#C3F585'}} className=" text-6xl font-semibold text-center shadow-lg">Scubs and Clogs</Text>
                </View>
                <View className="h-52 items-center justify-center w-full">
                    <LinearGradient
                    className="w-full h-full items-center justify-center"
                    colors={['transparent', 'rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.21)']}
                    >
                            <Button onPress={() => navigation.navigate("AuthScreen")} colors={['#3BF4FB', '#A5FAFD']} textColors={['#ffffff']} label="Login" flex={true} style={{marginBottom: 24, marginHorizontal: 16}}/>
                            <Button onPress={() => navigation.navigate("MainScreen")} textColors={['#C3F585', '#CAFF8A']} label="Skip now" size="lg" type="action"/>
                    </LinearGradient>
                </View>
        </View>
    )
}

export default InitialSplashScreen