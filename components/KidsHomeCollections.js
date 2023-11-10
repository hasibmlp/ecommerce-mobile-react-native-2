import ContentBanner from "./ContentBanner";
import ContentOutsideBottom from "./ContentOutsideBottom";
import SingleScreenImage from "./SingleScreenImage";

export default function KidsHomeCollection({ homeData }) {
  return (
    <>
      <ContentBanner
        cta={homeData[0].data.bannerCards[0].cta}
        desc={homeData[0].data.bannerCards[0].desc}
        media={homeData[0].data.bannerCards[0].media}
      />
      <ContentBanner
        cta={homeData[0].data.bannerCards[1].cta}
        desc={homeData[0].data.bannerCards[1].desc}
        media={homeData[0].data.bannerCards[1].media}
      />
      <ContentBanner
        cta={homeData[0].data.bannerCards[0].cta}
        desc={homeData[0].data.bannerCards[0].desc}
        media={homeData[0].data.bannerCards[0].media}
      />
    </>
  );
}
