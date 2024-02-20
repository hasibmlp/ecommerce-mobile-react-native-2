import { Text, View } from "react-native";
import BackIconButton from "../buttons/BackIconButton";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FONT_FAMILY } from "../../theme";

const ScreenHeaderV3 = ({
  left = <BackIconButton />,
  children,
  right = <View></View>,
  label,
  scrollY,
  animated = false,
}) => {
  const screenHeaderAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY?.value, [80, 200], [0, 1]);
    return { opacity: opacity };
  });

  if (animated)
    return (
      <View className="absolute w-full top-0 z-50">
        <Animated.View className=" w-full h-12 flex-row items-center bg-transparent">
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

        <Animated.View
          style={screenHeaderAnimatedStyle}
          className="absolute w-full top-0 z-50 h-12 flex-row items-center bg-white"
        >
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
              <Text
                style={FONT_FAMILY.secondary}
                className={`text-lg text-black font-light text-center`}
              >
                {label}
              </Text>
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

  if (!animated)
    return (
      <View className="w-full bg-white">
        <View className=" w-full h-12 flex-row items-center bg-transparent">
          <View className="min-w-[50px] max-w-[100px] h-full items-center justify-center p-2">
            {left && left}
          </View>

          <View className="flex-1">
            <Text style={FONT_FAMILY.secondary} className="text-lg self-center">
              {label}
            </Text>
          </View>

          <View className="min-w-[50px] items-center justify-center p-2">
            {right && right}
          </View>
        </View>
      </View>
    );
};

export default ScreenHeaderV3;
