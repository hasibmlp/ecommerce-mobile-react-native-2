import { useQuery } from "@apollo/client";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GET_COLLECTION, GET_HOME_DATA } from "../graphql/queries";
import Overlay from "./Overlay";
import { useSelector } from "react-redux";
import SubCategoryCards from "./cms/SubCategoryCards";
import KidsHomeCollection from "./KidsHomeCollections";
import CategoryImageBanner from "./CategoryImageBanner";
import { LinearGradient } from "expo-linear-gradient";
import ProductCardCarousal from "./cms/ProductCardCarousal";
import Banner from "./cms/Banner";
import ImageCardCarousal from "./cms/ImageCardCarousal";
import BrandCardContainer from "./cms/BrandCardContainer";
import { homePageData } from "../data/cms-mock-data";
import ComponentMapper from "./cms/ComponentMapper";
import TwoCategoryBlock from "./cms/TwoCategoryBlock";
import Heading from "./cms/Heading";


export default function MainContentV2({ toggleGenderMenuBar, setState }) {
  const gender = useSelector((state) => state.gender.current);
  const { loading, error, data } = useQuery(GET_HOME_DATA);

  const result = data?.collection.metafield.value;
  if (!result) return <View className="h-full items-center"><View className="absolute top-[100%]"><ActivityIndicator/></View></View>
  const homeDatas = JSON.parse(result);

  const homeData = homeDatas.filter((homeData) => homeData.gender === gender);

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size='small' color="black" /></View>;
  if (error) return <Text>the error is occured, {error}</Text>;

  // if (gender === 'kids') return <KidsHomeCollection homeData={homeData} />


  const hData = homePageData.filter(item => item.category.includes(gender))

  return <View>
    {hData.map((content, index) => (
      <ComponentMapper key={index.toString()} content={content}/>
    ))}
  </View>

}

