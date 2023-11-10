import { View, Image, Text } from "react-native";

export default function ContentBanner({
  title,
  subTitle,
  cta,
  desc,
  media,
}) {

  return (
    <View className="mb-3 items-center bg-white">
      <View className="flex-row">
        <Image className="w-[100%] h-[350px]" src={media[0].url} />
      </View>
      <View className="items-center py-4">
        {subTitle && (
          <Text className="text-[18px] text-black font-normal mb-2">{subTitle}</Text>
        )}

        {title && (
          <Text className="text-[28px] text-black font-medium mb-2">{title}</Text>
        )}
        {desc && (
          <Text className="text-[14px] text-black font-light w-[350px] text-center mb-2">
            {desc}
          </Text>
        )}
        {cta && (
          <Text className="text-[14px] text-black font-medium uppercase underline">
            {cta}
          </Text>
        )}
      </View>
    </View>
  );
}
