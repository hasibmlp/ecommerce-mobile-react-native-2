import { View } from "react-native";

export default function ColorSwatch({color}) {
    return  <View style={{backgroundColor: color}} className={`w-6 h-6 rounded-full`}></View>
}