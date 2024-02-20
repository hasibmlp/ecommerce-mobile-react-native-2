import { Image, Text, View } from "react-native";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function BannerImageWithContentBlock({ content }) {
  if (content.data.context === "contentBottom")
    return (
      <View className="mb-3 items-center bg-white">
        <View
          style={{ height: content.data.height || 230 }}
          className="flex-row"
        >
          <Image  className="w-[100%]" src={content.data.image.url} />
         
        </View>
        <View className="items-center py-4">
          {content.data.subTitle && (
            <Text style={FONT_FAMILY.primary} className="text-[18px] text-black font-normal mb-2">
              {content.data.subTitle}
            </Text>
          )}

          {content.data.title && (
            <Text style={FONT_FAMILY.primary} className="text-[28px] text-black font-normal mb-2">
              {content.data.title}
            </Text>
          )}
          {content.data.desc && (
            <Text style={FONT_FAMILY.primary} className="text-[14px] text-black font-light w-[350px] text-center mb-2">
              {content.data.desc}
            </Text>
          )}
          {content.data.cta && (
            <Text style={FONT_FAMILY.primary} className="text-[14px] text-black font-normal uppercase underline">
              {content.data.cta}
            </Text>
          )}
        </View>
      </View>
    );

  if (content.data.context === "postCard")
    return (
      <View className="mb-3 items-center bg-white">
        {content.data.title && (
          <Text style={FONT_FAMILY.primary} className="text-2xl text-black font-light py-[15px]">
            {content.data.title}
          </Text>
        )}
        <View
          style={{ height: content.data.height || 230 }}
          className="flex-row bg-gray-200"
        >
          <Image className="w-[90%] h-full" src={content.data.image.url} />
          
        </View>
        <View className="items-center py-4 gap-3">
          {content.data.subTitle && (
            <Text style={FONT_FAMILY.secondary} className="text-[18px] text-black font-normal">
              {content.data.subTitle}
            </Text>
          )}

          {content.data.desc && (
            <Text style={FONT_FAMILY.secondary} className="text-[13px] text-black font-light w-[350px] text-center leading-4">
              {content.data.desc}
            </Text>
          )}
          {content.data.cta && (
            <Text style={FONT_FAMILY.font_3} className="text-[13px] text-black font-normal uppercase underline">
              {content.data.cta}
            </Text>
          )}
        </View>
      </View>
    );
}
