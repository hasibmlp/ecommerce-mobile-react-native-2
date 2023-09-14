import React from "react";
import { View } from "react-native";

import CardSlider from "../components/CardSlider";
import ImageBanner from "../components/ImageBanner";
import DiscoverBanner from "../components/DiscoverBanner";
import MostWantedBanner from "../components/MostWantedBanner";
import CategoryImageBanner from "../components/CategoryImageBanner";
import GenderBanner from "../components/GenderBanner";
import DiscoverBoutique from "../components/DiscoverBoutique";
import ContentBanner from "../components/ContentBanner";
import Overlay from "./Overlay";

export default function MainContent({ toggleGenderMenuBar, setState }) {
  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
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
    </View>
  );
}
