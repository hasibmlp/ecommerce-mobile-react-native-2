import {
  SafeAreaView,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState } from "react";
import { PlusIcon } from "react-native-heroicons/outline";
import Animated, {Layout} from 'react-native-reanimated'


export default function ShowAndHide({title}) {

  const [showBody, setShowBody] = useState(false);

  return (
    <Animated.View layout={Layout} className='border-t border-gray-300 bg-white'>
      <Pressable
        onPress={() => setShowBody(!showBody)}
        className="flex-row justify-between px-[15px] py-[15px] items-center"
      >
        <Text className="text-[15px] text-gray-800 font-normal">{title}</Text>
        <PlusIcon size={20} color="black" strokeWidth={1} />
      </Pressable>
      {showBody ? <View className='px-[15px] pb-[15px]'><Text className="text-[14px] text-gray-600 font-normal">hey there! i am visible now..</Text></View> : null}
    </Animated.View>
  );
}
