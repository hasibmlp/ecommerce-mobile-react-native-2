import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View
      className={`absolute top-0 right-0 bottom-0 left-0 z-10 items-center justify-center`}
    >
      <View className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-[0.1]"></View>

        <ActivityIndicator size='small' color={'gray'} />
    </View>
  );
}
