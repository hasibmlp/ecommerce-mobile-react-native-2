import { View } from "react-native";
import BackIconButton from "../buttons/BackIconButton";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { FONT_FAMILY } from "../../theme";

const ScreenHeaderV3 = ({
  left = <BackIconButton />,
  children,
  right = <View></View>,
  label,
  scrollY
}) => {

    const screenHeaderAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [80, 200], [0, 1]);
        return { opacity: opacity };
      });


  return (
    <View className="absolute w-full top-0 z-50">

      <Animated.View  className=" w-full h-12 flex-row items-center bg-transparent">
        {left && (
          <View className="min-w-[50px] max-w-[100px] items-center justify-center p-2">
            {left}
          </View>
        )}
        <View className="flex-1"></View>
        {right && (
          <View className="min-w-[50px] items-center justify-center p-2">
            {right}
          </View>
        )}
      </Animated.View>

      <Animated.View style={screenHeaderAnimatedStyle} className="absolute w-full top-0 z-50 w-full h-12 flex-row items-center bg-white">
        {left && (
          <View className="min-w-[50px] max-w-[100px] items-center justify-center p-2">
            {left}
          </View>
        )}
        <View className={`flex-1 justify-center `}>
          {children && (
            <View className={`flex-1 justify-center items-center`}>
              {children}
            </View>
          )}
          {label && !children && (
            <Text style={FONT_FAMILY.primary} className={`text-[13px] text-black font-light`}>{label}</Text>
          )}
        </View>
        {right && (
          <View className="min-w-[50px] items-center justify-center p-2">
            {right}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default ScreenHeaderV3;
