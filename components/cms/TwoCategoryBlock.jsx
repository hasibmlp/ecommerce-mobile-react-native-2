import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, View } from "react-native";

// title, subTitle, desc, cta, imageUrls, style, height=230

export default function TwoCategoryBlock({content}) {
    return (
      <View>
        <View className="items-center py-4 gap-1 bg-white">
          {content.data.subTitle && (
            <Text className="text-[18px] text-black font-normal">{content.data.subTitle}</Text>
          )}
          {content.data.title && (
            <Text className="text-[28px] text-black font-medium">{content.data.title}</Text>
          )}
          {content.data.desc && (
            <Text className="text-[14px] text-black font-light w-[350px] text-center">
              {content.data.desc}
            </Text>
          )}
          {content.data.cta && (
            <Text className="text-[14px] text-black font-medium uppercase underline">
              {content.data.cta}
            </Text>
          )}
        </View>
        <View className="flex-row gap-1">
          <View style={{height: content.data.height}} className={`flex-1 justify-end`}>
            <Image className="w-full h-full absolute left-0 top-0" src={content.data.images[0].url} />
            {content.data.images[0].title && (
              <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.41)']}
              className="w-full h-[80px] items-center justify-end">
                <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
                  {content.data.images[0].title}
                </Text>
              </LinearGradient>
            )}
          </View>
          <View style={{height: content.data.height}} className={`flex-1 justify-end`}>
            <Image className="w-full h-full absolute left-0 top-0" src={content.data.images[1].url} />
            {content.data.images[1].title && (
              <LinearGradient 
              colors={['transparent', 'rgba(0, 0, 0, 0.20)', 'rgba(0, 0, 0, 0.41)']}
              className="w-full h-[80px] items-center justify-end">
                <Text className="text-[16px] font-medium text-white pb-[20px] uppercase">
                  {content.data.images[1].title}
                </Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </View>
    )
  }