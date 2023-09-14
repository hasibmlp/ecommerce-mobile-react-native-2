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


export default function ShowAndHide({title}) {

  const [showBody, setShowBody] = useState(false);

  return (
    <View className='border-t border-gray-300 '>
      <Pressable
        onPress={() => setShowBody(!showBody)}
        className="flex-row justify-between px-[15px] py-[15px] items-center"
      >
        <Text className="text-[16px] text-gray-800 font-normal">{title}</Text>
        <PlusIcon size={24} color="black" strokeWidth={1} />
      </Pressable>
      {showBody ? <View className='px-[15px] pb-[15px]'><Text className="text-[14px] text-gray-600 font-normal">hey there! i am visible now..</Text></View> : null}
    </View>
  );
}
