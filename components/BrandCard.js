import { Image, Text, View } from "react-native";

export default function BrandCard({brand, collectionTitle, collectionDesc , collectionCta, first, height=300}) {

  return (
    <View className="flex-row bg-gray-50 mr-[10px] rounded-[5px]">
      {first && (<View className="w-[160px] items-center justify-center">
        <Text
          numberOfLines={1}
          className="text-[22px] font-light text-black w-[70%] mb-2 text-center"
        >
      {collectionTitle}
        </Text>
        <Text className="text-[14px] w-[70%] font-normal text-black mb-4 text-center">
          {collectionDesc}
        </Text>
        <Text className="text-[14px] font-normal text-red-800 text-center underline">
          {collectionCta}
        </Text>
      </View>)}

      <View style={{height}} className="w-[160px] overflow-hidden rounded-[2px]">
        <View className="flex-1">
        {brand.image && (
          <Image className="h-full w-full" src={brand.image} />
        )}
        </View>
        <View className=" h-[60px] justify-center">
            <Text className="text-[16px] font-normal text-black text-center uppercase">{brand.name}</Text>
        </View>
      </View>
    </View>
  );
}
