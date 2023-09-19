import React from "react";
import { useQuery, gql } from "@apollo/client";
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
import { GET_PRODUCTS } from "../graphql/queries";
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

export default function MainContent({ toggleGenderMenuBar, setState }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <View></View>;
  if (error) {
    console.log(error);
  }

  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
      <ContentOutsideTop
        title="Discover"
        desc="Large collections of scrubsets & labcoats"
      >
        <DoubleScreenImage images={images1} titles={["scrubset", "labcoat"]} />
      </ContentOutsideTop>

      <ContentOutsideTop
        title="Complete Your Look"
        desc="Solid scrub top | Pant | Printed tops"
      >
        <TripleeScreenImage
          images={images2}
          titles={["scrubs top", "pants", "printed tops"]}
        />
      </ContentOutsideTop>

      <ContentOutsideTop
        title="Style Your Way"
        desc="Fashionable Jackets and T-shirts"
      >
        <DoubleScreenImage images={images3} titles={["jackets", "t-shirt"]} />
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
      <CardSlider
        title="featured"
        products={data.collection.products.edges.map((edge) => edge.node)}
      />
      <CategoryImageBanner />
      <DiscoverBoutique />
      <ContentBanner />
      <GenderBanner gender={"Men"} />
      <GenderBanner gender={"Kids"} />
      {/* <CardSlider /> */}
    </View>
  );
}
