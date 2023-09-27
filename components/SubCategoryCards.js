import { View, Image, Text } from "react-native";
import SubCategoryItem from "./SubCategoryItem";

export default function SubCategoryCards({ categories }) {
  return (
    <View className=" justify-endmb-3">
      <Text className="text-center text-[24px] text-black bg-white font-normal py-4 mb-3">
        {categories.title}
      </Text>
      {categories.cards.map((card, index) => (
        <SubCategoryItem
          key={index.toString()}
          title={card.title}
          imgUrl={card.url}
        />
      ))}
    </View>
  );
}
