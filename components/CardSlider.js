import {
  FlatList,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card } from "./Card";
import { useNavigation } from "@react-navigation/native";

export default function CardSlider({ title, mt, products }) {
  const navigation = useNavigation();

  return (
    <View className={`bg-white py-[15px] pb-[40px] flex-col mt-${mt}`}>
      <View className="flex-row justify-between py-[10px] px-[15px]">
        <Text className="text-[18px] font-light text-black capitalize">
          {title}
        </Text>
        <Text className="text-[11px] text-red-900 font-normal uppercase underline">
          View all
        </Text>
      </View>
      <ScrollView className="px-[15px]" horizontal>
        {products?.map((product, index) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProductDetailScreen", {
                product,
              });
            }}
          >
            <Card product={product} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
