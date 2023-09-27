import { View, Image, Text } from "react-native";

export default function PostCardBanner({
  title,
  subTitle,
  cta,
  desc,
  media,
}) {

  return (
    <View className="mb-3 items-center bg-white">
      {title && (
        <Text className="text-[22px] text-black font-light py-[15px]">
          {title}
        </Text>
      )}
      <View className="flex-row">
        <Image className="w-[90%] h-[250px]" src={media[0].url} />
      </View>
      <View className="items-center py-4 gap-3">
        {subTitle && (
          <Text className="text-[18px] text-black font-normal">{subTitle}</Text>
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
    </View>
  );
}
