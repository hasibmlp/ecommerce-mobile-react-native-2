import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { Text, View } from "react-native";

import CardSlider from "../components/CardSlider";
import ImageBanner from "../components/ImageBanner";
import DiscoverBanner from "../components/DiscoverBanner";
import MostWantedBanner from "./PostCardBanner";
import CategoryImageBanner from "../components/CategoryImageBanner";
import GenderBanner from "../components/GenderBanner";
// import DiscoverBoutique from "../components/DiscoverBoutique";
import ContentBanner from "../components/ContentBanner";
import Overlay from "./Overlay";
import { GET_HOMESCREEN_DATA, GET_PRODUCTS } from "../graphql/queries";
import ContentOutsideTop from "./ContentOutsideTop";
import DoubleScreenImage from "./DoubleScreenImage";
import TripleeScreenImage from "./TripleScreenImage";
import ContentOutsideBottom from "./ContentOutsideBottom";
import SingleScreenImage from "./SingleScreenImage";
import KidsHomeCollection from "./KidsHomeCollections";

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

export default function MainContent({ toggleGenderMenuBar, setState }) {
  const gender = useSelector((state) => state.gender.current);
  const { loading, error, data } = useQuery(GET_HOMESCREEN_DATA);

  if (loading) return <Text>Loading..</Text>;
  if (error) return <Text>Error occured !! {error}</Text>;

  const currentData = data.homeData.filter((item) => item.gender === gender);

  if (gender === "kids")
    return <KidsHomeCollection currentData={currentData} />;

  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
      <ImageBanner />
      <ContentOutsideTop
        title={currentData[0].data.categories[0].title}
        desc={currentData[0].data.categories[0].desc}
      >
        <DoubleScreenImage images={currentData[0].data.categories[0].media} />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={currentData[0].data.categories[1].title}
        desc={currentData[0].data.categories[1].desc}
      >
        <TripleeScreenImage images={currentData[0].data.categories[1].media} />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={currentData[0].data.categories[2].title}
        desc={currentData[0].data.categories[2].desc}
      >
        <DoubleScreenImage images={currentData[0].data.categories[2].media} />
      </ContentOutsideTop>

      <MostWantedBanner />

      <ContentOutsideBottom
        cta="Explore"
        desc="modest full sleeve scrubsets in unheard now available in many colors"
      >
        <SingleScreenImage image={require("../assets/fullsleeve.jpg")} />
      </ContentOutsideBottom>

      <DiscoverBanner />
      <CardSlider
        title={currentData[0].data.collections[0].title}
        products={currentData[0].data.collections[0].products}
      />

      <ContentBanner />

      <CardSlider
        title={currentData[0].data.collections[0].title}
        products={currentData[0].data.collections[0].products}
      />

      <MostWantedBanner />

      <ImageBanner />

      <CategoryImageBanner />

      <ContentBanner />

      {/* <DiscoverBoutique /> */}

      <GenderBanner gender={"Men"} />
      <GenderBanner gender={"Kids"} />
      {/* <CardSlider /> */}
    </View>
  );
}
