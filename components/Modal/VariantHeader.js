
import { Pressable, Text, View } from "react-native";
import { bottomModaVar } from "../../App";

export default function VariantHeader({ open, setOpen }) {
  console.log(open);
  return (
    <View className=" flex-row justify-between items-center mb-3">
      <Text className="text-[22px] font-normal text-black">Select Size</Text>
      <Pressable
        className=" py-1 px-2"
        onPress={() => {
          bottomModaVar(false)
        }}
      >
        <Text className="text-[14px] font-medium text-black uppercase">
          Done
        </Text>
      </Pressable>
    </View>
  );
}
