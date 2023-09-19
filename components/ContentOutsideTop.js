import { View, Text } from "react-native";
import DoubleScreenImage from "./DoubleScreenImage";


export default function ContentOutsideTop({ title, subTitle, desc, cta, children }) {
  return (
    <View className="mb-3 bg-white flex-col">
      <View className="items-center py-4 gap-1 ">
        {subTitle && (
          <Text className="text-[18px] text-black font-normal">{subTitle}</Text>
        )}
        {title && (
          <Text className="text-[28px] text-black font-medium">{title}</Text>
        )}
        {desc && (
          <Text className="text-[14px] text-black font-light w-[350px] text-center">
            {desc}
          </Text>
        )}
        {cta && (
          <Text className="text-[14px] text-black font-medium uppercase underline">
            {cta}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
