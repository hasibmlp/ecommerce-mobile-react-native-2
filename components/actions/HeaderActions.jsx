import { View } from "react-native";
import BackIconButton from "../buttons/BackIconButton";
import SearchIconButton from "../buttons/SearchIconButton";
import WishListIconButton from "../buttons/WishListIconButton";

export default function HeaderActions () {
    return(
      <View className="absolute top-0 h-[50px] left-0 z-20 w-full flex-row items-center justify-between px-3">
          <BackIconButton color="white" />
          <View className="flex-row">
            <SearchIconButton color="white" style={{marginRight: 8}}/>
            <WishListIconButton color="white" />
          </View>
        </View>
    )
  }