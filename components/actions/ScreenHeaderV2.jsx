import { Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { FONT_FAMILY } from "../../theme";

export default function ScreenHeaderV2({scrollRef, layout, title, left, right, children, fly=true}) {

    const beginToAnimate =  200
    const headerAnimatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        scrollRef?.value,
        [0,100],
        [0, 1]
      );
      return {
        opacity: opacity,
      };
    });


    return (
      <View className={`w-full h-12 ${fly && 'absolute top-0'} z-50`}>
  
      <View className="items-center justify-center h-12 relative flex-row justify-between px-4">
          <View className="flex-row items-center">{left}</View>
            
          <View className="flex-row items-center">{right}</View>
      </View>
  
      <Animated.View style={scrollRef?.value ? {}: {}} className="h-12 w-full items-center bg-white justify-center absolute top-0">
          <View className="h-full absolute left-4 flex-row items-center">{left}</View>
          {!children && (<Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-black">
            {title?.length > 20 ? title.slice(0, 20) + '...' : title}
          </Text>)}
          {children && children}
          <View className="h-full absolute right-4 flex-row items-center justify-center">{right}</View>
      </Animated.View>
      </View>
    )
  }