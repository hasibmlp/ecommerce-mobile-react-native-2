import { TouchableOpacity } from "react-native";
import { HeartIcon } from "react-native-heroicons/outline";

export default function WishListIconButton ({style, color="black"}) {
    return(
        <TouchableOpacity style={[style]} className="p-1">
            <HeartIcon size={26} color={color} />
        </TouchableOpacity>
    )
}