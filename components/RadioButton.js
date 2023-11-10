import { View } from "react-native";

export default function RadioButton({ checked }) {
  return (
    <View className="w-5 h-5 rounded-full border border-black items-center justify-center">
      {checked && (
        <View className="absolute w-3 h-3 rounded-full bg-black"></View>
      )}
    </View>
  );
}
