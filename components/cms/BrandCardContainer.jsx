import { ScrollView, TouchableOpacity, View } from "react-native";
import BrandCard from "../BrandCard";

export default function BrandCardContainer({ content }) {
    return (
      <View className="bg-white py-4 mb-3">
        <ScrollView
          className="px-[15px]"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {content.data.brands?.map((brand, index) => (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => {}}
            >
              <BrandCard
                height={280}
                brand={brand}
                first={index === 0 ? true : false}
                collectionTitle={index === 0 ? content.data.title : ''}
                collectionDesc={index === 0 ? content.data.desc : ''}
                collectionCta={index === 0 ? content.data.cta : ''}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }