import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import ImageCard from "./ImageCard";

export default function ImageCardCarousal({content}) {

  return (
    <View className="bg-white py-4 mb-3">
      <Text className="text-[22px] font-normal text-black mb-4 text-start px-4">
        {content.data.title}
      </Text>
      <ScrollView
        className="px-[15px]"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {content.data.cards?.map((card, index) => (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              navigation.navigate("ProductDetailScreen", {
                product: product.node,
              });
            }}
          >
            <ImageCard
              imageUrl={card.imageUrl}
              title={card.name}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
