import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

export default function BackIconButton({style, color='black'}) {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            style={[style]}
            className="p-1"
            onPress={() => navigation.goBack()}
        >
            <ChevronLeftIcon size={24} color={color} strokeWidth={2} />
        </TouchableOpacity>
    )
}