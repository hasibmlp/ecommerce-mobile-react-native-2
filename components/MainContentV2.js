import { useQuery } from "@apollo/client";
import { Text, View } from "react-native";
import { GET_COLLECTION, GET_HOME_DATA } from "../graphql/queries";
import Overlay from "./Overlay";
import ImageBanner from "./ImageBanner";
import ContentOutsideTop from "./ContentOutsideTop";
import DoubleScreenImage from "./DoubleScreenImage";
import { useSelector } from "react-redux";
import TripleeScreenImage from "./TripleScreenImage";
import PostCardBanner from "./PostCardBanner";
import ContentBanner from "./ContentBanner";
import GenderBanner from "./GenderBanner";
import CardSlider from "./CardSlider";
import BrandCards from "./BrandCards";
import RoleCards from "./RoleCards";
import SubCategoryCards from "./SubCategoryCards";
import KidsHomeCollection from "./KidsHomeCollections";
import CategoryImageBanner from "./CategoryImageBanner";

export default function MainContentV2({ toggleGenderMenuBar, setState }) {
  const gender = useSelector((state) => state.gender.current);
  const { loading, error, data } = useQuery(GET_HOME_DATA);

  const result = data?.collection.metafield.value;
  if (!result) return <Text>loading..</Text>;
  const homeDatas = JSON.parse(result);

  const homeData = homeDatas.filter((homeData) => homeData.gender === gender);

  if (loading) return <Text>loading...</Text>;
  if (error) return <Text>the error is occured, {error}</Text>;

  if (gender === 'kids') return <KidsHomeCollection homeData={homeData} />

  return (
    <View className="relative">
      <Overlay state={toggleGenderMenuBar} setState={setState} />
      <ImageBanner
        height={homeData[0].data.banners[0].height}
        imgUrl={homeData[0].data.banners[0].url}
      />

      <ContentOutsideTop
        title={homeData[0].data.categories[0].title}
        desc={homeData[0].data.categories[0].desc}
      >
        <DoubleScreenImage images={homeData[0].data.categories[0].media} />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={homeData[0].data.categories[2].title}
        desc={homeData[0].data.categories[1].desc}
      >
        <TripleeScreenImage images={homeData[0].data.categories[1].media} />
      </ContentOutsideTop>

      <ContentOutsideTop
        title={homeData[0].data.categories[2].title}
        desc={homeData[0].data.categories[2].desc}
      >
        <DoubleScreenImage images={homeData[0].data.categories[2].media} />
      </ContentOutsideTop>

      <PostCardBanner
        title={homeData[0].data.bannerCards[0].title}
        desc={homeData[0].data.bannerCards[0].desc}
        media={homeData[0].data.bannerCards[0].media}
        cta={homeData[0].data.bannerCards[0].cta}
      />
      <ContentBanner
        cta={homeData[0].data.bannerCards[2].cta}
        desc={homeData[0].data.bannerCards[2].desc}
        media={homeData[0].data.bannerCards[2].media}
      />

      <BrandCards brandsCollection={homeData[0].data.brandsCollection} />

      {/* <CardSlider id={homeData[0].data.collections[0]} /> */}

      <ImageBanner
        height={homeData[0].data.banners[1].height}
        imgUrl={homeData[0].data.banners[1].url}
      />

      <CardSlider id={homeData[0].data.collections[1]} />

      <PostCardBanner
        title={homeData[0].data.bannerCards[0].title}
        desc={homeData[0].data.bannerCards[0].desc}
        media={homeData[0].data.bannerCards[0].media}
        cta={homeData[0].data.bannerCards[0].cta}
      />

      <ImageBanner
        height={homeData[0].data.banners[2].height}
        imgUrl={homeData[0].data.banners[2].url}
      />

      <CardSlider id={homeData[0].data.collections[2]} />

      <RoleCards roles={homeData[0].data.squreCards} />

      <ContentBanner
        cta={homeData[0].data.bannerCards[1].cta}
        desc={homeData[0].data.bannerCards[1].desc}
        media={homeData[0].data.bannerCards[1].media}
      />

      <PostCardBanner
        title={homeData[0].data.bannerCards[0].title}
        desc={homeData[0].data.bannerCards[0].desc}
        media={homeData[0].data.bannerCards[0].media}
        cta={homeData[0].data.bannerCards[0].cta}
      />

      <CategoryImageBanner categories={homeData[0].data.portraitCategories} />

      <ImageBanner
        height={homeData[0].data.banners[3].height}
        imgUrl={homeData[0].data.banners[3].url}
      />

      <SubCategoryCards categories={homeData[0].data.subCategories} />

      <CardSlider id={homeData[0].data.collections[2]} />

      {gender === "men" ? (
        <GenderBanner gender={"Women"} imgUrl={homeData[0].data.genderImages[0]} />
      ) : (
        <GenderBanner gender={"Men"} imgUrl={homeData[0].data.genderImages[0]} />
      )}

      <GenderBanner gender={"Kids"} imgUrl={homeData[0].data.genderImages[1]} />
    </View>
  );
}
