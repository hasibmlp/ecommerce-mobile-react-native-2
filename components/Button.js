import { Text, TouchableOpacity } from "react-native";

export default function Button(text, onPress) {
  <TouchableOpacity
    onPress={() => onPress}
    className="items-center justify-center bg-blue-400 py-4 rounded-[5px]"
  >
    <Text className="text-[15px] font-medium uppercase text-white">
      {text}
    </Text>
  </TouchableOpacity>;
}
