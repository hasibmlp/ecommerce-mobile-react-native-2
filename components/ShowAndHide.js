import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { PlusIcon } from "react-native-heroicons/outline";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function ShowAndHide() {
  const [showBody, setShowBody] = useState(false);

  return (
    <View className='border-y border-gray-300 '>
      <Pressable
        onPress={() => setShowBody(!showBody)}
        className="flex-row justify-between px-[15px] py-[15px] items-center"
      >
        <Text className="text-[16px] text-black font-normal">Size & fit</Text>
        <PlusIcon size={24} color="black" />
      </Pressable>
      {showBody ? <View className='px-[15px] pb-[15px]'><Text>hey there! i am visible now..</Text></View> : null}
    </View>
  );
}
