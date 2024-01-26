import { Text, View } from "react-native";
import { Image } from "expo-image";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function ImageCard({
  title,
  width = 150,
  height = 170,
  imageUrl,
}) {
  return (
    <View className="mr-[10px]">
      <View
        style={{ width, height }}
        className="w-[150px] h-[170px] bg-gray-200 overflow-hidden rounded-[5px]"
      >
        <View className="flex-1">
          {/* {(<Image
            className="h-full w-full"
            src={imageUrl}
          />)} */}

          {
            <Image
              style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
              // className="flex-1 w-full bg-neutral-200"
              source={imageUrl}
              placeholder={blurhash}
              contentFit="cover"
              transition={100}
            />
          }
        </View>
      </View>
      {title && (
        <Text style={FONT_FAMILY.primary} className="text-[14px] font-normal text-black text-center uppercase mt-2">
          {title}
        </Text>
      )}
    </View>
  );
}
