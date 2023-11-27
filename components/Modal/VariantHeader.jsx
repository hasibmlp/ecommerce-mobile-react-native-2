
import { Pressable, Text, View } from "react-native";

export default function BottomModalHeader({ handleClose, title }) {
  return (
    <View className=" flex-row justify-between items-center mb-3 px-5">
      <Text className="text-[22px] font-normal text-black">{title}</Text>
      <Pressable
        className=" py-2 px-3"
        onPress={handleClose}
      >
        <Text className="text-[14px] font-medium text-black uppercase">
          Done
        </Text>
      </Pressable>
    </View>
  );
}
