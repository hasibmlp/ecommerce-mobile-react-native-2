import {
  Text,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { useDispatch } from "react-redux";
import { selectGender } from "../redux/features/gender/genderSlice";


const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function GenderSelector({toggleGenderMenuBar}) {

  const dispatch = useDispatch()

  return (
    <View
      style={{ borderBottomStartRadius: 180, borderBottomEndRadius: 180 }}
      className={`absolute top-[60px] z-10 w-full ${ toggleGenderMenuBar ? 'h-[170px]' : 'h-[0]' } bg-gray-100 overflow-hidden scale-x-[2.4] `}
    >
      <View className="flex-1 items-center justify-center scale-x-[.42]">
        <View className="p-4 absolute w-[100%] z-10 bg-gray-100 mt-16">
          <Pressable className="border-b-[.5px] border-gray-400" onPress={() => dispatch(selectGender("women"))} >
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Women
            </Text>
          </Pressable>
          <Pressable className="border-b-[.5px] border-gray-400" onPress={() => dispatch(selectGender("men"))} >
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Men
            </Text>
          </Pressable>
          <Pressable className="border-b-[.5px] border-gray-400" onPress={() => dispatch(selectGender("kids"))} >
            <Text className="text-[14px] font-normal text-black py-3 ">
              Shop Kids
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
