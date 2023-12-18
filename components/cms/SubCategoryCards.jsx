import { View, Image, Text } from "react-native";
import SubCategoryItem from "../SubCategoryItem";

export default function SubCategoryCards({ content }) {
  return (
    <View className="">
      {content.data.cards.map((card, index) => (
        <SubCategoryItem
          key={index.toString()}
          title={card.title}
          imgUrl={card.url}
        />
      ))}
    </View>
  );
}
