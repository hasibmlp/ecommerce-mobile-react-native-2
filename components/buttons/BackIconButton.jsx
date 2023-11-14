import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { ArrowLongLeftIcon } from "react-native-heroicons/outline";

export default function BackIconButton({style, color='black'}) {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            style={[style]}
            className="p-1"
            onPress={() => navigation.goBack()}
        >
            <ArrowLongLeftIcon size={38} color={color} strokeWidth={1} />
        </TouchableOpacity>
    )
}