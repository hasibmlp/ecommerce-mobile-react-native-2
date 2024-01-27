import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
// import { Image } from "expo-image";
import { FONT_FAMILY } from "../../theme";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function ThreeCategoryBlock({ content }) {
  return (
    <View className="py-2 bg-white">
      {(content.data.subTitle ||
        content.data.title ||
        content.data.desc ||
        content.data.cta) && (
        <View className="items-center py-4 gap-1 bg-white">
          {content.data.subTitle && (
            <Text style={FONT_FAMILY.primary}  className="text-[18px] text-black font-normal">
              {content.data.subTitle}
            </Text>
          )}
          {content.data.title && (
            <Text style={FONT_FAMILY.primary} className="text-[28px] text-black font-normal capitalize">
              {content.data.title}
            </Text>
          )}
          {content.data.desc && (
            <Text style={FONT_FAMILY.primary} className="text-[14px] text-black font-light w-[350px] text-center">
              {content.data.desc}
            </Text>
          )}
          {content.data.cta && (
            <Text style={FONT_FAMILY.primary} className="text-[14px] text-black font-normal uppercase underline">
              {content.data.cta}
            </Text>
          )}
        </View>
      )}
      <View className="flex-row gap-1">
        <View
          style={{ height: content.data.height }}
          className={`flex-1 justify-end`}
        >
          {/* <Image className="w-full h-full absolute left-0 top-0" src={content.data.images[0].url} /> */}
          <View className="w-full h-full absolute left-0 top-0">
            {/* <Image
              style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
              source={content.data.images[0].url}
              placeholder={blurhash}
              contentFit="cover"
              transition={100}
            /> */}
          </View>
          {content.data.images[0].title && (
            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.20)",
                "rgba(0, 0, 0, 0.41)",
              ]}
              className="w-full h-[80px] items-center justify-end"
            >
              <Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-white pb-[20px] uppercase text-center">
                {content.data.images[0].title}
              </Text>
            </LinearGradient>
          )}
        </View>
        <View
          style={{ height: content.data.height }}
          className={`flex-1 justify-end`}
        >
          <View className="w-full h-full absolute left-0 top-0">
            {/* <Image
              style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
              source={content.data.images[1].url}
              placeholder={blurhash}
              contentFit="cover"
              transition={100}
            /> */}
          </View>
          {content.data.images[1].title && (
            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.20)",
                "rgba(0, 0, 0, 0.41)",
              ]}
              className="w-full h-[80px] items-center justify-end"
            >
              <Text style={FONT_FAMILY.primary} className="text-[16px] font-normal text-white pb-[20px] uppercase text-center">
                {content.data.images[1].title}
              </Text>
            </LinearGradient>
          )}
        </View>
        <View
          style={{ height: content.data.height }}
          className={`flex-1 justify-end`}
        >
          <View className="w-full h-full absolute left-0 top-0">
            {/* <Image
              style={{ flex: 1, width: "100%", backgroundColor: "gray" }}
              source={content.data.images[2].url}
              placeholder={blurhash}
              contentFit="cover"
              transition={100}
            /> */}
          </View>
          {content.data.images[2].title && (
            <LinearGradient
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.20)",
                "rgba(0, 0, 0, 0.41)",
              ]}
              className="w-full h-[80px] items-center justify-end"
            >
              <Text  style={FONT_FAMILY.primary}className="text-[16px] font-normal text-white pb-[20px] uppercase text-center">
                {content.data.images[2].title}
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </View>
  );
}
