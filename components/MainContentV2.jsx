import { View } from "react-native";
import { useSelector } from "react-redux";
import { homePageData } from "../data/cms-mock-data";
import ComponentMapper from "./cms/ComponentMapper";

export default function MainContentV2() {
  const gender = useSelector((state) => state.gender.current);

  const hData = homePageData.filter((item) => item.category.includes(gender));

  return (
    <View>
      {hData.map((content, index) => (
        <ComponentMapper key={index.toString()} content={content} />
      ))}
    </View>
  );
}
