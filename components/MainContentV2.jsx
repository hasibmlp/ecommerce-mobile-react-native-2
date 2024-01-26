import { View } from "react-native";
import { useSelector } from "react-redux";
import { homePageData } from "../data/cms-mock-data";
import ComponentMapper from "./cms/ComponentMapper";
import { useEffect } from "react";

export default function MainContentV2() {
  const gender = useSelector((state) => state.gender.current);

  // const hData = homePageData.filter((item) => item.category.includes(gender));
  const hData = homePageData.filter((item) => item.category === gender)

  return (
    <View>
      {hData.map((content, index) => (
        <ComponentMapper key={index.toString()} content={content} />
      ))}
    </View>
  );
}