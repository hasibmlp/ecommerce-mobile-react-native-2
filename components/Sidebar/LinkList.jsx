import { Pressable } from "react-native";
import OptionLabel from "./OptionLabel";

export default function LinkList({option}) {
    
    const handlePress = () => {

    }

    return (
        <Pressable onPress={handlePress} className="flex-row justify-between items-center px-2 py-3">
            <OptionLabel label={option.title} count={option.count}/>
        </Pressable>
    )
}