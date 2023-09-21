import React from "react";
import { useQuery } from "@apollo/client";
import { Text, View } from "react-native";

import CardSlider from "../components/CardSlider";
import ImageBanner from "../components/ImageBanner";
import DiscoverBanner from "../components/DiscoverBanner";
import MostWantedBanner from "../components/MostWantedBanner";
import CategoryImageBanner from "../components/CategoryImageBanner";
import GenderBanner from "../components/GenderBanner";
import DiscoverBoutique from "../components/DiscoverBoutique";
import ContentBanner from "../components/ContentBanner";
import Overlay from "./Overlay";
import { GET_HOMESCREEN_DATA, GET_PRODUCTS } from "../graphql/queries";
import ContentOutsideTop from "./ContentOutsideTop";
import DoubleScreenImage from "./DoubleScreenImage";
import TripleeScreenImage from "./TripleScreenImage";
import ContentOutsideBottom from "./ContentOutsideBottom";
import SingleScreenImage from "./SingleScreenImage";

const images1 = [
  require("../assets/scrubset.jpg"),
  require("../assets/labcoat.jpg"),
];

const images2 = [
  require("../assets/scrubtop.jpg"),
  require("../assets/pants.jpg"),
  require("../assets/printedtops.jpg"),
];

const images3 = [
  require("../assets/jackets.jpg"),
  require("../assets/t-shirt.jpg"),
];

export default function MainContent({
  toggleGenderMenuBar,
  setState,
  homeScreenData,
}) {
  // const { loading, error, data } = useQuery(GET_PRODUCTS);


  // if (loading) return <View></View>;
  // if (error) {
  //   console.log(error);
  // }

  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
      <ContentOutsideTop
        title={homeScreenData.collectionCategory[0].title}
        desc={homeScreenData.collectionCategory[0].desc}
      >
        <DoubleScreenImage
          images={homeScreenData.collectionCategory[0].images}
        />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={homeScreenData.collectionCategory[1].title}
        desc={homeScreenData.collectionCategory[1].desc}
      >
        <TripleeScreenImage
          images={homeScreenData.collectionCategory[1].images}
        />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={homeScreenData.collectionCategory[2].title}
        desc={homeScreenData.collectionCategory[2].desc}
      >
        <DoubleScreenImage
          images={homeScreenData.collectionCategory[2].images}
        />
      </ContentOutsideTop>

      <ContentOutsideBottom
        cta="Explore"
        desc="modest full sleeve scrubsets in unheard now available in many colors"
      >
        <SingleScreenImage image={require("../assets/fullsleeve.jpg")} />
      </ContentOutsideBottom>

      <ImageBanner />
      <DiscoverBanner />
      <MostWantedBanner />
      <CardSlider title="featured" products={[]} />
      <CategoryImageBanner />
      <DiscoverBoutique />
      <ContentBanner />
      <GenderBanner gender={"Men"} />
      <GenderBanner gender={"Kids"} />
      {/* <CardSlider /> */}
    </View>
  );
}
