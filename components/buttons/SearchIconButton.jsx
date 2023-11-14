import { TouchableOpacity } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";

export default function ({color="black", style}) {
    return (
        <TouchableOpacity style={[style]} className="p-1">
            <MagnifyingGlassIcon size={26} color={color} />
        </TouchableOpacity>
    )
}