
import { Pressable, Text, View } from "react-native";
import { bottomModaVar } from "../../App";

export default function VariantHeader({ handleClose }) {
  return (
    <View className=" flex-row justify-between items-center mb-3 px-5">
      <Text className="text-[22px] font-normal text-black">Select Size</Text>
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
