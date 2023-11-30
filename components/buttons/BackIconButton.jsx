import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

export default function BackIconButton({style, color='black'}) {
    const navigation = useNavigation()
    return (
      <TouchableOpacity
        style={style}
        onPress={() => navigation.goBack()}
        className="p-1 items-center justify-center"
        >
          <ChevronLeftIcon size={28} color={color} strokeWidth={1}/>
        </TouchableOpacity>
    )
}