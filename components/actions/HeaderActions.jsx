import { TouchableOpacity, View } from "react-native";
import BackIconButton from "../buttons/BackIconButton";
import SearchIconButton from "../buttons/SearchIconButton";
import WishListIconButton from "../buttons/WishListIconButton";

export default function HeaderActions () {
    return(
      <View className="absolute top-0 h-[50px] left-0 z-20 w-full flex-row items-center justify-between px-3">
          <BackIconButton color="white" />
          <TouchableOpacity className="">
            <SearchIconButton color="white" style={{marginRight: 8}} strokeWidth={2}/>
          </TouchableOpacity>
        </View>
    )
  }