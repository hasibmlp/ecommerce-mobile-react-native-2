import { useEffect, useRef, useState } from "react";
import { Text, View, Dimensions, Pressable, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectGender } from "../redux/features/gender/genderSlice";

export default function GenderSelector({ toggleGenderMenuBar, setToggleGenderMenuBar }) {

  const transRef = useRef(new Animated.Value(-180)).current
  const [ opacity , setOpacity ] = useState(1)

  useEffect(() => {
    setOpacity(1)
    Animated.timing(transRef, {
      toValue: !toggleGenderMenuBar ? -180: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
        if(!toggleGenderMenuBar) return setOpacity(0)
    })
  }, [toggleGenderMenuBar])

  const dispatch = useDispatch();
  const gender = useSelector((state) => state.gender.current);
  return (
    <Animated.View
      style={{ borderBottomStartRadius: 180, borderBottomEndRadius: 180, height: 180, transform: [{scaleX: 2.4},{translateY: transRef}] }}
      className={`absolute top-[60px] z-10 w-full bg-gray-100 overflow-hidden ${!opacity? 'hidden' : '' }`}
    >
      <View className="flex-1 items-center justify-center scale-x-[.42]">
        <View className="p-4 absolute w-[100%] z-10 bg-gray-100 mt-16">
          <Pressable
            className="border-b-[.5px] border-gray-400"
            onPress={() => {
              dispatch(selectGender("women") )
              setToggleGenderMenuBar(false)
            }}
          >
            <Text
              className={`text-[13px] ${
                gender === "women" ? "font-medium" : "font-light"
              } text-black py-4 `}
            >
              Shop Women
            </Text>
          </Pressable>
          <Pressable
            className="border-b-[.5px] border-gray-400"
            onPress={() => {
              dispatch(selectGender("men") )
              setToggleGenderMenuBar(false)
            }}
          >
            <Text
              className={`text-[13px] ${
                gender === "men" ? "font-medium" : "font-light"
              } text-black py-4 `}
            >
              Shop Men
            </Text>
          </Pressable>
          <Pressable
            className=""
            onPress={() => {
              dispatch(selectGender("kids") )
              setToggleGenderMenuBar(false)
            }}
          >
            <Text
              className={`text-[13px] ${
                gender === "kids" ? "font-medium" : "font-light"
              } text-black py-4 `}
            >
              Shop Kids
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
