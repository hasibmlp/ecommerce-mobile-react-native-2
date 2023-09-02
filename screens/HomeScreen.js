import { SafeAreaView, Text, View, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  BellIcon,
  HeartIcon,
  TruckIcon,
  ChevronDownIcon,
} from "react-native-heroicons/outline";

import CardSlider from "../components/CardSlider";
import InfoSlider from "../components/InfoSlider";
import HomeHeader from "../components/HomeHeader";
import ImageBanner from "../components/ImageBanner";
import DiscoverBanner from "../components/DiscoverBanner";
import MostWantedBanner from "../components/MostWantedBanner";
import CategoryImageBanner from "../components/CategoryImageBanner";
import GenderBanner from "../components/GenderBanner";
import DiscoverBoutique from "../components/DiscoverBoutique";
import ContentBanner from "../components/ContentBanner";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function HomeScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className='bg-gray-100'>
        <HomeHeader />
        <ImageBanner />
        <DiscoverBanner />
        <MostWantedBanner />
        <CardSlider />
        <CategoryImageBanner />
        <DiscoverBoutique />
        <ContentBanner />
        <GenderBanner gender={"Men"} />
        <GenderBanner gender={"Kids"} />
        {/* <CardSlider /> */}

      </ScrollView>
    </SafeAreaView>
  );
}
