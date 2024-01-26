import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectGender } from "../redux/features/gender/genderSlice";
import { CheckIcon } from "react-native-heroicons/outline";
import { FONT_FAMILY } from "../theme";

export default function GenderSelector({
  toggleGenderMenuBar,
  setToggleGenderMenuBar,
}) {
  const transRef = useRef(new Animated.Value(-180)).current;
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setOpacity(1);
    Animated.timing(transRef, {
      toValue: !toggleGenderMenuBar ? -180 : 0,
      duration: 300,
      easing: Easing.out(Easing.bezier(0.11, 0, 0.5, 0)),
      useNativeDriver: true,
    }).start(() => {
      if (!toggleGenderMenuBar) return setOpacity(0);
    });
  }, [toggleGenderMenuBar]);

  const dispatch = useDispatch();
  const gender = useSelector((state) => state.gender.current);
  return (
    <Animated.View
      // style={{ borderBottomStartRadius: 180, borderBottomEndRadius: 180, height: 180, transform: [{scaleX: 2.4},{translateY: transRef}] }}
      // style={{ transform: [{translateY: transRef}] }}
      // className={`absolute top-[70px] z-20 w-full bg-neutral-50 overflow-hidden ${!opacity? 'hidden' : '' } rounded-lg`}
      className={` bg-green-300 z-20 w-full overflow-hidden rounded-lg`}
    >
      <View className="flex-1">
        {/* <View className="p-4 absolute w-[100%] z-20 bg-gray-100 mt-16"> */}
        <Pressable
          className="border-b-[.5px] border-gray-400 px-4 h-14 flex-row items-center justify-between"
          onPress={() => {
            dispatch(selectGender("women"));
            setToggleGenderMenuBar(false);
          }}
        >
          <Text
            style={FONT_FAMILY.primary}
            className={`text-sm uppercase ${
              gender === "women" ? "font-medium" : "font-normal"
            } text-black py-4 `}
          >
            Shop Women
          </Text>
          {gender === "women" && <CheckIcon size={20} color="black" />}
        </Pressable>
        <Pressable
          className="border-b-[.5px] border-gray-400 px-4 h-14 flex-row items-center justify-between"
          onPress={() => {
            dispatch(selectGender("men"));
            setToggleGenderMenuBar(false);
          }}
        >
          <Text
            style={FONT_FAMILY.primary}
            className={`text-sm uppercase ${
              gender === "men" ? "font-medium" : "font-normal"
            } text-black py-4 `}
          >
            Shop Men
          </Text>
          {gender === "men" && <CheckIcon size={20} color="black" />}
        </Pressable>
        <Pressable
          className="px-4 h-14 flex-row items-center justify-between"
          onPress={() => {
            dispatch(selectGender("kids"));
            setToggleGenderMenuBar(false);
          }}
        >
          <Text
            style={FONT_FAMILY.primary}
            className={`text-sm uppercase ${
              gender === "kids" ? "font-medium" : "font-normal"
            } text-black py-4 `}
          >
            Shop Kids
          </Text>
          {gender === "kids" && <CheckIcon size={20} color="black" />}
        </Pressable>
        {/* </View> */}
      </View>
    </Animated.View>
  );
}
