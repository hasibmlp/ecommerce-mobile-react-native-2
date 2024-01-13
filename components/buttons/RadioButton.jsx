import { View } from "react-native";

export default function RadioButton({ checked }) {
  return (
    <View className="w-4 h-4 rounded-full border border-black items-center justify-center">
      {checked && (
        <View className="absolute w-[10] h-[10] rounded-full bg-black"></View>
      )}
    </View>
  );
}
