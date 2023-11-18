import Animated from "react-native-reanimated";
import BackIconButton from "../buttons/BackIconButton";
import { Text, View } from "react-native";
import SearchIconButton from "../buttons/SearchIconButton";
import WishListIconButton from "../buttons/WishListIconButton";

export function ScreenHeader ({headerAnimatedStyle, headerRight}) {
    return(
      <Animated.View
            style={[{ backgroundColor: "white" }, headerAnimatedStyle]}
            className="w-full h-[50px] absolute top-[0px] z-20 bg-white flex-row items-center justify-center"
          >
            <BackIconButton color="black" style={{position: 'absolute', left: 12}}/>
            <Text className="text-[18px] text-black font-normal p-3">Coach</Text>
            {headerRight && (<View className="flex-row absolute right-3">
              <SearchIconButton style={{marginRight: 8}} />
              <WishListIconButton />
            </View>)}
        </Animated.View>
    )
  }