import React from "react";
import { useQuery, gql } from '@apollo/client';
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
import { GET_PRODUCTS } from "../graphql/queries";

export default function MainContent({ toggleGenderMenuBar, setState }) {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const products = data?.collection?.products?.edges?.map(edge => edge?.node)
  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
      <ImageBanner />
      <DiscoverBanner />
      <MostWantedBanner />
      <CardSlider title="featured" products={products} />
      <CategoryImageBanner />
      <DiscoverBoutique />
      <ContentBanner />
      <GenderBanner gender={"Men"} />
      <GenderBanner gender={"Kids"} />
      {/* <CardSlider /> */}
    </View>
  );
}
