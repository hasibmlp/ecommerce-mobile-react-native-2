import { FlatList, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import { useNavigation } from '@react-navigation/native';

const products = [
  {
    title: "name",
    price: "1243",
    vendor: "cloths",
  },
  {
    title: "name",
    price: "1243",
    vendor: "cloths",
  },
  {
    title: "name",
    price: "1243",
    vendor: "cloths",
  },
];

export default function CardSlider() {

    const navigation = useNavigation()

  return (
    <View className="bg-white py-[15px] pb-[40px] flex-col">
        <View className='flex-row justify-between py-[10px] px-[15px]'>
      <Text className='text-[18px] font-light text-black'>Featured</Text>
            <Text className='text-[11px] text-red-900 font-normal uppercase underline'>View all</Text>
        </View>
      <ScrollView className='px-[15px]' horizontal >
        {products.map((product, index) => (
            <TouchableOpacity onPress={() => {navigation.navigate("ProductDetailScreen")}}>
                <Card />
            </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
